import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// PATCH /api/registrations/[id]
// body: { status: "APPROVED" | "REJECTED", feedback?: string }
// Approving provisions the live Club record and makes the proposer its
// founding EXECUTIVE with an already-APPROVED membership.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { status, feedback } = (await req.json()) as {
    status?: "APPROVED" | "REJECTED";
    feedback?: string;
  };

  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "status must be APPROVED or REJECTED" }, { status: 400 });
  }

  const registration = await prisma.clubRegistration.findUnique({ where: { id: params.id } });
  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const reg = await tx.clubRegistration.update({
      where: { id: params.id },
      data: { status, feedback: feedback ?? null },
    });

    if (status === "APPROVED") {
      let slug = slugify(registration.name);
      let suffix = 1;
      while (await tx.club.findUnique({ where: { slug } })) {
        suffix += 1;
        slug = `${slugify(registration.name)}-${suffix}`;
      }

      const club = await tx.club.create({
        data: {
          name: registration.name,
          slug,
          category: registration.category,
          description: registration.description,
          meetingInfo: registration.meetingPlan,
        },
      });

      await tx.membership.upsert({
        where: { userId_clubId: { userId: registration.proposedBy, clubId: club.id } },
        update: { role: "EXECUTIVE", status: "APPROVED" },
        create: {
          userId: registration.proposedBy,
          clubId: club.id,
          role: "EXECUTIVE",
          status: "APPROVED",
        },
      });
    }

    return reg;
  });

  return NextResponse.json({ registration: updated });
}
