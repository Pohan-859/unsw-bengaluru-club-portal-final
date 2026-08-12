import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const clubs = await prisma.club.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { tagline: { contains: q } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      tagline: true,
      description: true,
      logoUrl: true,
      _count: { select: { memberships: { where: { status: "APPROVED" } } } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ clubs });
}
