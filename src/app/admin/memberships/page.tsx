import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import AdminDecisionButtons from "@/components/AdminDecisionButtons";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review membership applications",
  robots: { index: false },
};

export default async function AdminMembershipsPage() {
  const memberships = await prisma.membership.findMany({
    include: { user: { select: { name: true, email: true } }, club: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Membership applications</h1>
      <p className="mt-2 text-ink/80">Approving grants access to the club's executive contact info.</p>

      {memberships.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No applications yet.</p>
      ) : (
        <div className="mt-8 divide-y-2 divide-unsw-charcoal border-2 border-unsw-charcoal">
          {memberships.map((m) => (
            <div key={m.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">
                    {m.user.name || m.user.email} → {m.club.name}
                  </p>
                  <p className="text-xs text-muted">
                    Applying as {m.role === "MEMBER" ? "Member" : "Executive"} ·{" "}
                    {formatDate(m.createdAt)}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              {m.message && <p className="mt-3 text-sm text-ink/80">&ldquo;{m.message}&rdquo;</p>}
              {m.feedback && <p className="mt-2 text-xs text-muted">Your feedback: {m.feedback}</p>}
              {m.status === "PENDING" && (
                <div className="mt-4">
                  <AdminDecisionButtons kind="memberships" id={m.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
