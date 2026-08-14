import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membershipToUpdate = await prisma.membership.findUnique({
    where: { id: params.id },
  });

  if (!membershipToUpdate) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  const viewerMembership = await prisma.membership.findUnique({
    where: {
      userId_clubId: { userId: session.user.id, clubId: membershipToUpdate.clubId },
    },
  });

  const isExecOrAdmin =
    session.user.role === "ADMIN" ||
    (viewerMembership?.role === "EXECUTIVE" && viewerMembership?.status === "APPROVED");

  if (!isExecOrAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const dataToUpdate: any = {};

  if (body.status === "APPROVED" || body.status === "REJECTED") {
    dataToUpdate.status = body.status;
  }
  if (body.feedback !== undefined) {
    dataToUpdate.feedback = body.feedback;
  }
  if (body.customTitle !== undefined) {
    dataToUpdate.customTitle = body.customTitle;
  }

  const membership = await prisma.membership.update({
    where: { id: params.id },
    data: dataToUpdate,
  });

  return NextResponse.json({ membership });
}
