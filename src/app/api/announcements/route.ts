import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sanitizeText } from '@/lib/sanitize';
import { checkApiRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');

    if (!clubId) {
      return NextResponse.json({ error: 'clubId is required' }, { status: 400 });
    }

    const announcements = await prisma.announcement.findMany({
      where: { clubId },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const { clubId, title, content, isPinned = false } = body;

    if (!clubId || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user is ADMIN or EXECUTIVE of the club
    const membership = await prisma.membership.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: clubId
        }
      }
    });

    const isAuthorized = session.user.role === 'ADMIN' || (membership?.role === 'EXECUTIVE' && membership?.status === 'APPROVED');

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sanitizedTitle = sanitizeText(title);
    const sanitizedContent = sanitizeText(content);

    const announcement = await prisma.announcement.create({
      data: {
        clubId,
        title: sanitizedTitle,
        content: sanitizedContent,
        isPinned,
        authorId: session.user.id
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    revalidatePath(`/clubs/${clubId}`);
    
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
