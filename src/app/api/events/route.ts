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
    const past = searchParams.get('past') === 'true';

    const whereClause: any = {};
    if (clubId) {
      whereClause.clubId = clubId;
    }
    
    if (past) {
      whereClause.startTime = { lt: new Date() };
    } else {
      whereClause.startTime = { gte: new Date() };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startTime: past ? 'desc' : 'asc' },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: { rsvps: true }
        }
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
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
    const { clubId, title, description, location, startTime, endTime, capacity, coverUrl, isPublic } = body;

    if (!clubId || !title || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          where: { clubId, role: 'EXECUTIVE' }
        }
      }
    });

    const isSiteAdmin = user?.role === 'ADMIN';
    const isExecutive = (user?.memberships?.length || 0) > 0;

    if (!isSiteAdmin && !isExecutive) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const checkInPin = Math.floor(100000 + Math.random() * 900000).toString();

    const newEvent = await prisma.event.create({
      data: {
        clubId,
        title: sanitizeText(title),
        description: sanitizeText(description || ''),
        location: location ? sanitizeText(location) : null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        capacity: capacity ? parseInt(capacity) : null,
        coverUrl,
        isPublic: isPublic ?? true,
        checkInPin
      }
    });

    revalidatePath('/events');
    revalidatePath(`/clubs/${clubId}`);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
