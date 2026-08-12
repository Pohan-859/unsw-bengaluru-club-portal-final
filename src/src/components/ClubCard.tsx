import Link from "next/link";

export type ClubCardData = {
  slug: string;
  name: string;
  category: string;
  tagline?: string | null;
  description: string;
  logoUrl?: string | null;
  memberCount?: number;
};

export default function ClubCard({ club, index }: { club: ClubCardData; index: number }) {
  const code = `${club.category.slice(0, 3).toUpperCase()}·${String(index + 1).padStart(2, "0")}`;

  return (
    <Link href={`/clubs/${club.slug}`} className="plate flex flex-col justify-between p-5 group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="bg-unsw-charcoal px-2 py-1 font-mono text-xs font-bold text-unsw-yellow">
            {code}
          </span>
          {club.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={club.logoUrl}
              alt={`${club.name} logo`}
              className="h-10 w-10 border-2 border-unsw-charcoal object-cover bg-white"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-10 w-10 items-center justify-center border-2 border-unsw-charcoal bg-unsw-yellow font-display text-sm font-bold text-unsw-charcoal"
            >
              {club.name.charAt(0)}
            </div>
          )}
        </div>

        <h3 className="mt-4 font-display text-lg font-bold leading-snug group-hover:underline">
          {club.name}
        </h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">{club.category}</p>
        <p className="mt-3 line-clamp-3 text-sm text-ink/80">{club.tagline || club.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span>👥 {club.memberCount ?? 0} members</span>
        <span className="font-bold text-unsw-charcoal group-hover:translate-x-1 transition-transform">
          View club →
        </span>
      </div>
    </Link>
  );
}
