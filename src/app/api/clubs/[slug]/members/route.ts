import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const club = await prisma.club.findUnique({
      where: { slug: params.slug },
      select: { id: true, name: true },
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Must be admin or executive
    const viewerMembership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId: session.user.id, clubId: club.id } },
    });

    const isExecOrAdmin =
      session.user.role === "ADMIN" ||
      (viewerMembership?.role === "EXECUTIVE" && viewerMembership?.status === "APPROVED");

    if (!isExecOrAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = await prisma.membership.findMany({
      where: { clubId: club.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const format = req.nextUrl.searchParams.get("format");
    if (format === "csv") {
      const csvHeader = "Name,Email,Role,Custom Title,Status,Applied Date\n";
      const csvRows = members
        .map((m) => {
          const name = `"${(m.user.name || "").replace(/"/g, '""')}"`;
          const email = `"${m.user.email}"`;
          const role = m.role;
          const title = `"${(m.customTitle || "").replace(/"/g, '""')}"`;
          const status = m.status;
          const date = m.createdAt.toISOString().split("T")[0];
          return `${name},${email},${role},${title},${status},${date}`;
        })
        .join("\n");

      return new NextResponse(csvHeader + csvRows, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${club.name.replace(/[^a-z0-9]/gi, "_")}_members.csv"`,
        },
      });
    }

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
