import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkApiRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rateLimit = checkApiRateLimit(request);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['GOING', 'MAYBE', 'NOT_GOING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { capacity: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.capacity && status === 'GOING') {
      const goingCount = await prisma.rSVP.count({
        where: { eventId: params.id, status: 'GOING' }
      });

      const existingRsvp = await prisma.rSVP.findUnique({
        where: { eventId_userId: { eventId: params.id, userId: session.user.id } }
      });

      if ((!existingRsvp || existingRsvp.status !== 'GOING') && goingCount >= event.capacity) {
        return NextResponse.json({ error: 'Event is at capacity' }, { status: 400 });
      }
    }

    const rsvp = await prisma.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId: session.user.id
        }
      },
      update: { status },
      create: {
        eventId: params.id,
        userId: session.user.id,
        status
      }
    });

    revalidatePath(`/events/${params.id}`);

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Error in RSVP POST:', error);
    return NextResponse.json({ error: 'Failed to process RSVP' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.rSVP.delete({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId: session.user.id
        }
      }
    });

    revalidatePath(`/events/${params.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in RSVP DELETE:', error);
    return NextResponse.json({ error: 'Failed to cancel RSVP' }, { status: 500 });
  }
}
