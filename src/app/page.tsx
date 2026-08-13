import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ClubCard from "@/components/ClubCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HERO_PLACARDS = [
  { code: "BUS·01", label: "Business & Finance", href: "/clubs?category=Business+%26+Finance", img: "/category-business.jpg" },
  { code: "TEC·04", label: "Technology", href: "/clubs?category=Technology", img: "/category-technology.jpg" },
  { code: "SPO·02", label: "Sports & Wellbeing", href: "/clubs?category=Sports+%26+Wellbeing", img: "/category-sports.jpg" },
  { code: "CUL·06", label: "Culture & Community", href: "/clubs?category=Culture+%26+Community", img: "/category-culture.jpg" },
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

          {/* Directory-plate grid — Clickable campus wayfinding placards with category images */}
          <div className="grid grid-cols-2 gap-3">
            {HERO_PLACARDS.map((p) => (
              <Link
                key={p.code}
                href={p.href}
                className="group relative flex aspect-square flex-col justify-between border-2 border-unsw-charcoal p-4 text-unsw-yellow even:mt-6 transition-transform hover:-translate-y-1.5 shadow-brutal cursor-pointer overflow-hidden"
              >
                <Image
                  src={p.img}
                  alt={p.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-opacity group-hover:from-black/90" />
                <div className="relative z-10">
                  <span className="font-mono text-xs font-bold drop-shadow-md">{p.code}</span>
                  <span className="block mt-1 font-display text-sm font-bold line-clamp-1 drop-shadow-md">{p.label}</span>
                </div>
                <span className="relative z-10 font-display text-2xl font-bold transition-transform group-hover:translate-x-1 drop-shadow-md">→</span>
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

      {/* Closing CTA + Campus highlights (fills the grey area below) */}
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

      {/* Campus highlights — fills the grey area */}
      <section className="bg-paper border-t-2 border-line">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-center">Why join through the portal?</h2>
          <p className="mt-2 text-center text-sm text-ink/70 max-w-xl mx-auto">
            The UNSW Bengaluru Club Portal is the official way to discover, join, and manage campus organizations.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🎯",
                title: "One-click applications",
                desc: "Apply to any club with a single message. No paper forms, no queues.",
              },
              {
                icon: "📊",
                title: "Real-time tracking",
                desc: "Check your application status from your dashboard anytime — no chasing emails.",
              },
              {
                icon: "🛡️",
                title: "Secure & verified",
                desc: "Microsoft Outlook SSO ensures only UNSW students can access the portal.",
              },
              {
                icon: "🚀",
                title: "Launch your own club",
                desc: "Submit a proposal, get admin approval, and your club goes live instantly.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-unsw-charcoal bg-white p-6 shadow-brutal hover:-translate-y-1 transition-transform"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 font-display text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 text-center">
            {[
              { stat: `${clubCount || "6"}+`, label: "Active clubs" },
              { stat: "3–5", label: "Days to review" },
              { stat: "100%", label: "Digital & paperless" },
            ].map((s) => (
              <div key={s.label} className="border-2 border-unsw-charcoal bg-unsw-charcoal p-6 shadow-brutal">
                <span className="font-display text-3xl font-bold text-unsw-yellow">{s.stat}</span>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-paper/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
