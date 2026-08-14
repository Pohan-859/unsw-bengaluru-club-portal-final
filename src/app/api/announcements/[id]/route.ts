import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sanitizeText } from '@/lib/sanitize';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id }
    });

    if (!existingAnnouncement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user is ADMIN or EXECUTIVE of the club
    const membership = await prisma.membership.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: existingAnnouncement.clubId
        }
      }
    });

    const isAuthorized = session.user.role === 'ADMIN' || (membership?.role === 'EXECUTIVE' && membership?.status === 'APPROVED');

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, isPinned } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = sanitizeText(title);
    if (content !== undefined) dataToUpdate.content = sanitizeText(content);
    if (isPinned !== undefined) dataToUpdate.isPinned = isPinned;

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: dataToUpdate
    });

    revalidatePath(`/clubs/${existingAnnouncement.clubId}`);

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error('Failed to update announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id }
    });

    if (!existingAnnouncement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user is ADMIN or EXECUTIVE of the club
    const membership = await prisma.membership.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: existingAnnouncement.clubId
        }
      }
    });

    const isAuthorized = session.user.role === 'ADMIN' || (membership?.role === 'EXECUTIVE' && membership?.status === 'APPROVED');

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.announcement.delete({
      where: { id }
    });

    revalidatePath(`/clubs/${existingAnnouncement.clubId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
