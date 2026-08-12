import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { checkApiRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = checkApiRateLimit(req);
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const clubId = sanitizeText(body.clubId, 50);
  const role = body.role === "EXECUTIVE" ? "EXECUTIVE" : "MEMBER";
  const message = sanitizeText(body.message, 500);

  if (!clubId) {
    return NextResponse.json({ error: "clubId is required" }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json(
      { error: "A short sentence explaining why you want to join is required." },
      { status: 400 }
    );
  }

  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club || !club.isActive) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  const membership = await prisma.membership.upsert({
    where: { userId_clubId: { userId: session.user.id, clubId } },
    update: { role, message, status: "PENDING", feedback: null },
    create: { userId: session.user.id, clubId, role, message, status: "PENDING" },
  });

  return NextResponse.json({ membership }, { status: 201 });
}
