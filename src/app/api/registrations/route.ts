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
  const name = sanitizeText(body.name, 80);
  const category = sanitizeText(body.category, 50);
  const description = sanitizeText(body.description, 1000);
  const meetingPlan = sanitizeText(body.meetingPlan, 200);

  if (!name || !category || !description) {
    return NextResponse.json(
      { error: "name, category and description are required" },
      { status: 400 }
    );
  }

  const registration = await prisma.clubRegistration.create({
    data: {
      proposedBy: session.user.id,
      name,
      category,
      description,
      meetingPlan: meetingPlan || null,
    },
  });

  return NextResponse.json({ registration }, { status: 201 });
}
