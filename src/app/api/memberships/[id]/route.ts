import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/memberships/[id]
// body: { status: "APPROVED" | "REJECTED", feedback?: string }
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

  const membership = await prisma.membership.update({
    where: { id: params.id },
    data: { status, feedback: feedback ?? null },
    include: { club: { select: { slug: true } } },
  });

  revalidatePath("/admin/students");
  revalidatePath("/dashboard");
  if (membership.club?.slug) {
    revalidatePath(`/clubs/${membership.club.slug}`);
  }

  return NextResponse.json({ membership });
}
