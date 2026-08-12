import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ClubCard from "@/components/ClubCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Club directory",
  description:
    "Browse every active club at UNSW Bengaluru by category, from business societies to sports committees.",
};

const DEFAULT_CATEGORIES = [
  "Academic",
  "Business & Finance",
  "Culture & Community",
  "Entrepreneurship",
  "Sports & Wellbeing",
  "Technology",
  "Arts & Media",
];

export default async function ClubsDirectoryPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = searchParams;

  const [clubs, dbCategories] = await Promise.all([
    prisma.club.findMany({
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
      orderBy: { name: "asc" },
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
    prisma.club.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...dbCategories.map((c) => c.category)])
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-unsw-charcoal pb-6">
        <div>
          <span className="inline-block bg-unsw-yellow px-2 py-0.5 font-mono text-xs font-bold uppercase text-unsw-charcoal">
            UNSW Bengaluru Directory
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold">Campus Club Directory</h1>
          <p className="mt-1 text-sm text-ink/80">
            {clubs.length} {clubs.length === 1 ? "club" : "clubs"} active on campus. Sign in to apply or run one.
          </p>
        </div>

        <Link
          href="/clubs/new"
          className="border-2 border-unsw-charcoal bg-unsw-yellow px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide hover:bg-unsw-charcoal hover:text-unsw-yellow shadow-brutal self-start sm:self-auto transition-transform hover:-translate-y-0.5"
        >
          + Propose New Club
        </Link>
      </div>

      {/* Category Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/clubs"
          className={`border-2 border-unsw-charcoal px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
            !category
              ? "bg-unsw-charcoal text-unsw-yellow"
              : "bg-white text-unsw-charcoal hover:bg-paper"
          }`}
        >
          All Categories
        </Link>
        {allCategories.map((c) => (
          <Link
            key={c}
            href={`/clubs?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`border-2 border-unsw-charcoal px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
              category === c
                ? "bg-unsw-charcoal text-unsw-yellow"
                : "bg-white text-unsw-charcoal hover:bg-paper"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Search & Filter Form */}
      <form className="mt-6 flex flex-wrap gap-3" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by club name, keyword, or topic…"
          className="min-w-[240px] flex-1 border-2 border-unsw-charcoal bg-white px-3.5 py-2.5 text-sm"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button className="border-2 border-unsw-charcoal bg-unsw-charcoal px-6 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-unsw-yellow hover:bg-unsw-yellow hover:text-unsw-charcoal transition-colors">
          Search
        </button>
        {(q || category) && (
          <Link
            href="/clubs"
            className="border-2 border-unsw-charcoal bg-white px-4 py-2.5 font-mono text-xs font-bold uppercase hover:bg-paper flex items-center"
          >
            Clear Filters ✕
          </Link>
        )}
      </form>

      {clubs.length === 0 ? (
        <div className="mt-12 border-2 border-dashed border-line bg-paper p-12 text-center text-muted shadow-brutal">
          <p className="font-display text-lg font-bold text-unsw-charcoal">No clubs found matching your search</p>
          <p className="mt-1 text-sm text-ink/70">
            Try searching for another term, selecting a different category, or starting a new club!
          </p>
          <Link
            href="/clubs/new"
            className="mt-5 inline-block border-2 border-unsw-charcoal bg-unsw-yellow px-6 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-unsw-charcoal hover:bg-unsw-charcoal hover:text-unsw-yellow"
          >
            Propose this club now →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club, i) => (
            <ClubCard key={club.slug} club={{ ...club, memberCount: club._count.memberships }} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
