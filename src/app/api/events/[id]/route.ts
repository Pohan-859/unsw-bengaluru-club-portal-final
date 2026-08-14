import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sanitizeText } from '@/lib/sanitize';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const counts = {
      GOING: event.rsvps.filter(r => r.status === 'GOING').length,
      MAYBE: event.rsvps.filter(r => r.status === 'MAYBE').length,
      NOT_GOING: event.rsvps.filter(r => r.status === 'NOT_GOING').length,
    };

    return NextResponse.json({ ...event, counts });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { clubId: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          where: { clubId: event.clubId, role: 'EXECUTIVE' }
        }
      }
    });

    const isSiteAdmin = user?.role === 'ADMIN';
    const isExecutive = (user?.memberships?.length || 0) > 0;

    if (!isSiteAdmin && !isExecutive) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, location, startTime, endTime, capacity, coverUrl, isPublic } = body;

    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = sanitizeText(title);
    if (description !== undefined) dataToUpdate.description = description ? sanitizeText(description) : null;
    if (location !== undefined) dataToUpdate.location = location ? sanitizeText(location) : null;
    if (startTime) dataToUpdate.startTime = new Date(startTime);
    if (endTime !== undefined) dataToUpdate.endTime = endTime ? new Date(endTime) : null;
    if (capacity !== undefined) dataToUpdate.capacity = capacity ? parseInt(capacity) : null;
    if (coverUrl !== undefined) dataToUpdate.coverUrl = coverUrl;
    if (isPublic !== undefined) dataToUpdate.isPublic = isPublic;

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: dataToUpdate
    });

    revalidatePath('/events');
    revalidatePath(`/events/${params.id}`);
    revalidatePath(`/clubs/${event.clubId}`);

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { clubId: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          where: { clubId: event.clubId, role: 'EXECUTIVE' }
        }
      }
    });

    const isSiteAdmin = user?.role === 'ADMIN';
    const isExecutive = (user?.memberships?.length || 0) > 0;

    if (!isSiteAdmin && !isExecutive) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.event.delete({
      where: { id: params.id }
    });

    revalidatePath('/events');
    revalidatePath(`/clubs/${event.clubId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
