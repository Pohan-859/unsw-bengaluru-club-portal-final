import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText, sanitizeUrl, sanitizeEmail } from "@/lib/sanitize";
import { checkApiRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const club = await prisma.club.findUnique({
    where: { slug: params.slug },
  });

  if (!club || !club.isActive) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  let canSeeContact = session?.user?.role === "ADMIN";

  if (session?.user && !canSeeContact) {
    const membership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId: session.user.id, clubId: club.id } },
    });
    canSeeContact = membership?.status === "APPROVED";
  }

  if (!canSeeContact) {
    return NextResponse.json({
      club: {
        ...club,
        execEmail: null,
        execPhone: null,
      },
    });
  }

  return NextResponse.json({ club });
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const rateLimit = checkApiRateLimit(req);
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const club = await prisma.club.findUnique({ where: { slug: params.slug } });
  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  let isExecutive = false;

  if (!isAdmin) {
    const membership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId: session.user.id, clubId: club.id } },
    });
    isExecutive = membership?.role === "EXECUTIVE" && membership?.status === "APPROVED";
  }

  if (!isAdmin && !isExecutive) {
    return NextResponse.json({ error: "Executive or Admin permission required" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  
  const tagline = body.tagline !== undefined ? sanitizeText(body.tagline, 120) : undefined;
  const description = body.description !== undefined ? sanitizeText(body.description, 2000) : undefined;
  const meetingInfo = body.meetingInfo !== undefined ? sanitizeText(body.meetingInfo, 200) : undefined;
  const execName = body.execName !== undefined ? sanitizeText(body.execName, 80) : undefined;
  const execEmail = body.execEmail !== undefined ? sanitizeEmail(body.execEmail) : undefined;
  const execPhone = body.execPhone !== undefined ? sanitizeText(body.execPhone, 30) : undefined;
  const logoUrl = body.logoUrl !== undefined ? sanitizeUrl(body.logoUrl) : undefined;
  const coverUrl = body.coverUrl !== undefined ? sanitizeUrl(body.coverUrl) : undefined;
  const instagram = body.instagram !== undefined ? sanitizeText(body.instagram, 50) : undefined;

  const updatedClub = await prisma.club.update({
    where: { id: club.id },
    data: {
      ...(tagline !== undefined && { tagline: tagline || null }),
      ...(description !== undefined && { description }),
      ...(meetingInfo !== undefined && { meetingInfo: meetingInfo || null }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(execName !== undefined && { execName: execName || null }),
      ...(execEmail !== undefined && { execEmail: execEmail || null }),
      ...(execPhone !== undefined && { execPhone: execPhone || null }),
      ...(instagram !== undefined && { instagram: instagram || null }),
    },
  });

  revalidatePath(`/clubs/${updatedClub.slug}`);
  revalidatePath("/clubs");

  return NextResponse.json({ club: updatedClub });
}
