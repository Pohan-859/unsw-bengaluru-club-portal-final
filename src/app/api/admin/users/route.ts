import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          memberships: { where: { status: "APPROVED" } },
          registrations: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { userId, role } = (await req.json()) as { userId?: string; role?: "STUDENT" | "ADMIN" };
  if (!userId || (role !== "STUDENT" && role !== "ADMIN")) {
    return NextResponse.json({ error: "userId and valid role required" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/students");

  return NextResponse.json({ user: updatedUser });
}
