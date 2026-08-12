import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import AdminDecisionButtons from "@/components/AdminDecisionButtons";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review club proposals",
  robots: { index: false },
};

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.clubRegistration.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Club proposals</h1>
      <p className="mt-2 text-ink/80">
        Approving creates the club immediately and makes the proposer its founding executive.
      </p>

      {registrations.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No proposals yet.</p>
      ) : (
        <div className="mt-8 divide-y-2 divide-unsw-charcoal border-2 border-unsw-charcoal">
          {registrations.map((r) => (
            <div key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">{r.name}</p>
                  <p className="text-xs text-muted">
                    {r.category} · proposed by {r.user.name || r.user.email} ·{" "}
                    {formatDate(r.createdAt)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-3 text-sm text-ink/80">{r.description}</p>
              {r.meetingPlan && (
                <p className="mt-1 text-xs text-muted">Planned first meeting: {r.meetingPlan}</p>
              )}
              {r.feedback && (
                <p className="mt-2 text-xs text-muted">Your feedback: {r.feedback}</p>
              )}
              {r.status === "PENDING" && (
                <div className="mt-4">
                  <AdminDecisionButtons kind="registrations" id={r.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
