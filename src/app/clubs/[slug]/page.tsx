import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ApplyForm from "@/components/ApplyForm";
import AnnouncementFeed from "@/components/AnnouncementFeed";
import PostAnnouncementForm from "@/components/PostAnnouncementForm";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getClub(slug: string) {
  return prisma.club.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const club = await getClub(params.slug);
  if (!club) return { title: "Club not found" };
  return {
    title: club.name,
    description: club.tagline || club.description.slice(0, 155),
    openGraph: { title: club.name, description: club.tagline || club.description.slice(0, 155) },
  };
}

export default async function ClubDetailPage({ params }: { params: { slug: string } }) {
  const club = await getClub(params.slug);
  if (!club || !club.isActive) notFound();

  const session = await getServerSession(authOptions);

  let viewerMembership = null;
  let canSeeContact = session?.user?.role === "ADMIN";

  if (session?.user && session.user.role !== "ADMIN") {
    viewerMembership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId: session.user.id, clubId: club.id } },
    });
    canSeeContact = viewerMembership?.status === "APPROVED";
  }

  const isExecutiveOrAdmin =
    session?.user?.role === "ADMIN" ||
    (viewerMembership?.role === "EXECUTIVE" && viewerMembership?.status === "APPROVED");

  const [memberCount, events, announcements] = await Promise.all([
    prisma.membership.count({
      where: { clubId: club.id, status: "APPROVED" },
    }),
    prisma.event.findMany({
      where: { clubId: club.id, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      include: {
        club: { select: { name: true, slug: true } },
        _count: { select: { rsvps: true } },
      },
    }),
    prisma.announcement.findMany({
      where: { clubId: club.id },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: { author: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {club.coverUrl && (
        <div className="mb-6 h-48 w-full overflow-hidden border-2 border-unsw-charcoal bg-unsw-charcoal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={club.coverUrl}
            alt={`${club.name} cover banner`}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-block bg-unsw-charcoal px-2.5 py-1 font-mono text-xs font-bold text-unsw-yellow">
          {club.category}
        </span>
        {isExecutiveOrAdmin && (
          <Link
            href={`/clubs/${club.slug}/edit`}
            className="border-2 border-unsw-charcoal bg-unsw-yellow px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide hover:bg-unsw-charcoal hover:text-unsw-yellow transition-colors shadow-brutal"
          >
            Edit Club Info ✏️
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-start gap-4">
        {club.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={club.logoUrl}
            alt={`${club.name} logo`}
            className="h-16 w-16 border-2 border-unsw-charcoal object-cover bg-white"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-16 w-16 items-center justify-center border-2 border-unsw-charcoal bg-unsw-yellow font-display text-2xl font-bold text-unsw-charcoal"
          >
            {club.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-bold">{club.name}</h1>
          {club.tagline && <p className="mt-1 text-ink/70">{club.tagline}</p>}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold">About</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80 border-l-2 border-unsw-yellow pl-3">
              {club.description}
            </p>
          </div>

          {club.meetingInfo && (
            <div>
              <h2 className="font-display text-lg font-bold">When &amp; Where They Meet</h2>
              <div className="mt-2 border-2 border-unsw-charcoal bg-paper p-3 text-sm font-mono text-ink">
                📍 {club.meetingInfo}
              </div>
            </div>
          )}

          {club.instagram && (
            <div>
              <h2 className="font-display text-lg font-bold">Social Media</h2>
              <a
                href={`https://instagram.com/${club.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 border-2 border-unsw-charcoal bg-white px-3 py-1.5 text-xs font-bold hover:bg-unsw-yellow"
              >
                📸 Instagram: {club.instagram} ↗
              </a>
            </div>
          )}

          <div>
            <h2 className="font-display text-lg font-bold">Executive Contact</h2>
            {canSeeContact ? (
              <dl className="mt-2 space-y-1.5 text-sm text-ink/80 border-2 border-unsw-charcoal bg-white p-4">
                {club.execName && (
                  <div>
                    <dt className="inline font-semibold">Contact Person: </dt>
                    <dd className="inline">{club.execName}</dd>
                  </div>
                )}
                {club.execEmail && (
                  <div>
                    <dt className="inline font-semibold">Email: </dt>
                    <dd className="inline font-mono text-xs">{club.execEmail}</dd>
                  </div>
                )}
                {club.execPhone && (
                  <div>
                    <dt className="inline font-semibold">Phone: </dt>
                    <dd className="inline font-mono text-xs">{club.execPhone}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted bg-paper p-3 border-2 border-dashed border-line">
                🔒 Executive contact details are visible to approved members only. Apply below to unlock contact details.
              </p>
            )}
          </div>

          <p className="font-mono text-xs text-muted">👥 {memberCount} approved campus members</p>

          {/* Upcoming Events */}
          <div className="pt-6 border-t-2 border-line">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Upcoming Events</h2>
              {isExecutiveOrAdmin && (
                <Link
                  href={`/events/new?clubId=${club.id}`}
                  className="border-2 border-unsw-charcoal bg-unsw-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide hover:bg-unsw-charcoal hover:text-unsw-yellow transition-colors shadow-brutal"
                >
                  + Create Event
                </Link>
              )}
            </div>
            {events.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {events.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">No upcoming events scheduled right now.</p>
            )}
          </div>

          {/* Announcements / Updates */}
          <div className="pt-6 border-t-2 border-line">
            <h2 className="font-display text-xl font-bold mb-4">Announcements &amp; Updates</h2>
            {isExecutiveOrAdmin && (
              <div className="mb-6">
                <PostAnnouncementForm clubId={club.id} />
              </div>
            )}
            <AnnouncementFeed announcements={announcements} />
          </div>
        </div>

        <div>
          <ApplyForm
            clubId={club.id}
            clubName={club.name}
            viewerStatus={viewerMembership?.status ?? null}
          />
        </div>
      </div>
    </div>
  );
}
