import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null; // middleware guards this route

  const [memberships, registrations, managedClubs] = await Promise.all([
    prisma.membership.findMany({
      where: { userId: session.user.id },
      include: { club: { select: { name: true, slug: true, category: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.clubRegistration.findMany({
      where: { proposedBy: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.membership.findMany({
      where: {
        userId: session.user.id,
        role: "EXECUTIVE",
        status: "APPROVED",
      },
      include: {
        club: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-unsw-charcoal pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Your dashboard</h1>
          <p className="mt-1 text-sm text-ink/80">
            Signed in as <span className="font-mono font-semibold">{session.user.email}</span>
            {session.user.role === "ADMIN" && (
              <span className="ml-2 bg-unsw-charcoal px-2 py-0.5 font-mono text-xs font-bold text-unsw-yellow">
                ADMIN
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/clubs"
            className="border-2 border-unsw-charcoal bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-paper"
          >
            Browse Directory
          </Link>
          <Link
            href="/clubs/new"
            className="border-2 border-unsw-charcoal bg-unsw-yellow px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-unsw-charcoal hover:text-unsw-yellow"
          >
            Propose a Club
          </Link>
        </div>
      </div>

      {/* Clubs You Manage (Executive Access) */}
      {managedClubs.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-unsw-yellow border border-unsw-charcoal" />
              Clubs You Manage (Executive)
            </h2>
            <span className="font-mono text-xs font-semibold text-muted">
              {managedClubs.length} active leadership {managedClubs.length === 1 ? "role" : "roles"}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {managedClubs.map((m) => (
              <div
                key={m.id}
                className="border-2 border-unsw-charcoal bg-white p-5 shadow-brutal flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block bg-unsw-charcoal px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-unsw-yellow">
                    {m.club.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold">{m.club.name}</h3>
                  {m.club.tagline && <p className="mt-1 text-xs text-ink/70">{m.club.tagline}</p>}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                  <Link
                    href={`/clubs/${m.club.slug}`}
                    className="text-xs font-semibold text-ink hover:underline"
                  >
                    View Club →
                  </Link>
                  <Link
                    href={`/clubs/${m.club.slug}/edit`}
                    className="border-2 border-unsw-charcoal bg-unsw-yellow px-3 py-1 text-xs font-bold uppercase hover:bg-unsw-charcoal hover:text-unsw-yellow"
                  >
                    Edit Club Info ✏️
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Applications */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Your applications</h2>
        {memberships.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            You haven&apos;t applied to any clubs yet.{" "}
            <Link href="/clubs" className="underline">
              Browse the directory
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 divide-y-2 divide-unsw-charcoal border-2 border-unsw-charcoal bg-white">
            {memberships.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <Link href={`/clubs/${m.club.slug}`} className="font-display font-bold hover:underline">
                    {m.club.name}
                  </Link>
                  <p className="text-xs text-muted">
                    Applied as {m.role === "MEMBER" ? "Member" : "Executive"} ·{" "}
                    {formatDate(m.createdAt)}
                  </p>
                  {m.status === "REJECTED" && m.feedback && (
                    <p className="mt-1 text-xs text-status-rejected font-semibold">Feedback: {m.feedback}</p>
                  )}
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Proposals */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Your club proposals</h2>
        {registrations.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No proposals yet.{" "}
            <Link href="/clubs/new" className="underline">
              Propose a new club
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 divide-y-2 divide-unsw-charcoal border-2 border-unsw-charcoal bg-white">
            {registrations.map((r) => {
              const targetSlug = slugify(r.name);
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <p className="font-display font-bold">{r.name}</p>
                    <p className="text-xs text-muted">
                      {r.category} · {formatDate(r.createdAt)}
                    </p>
                    {r.status === "REJECTED" && r.feedback && (
                      <p className="mt-1 text-xs text-status-rejected font-semibold">Feedback: {r.feedback}</p>
                    )}
                    {r.status === "APPROVED" && (
                      <Link href={`/clubs/${targetSlug}`} className="mt-1 block text-xs font-semibold text-unsw-charcoal underline">
                        View live club page →
                      </Link>
                    )}
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
