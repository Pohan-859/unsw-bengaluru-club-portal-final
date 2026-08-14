import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sanitizeText } from '@/lib/sanitize';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        memberships: {
          where: { status: 'APPROVED' },
          include: {
            club: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[PROFILE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { bio, major, gradYear, isProfilePublic } = body;

    let parsedGradYear = null;
    if (gradYear !== undefined && gradYear !== null) {
      parsedGradYear = parseInt(gradYear, 10);
      if (isNaN(parsedGradYear) || parsedGradYear < 2020 || parsedGradYear > 2035) {
        return new NextResponse('Invalid graduation year', { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(bio !== undefined && { bio: sanitizeText(bio) }),
        ...(major !== undefined && { major: sanitizeText(major) }),
        ...(gradYear !== undefined && { gradYear: parsedGradYear }),
        ...(isProfilePublic !== undefined && { isProfilePublic }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[PROFILE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
