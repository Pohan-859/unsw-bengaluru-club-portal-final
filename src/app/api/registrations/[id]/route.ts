import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { status, feedback } = (await req.json().catch(() => ({}))) as {
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

      // 1. Create the live Club record
      const club = await tx.club.create({
        data: {
          name: registration.name,
          slug,
          category: registration.category,
          description: registration.description,
          meetingInfo: registration.meetingPlan,
          isActive: true,
        },
      });

      // 2. Safely attach proposer as founding EXECUTIVE if user exists
      const user = await tx.user.findUnique({ where: { id: registration.proposedBy } });
      if (user) {
        await tx.membership.upsert({
          where: { userId_clubId: { userId: user.id, clubId: club.id } },
          update: { role: "EXECUTIVE", status: "APPROVED" },
          create: {
            userId: user.id,
            clubId: club.id,
            role: "EXECUTIVE",
            status: "APPROVED",
          },
        });
      }
    }

    return reg;
  });

  // Revalidate static caches across Next.js pages
  revalidatePath("/clubs");
  revalidatePath("/clubs/[slug]", "page");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/admin/registrations");

  return NextResponse.json({ registration: updated });
}
