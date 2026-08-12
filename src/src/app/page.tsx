import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ClubCard from "@/components/ClubCard";

const HERO_PLACARDS = [
  { code: "BUS·01", label: "Business & Finance", href: "/clubs?category=Business+%26+Finance" },
  { code: "TEC·04", label: "Technology", href: "/clubs?category=Technology" },
  { code: "SPO·02", label: "Sports & Wellbeing", href: "/clubs?category=Sports+%26+Wellbeing" },
  { code: "CUL·06", label: "Culture & Community", href: "/clubs?category=Culture+%26+Community" },
];

export default async function HomePage() {
  const [featuredClubs, clubCount] = await Promise.all([
    prisma.club.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        name: true,
        category: true,
        tagline: true,
        description: true,
        logoUrl: true,
        _count: { select: { memberships: { where: { status: "APPROVED" } } } },
      },
    }),
    prisma.club.count({ where: { isActive: true } }),
  ]);

  return (
    <>
      {/* Hero — primary CTA sits above the fold on every viewport. */}
      <section className="border-b-2 border-unsw-charcoal bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-block bg-unsw-yellow px-2 py-1 font-mono text-xs font-bold uppercase tracking-wide border border-unsw-charcoal">
              UNSW Bengaluru · Campus Directory
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Every club on campus.
              <br />
              One place to join or run one.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink/80">
              Browse {clubCount || "every"} registered club, apply as a member or executive, and
              track your application — or propose a brand-new club and get it approved.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/clubs"
                className="border-2 border-unsw-charcoal bg-unsw-charcoal px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-unsw-yellow hover:bg-unsw-yellow hover:text-unsw-charcoal transition-colors shadow-brutal"
              >
                Browse the directory
              </Link>
              <Link
                href="/clubs/new"
                className="border-2 border-unsw-charcoal px-6 py-3 font-display text-sm font-bold uppercase tracking-wide hover:bg-paper transition-colors"
              >
                Propose a club
              </Link>
            </div>
          </div>

          {/* Directory-plate grid — Clickable campus wayfinding placards */}
          <div className="grid grid-cols-2 gap-3">
            {HERO_PLACARDS.map((p) => (
              <Link
                key={p.code}
                href={p.href}
                className="group flex aspect-square flex-col justify-between border-2 border-unsw-charcoal bg-unsw-charcoal p-4 text-unsw-yellow first:bg-unsw-yellow first:text-unsw-charcoal even:mt-6 transition-transform hover:-translate-y-1.5 shadow-brutal cursor-pointer"
              >
                <div>
                  <span className="font-mono text-xs font-bold">{p.code}</span>
                  <span className="block mt-1 font-display text-sm font-bold line-clamp-1">{p.label}</span>
                </div>
                <span className="font-display text-2xl font-bold transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Sign in",
              body: "Use your campus Outlook account — seamless single sign-on.",
            },
            {
              n: "02",
              title: "Apply with Note",
              body: "Pick a club, choose Member or Executive, and include your reason for joining.",
            },
            {
              n: "03",
              title: "Get a decision",
              body: "Admins review applications within 3–5 business days. Track status from your dashboard.",
            },
          ].map((step) => (
            <div key={step.n} className="border-2 border-unsw-charcoal bg-white p-5 shadow-brutal">
              <span className="font-mono text-sm text-muted font-bold">{step.n}</span>
              <h3 className="mt-2 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured clubs */}
      {featuredClubs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold">Recently added clubs</h2>
            <Link href="/clubs" className="text-sm font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredClubs.map((club, i) => (
              <ClubCard key={club.slug} club={{ ...club, memberCount: club._count.memberships }} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="border-t-2 border-unsw-charcoal bg-unsw-yellow">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-12 sm:flex-row sm:items-center">
          <h2 className="font-display text-2xl font-bold">
            Got an idea for a club that doesn&apos;t exist yet?
          </h2>
          <Link
            href="/clubs/new"
            className="whitespace-nowrap border-2 border-unsw-charcoal bg-unsw-charcoal px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-unsw-yellow hover:bg-white hover:text-unsw-charcoal transition-colors shadow-brutal"
          >
            Start a proposal
          </Link>
        </div>
      </section>
    </>
  );
}
