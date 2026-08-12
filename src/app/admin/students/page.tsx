import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUserRow from "@/components/AdminUserRow";

export const metadata: Metadata = {
  title: "Registered Students",
  robots: { index: false },
};

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-unsw-charcoal pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Registered Campus Accounts</h1>
          <p className="mt-1 text-sm text-ink/80">
            View all students and administrators registered on the UNSW Bengaluru portal.
          </p>
        </div>
        <span className="font-mono text-xs font-bold uppercase bg-unsw-yellow border-2 border-unsw-charcoal px-3 py-1.5">
          Total Users: {users.length}
        </span>
      </div>

      <div className="mt-8 border-2 border-unsw-charcoal bg-white shadow-brutal overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-unsw-charcoal bg-paper font-mono text-xs uppercase text-muted">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Activity</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <AdminUserRow key={u.id} user={u} currentUserId={session?.user?.id || ""} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
