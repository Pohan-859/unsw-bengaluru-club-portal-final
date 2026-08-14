import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkApiRateLimit } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rateLimit = checkApiRateLimit(req);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { pin, userEmail } = body;

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { id: true, clubId: true, checkInPin: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Case 1: Student self-checkin using event PIN
    if (pin) {
      if (!event.checkInPin || event.checkInPin !== pin.trim()) {
        return NextResponse.json({ error: "Invalid PIN code" }, { status: 400 });
      }

      const rsvp = await prisma.rSVP.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: session.user.id,
          },
        },
        update: { checkedIn: true, status: "GOING" },
        create: {
          eventId: event.id,
          userId: session.user.id,
          status: "GOING",
          checkedIn: true,
        },
      });

      return NextResponse.json({ success: true, message: "Checked in successfully!", rsvp });
    }

    // Case 2: Executive manually checking in a student by email
    if (userEmail) {
      const viewerMembership = await prisma.membership.findUnique({
        where: {
          userId_clubId: { userId: session.user.id, clubId: event.clubId },
        },
      });

      const isExecOrAdmin =
        session.user.role === "ADMIN" ||
        (viewerMembership?.role === "EXECUTIVE" && viewerMembership?.status === "APPROVED");

      if (!isExecOrAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const targetUser = await prisma.user.findUnique({
        where: { email: userEmail.trim().toLowerCase() },
      });

      if (!targetUser) {
        return NextResponse.json({ error: "User not found with that email" }, { status: 404 });
      }

      const rsvp = await prisma.rSVP.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: targetUser.id,
          },
        },
        update: { checkedIn: true, status: "GOING" },
        create: {
          eventId: event.id,
          userId: targetUser.id,
          status: "GOING",
          checkedIn: true,
        },
      });

      return NextResponse.json({ success: true, message: `Checked in ${targetUser.name || targetUser.email}`, rsvp });
    }

    return NextResponse.json({ error: "Provide either pin or userEmail" }, { status: 400 });
  } catch (error) {
    console.error("Error in checkin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
