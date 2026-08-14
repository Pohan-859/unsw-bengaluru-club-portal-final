import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RSVPButton from '@/components/RSVPButton';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    select: { title: true, description: true },
  });
  
  if (!event) return { title: 'Event Not Found' };
  
  return {
    title: `${event.title} | UNSW Bengaluru Events`,
    description: event.description.substring(0, 160),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      club: {
        select: { name: true, slug: true, coverUrl: true, logoUrl: true },
      },
      rsvps: {
        include: {
          user: { select: { id: true, name: true, image: true } }
        }
      }
    },
  });

  if (!event) {
    notFound();
  }

  const formatter = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const goingRSVPs = event.rsvps.filter(r => r.status === 'GOING');
  const rsvpCount = goingRSVPs.length;
  const isFull = event.capacity && rsvpCount >= event.capacity;
  const capacityPercent = event.capacity ? Math.min(100, (rsvpCount / event.capacity) * 100) : null;
  
  let currentUserRSVP = null;
  if (session?.user) {
    const userRsvp = event.rsvps.find(r => r.userId === session.user.id);
    if (userRsvp) {
      currentUserRSVP = userRsvp.status;
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/events" className="inline-flex items-center gap-2 font-mono text-sm font-bold text-unsw-charcoal hover:underline hover:-translate-y-0.5 transition-transform">
          ← BACK TO EVENTS
        </Link>
      </div>

      <div className="border-2 border-unsw-charcoal bg-white shadow-brutal overflow-hidden mb-12">
        {/* Hero Cover Image */}
        <div className="h-48 md:h-64 bg-unsw-yellow border-b-2 border-unsw-charcoal flex items-center justify-center p-6 text-center relative">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-unsw-charcoal z-10 max-w-4xl">
            {event.title}
          </h1>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4 font-mono">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border-2 border-unsw-charcoal bg-paper flex items-center justify-center shadow-brutal flex-shrink-0">
                    🕒
                  </div>
                  <div>
                    <h3 className="font-bold text-unsw-charcoal">WHEN</h3>
                    <p>{formatter.format(new Date(event.startTime))}</p>
                    {event.endTime && (
                      <p className="text-sm text-unsw-charcoal/70">to {formatter.format(new Date(event.endTime))}</p>
                    )}
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-unsw-charcoal bg-paper flex items-center justify-center shadow-brutal flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <h3 className="font-bold text-unsw-charcoal">WHERE</h3>
                      <p>{event.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border-2 border-unsw-charcoal bg-paper flex items-center justify-center shadow-brutal flex-shrink-0">
                    🎪
                  </div>
                  <div>
                    <h3 className="font-bold text-unsw-charcoal">HOSTED BY</h3>
                    <Link href={`/clubs/${event.club.slug}`} className="hover:underline font-bold text-unsw-charcoal inline-block mt-1 bg-unsw-yellow px-2 py-0.5 border-2 border-unsw-charcoal">
                      {event.club.name}
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold mb-4 uppercase border-b-2 border-unsw-charcoal pb-2">About This Event</h3>
                <div className="prose prose-lg max-w-none font-body whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="p-6 border-2 border-unsw-charcoal bg-paper shadow-brutal">
                <h3 className="font-display font-bold text-xl mb-4">RSVP</h3>
                
                {event.capacity && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-mono font-bold mb-2">
                      <span>{rsvpCount} / {event.capacity} Spots</span>
                      {isFull && <span className="text-status-rejected">FULL</span>}
                    </div>
                    <div className="h-3 w-full bg-white border-2 border-unsw-charcoal">
                      <div 
                        className={`h-full border-r-2 border-unsw-charcoal ${isFull ? 'bg-status-rejected' : 'bg-unsw-yellow'}`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <RSVPButton 
                  eventId={event.id} 
                  currentStatus={currentUserRSVP as any}
                  capacity={event.capacity}
                  rsvpCount={rsvpCount}
                />
              </div>

              {goingRSVPs.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-lg mb-4 uppercase border-b-2 border-unsw-charcoal pb-2">
                    Who's Going ({goingRSVPs.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {goingRSVPs.map(rsvp => (
                      <div 
                        key={rsvp.user.id} 
                        className="flex items-center gap-2 border-2 border-unsw-charcoal bg-white px-3 py-1.5 shadow-brutal"
                        title={rsvp.user.name || 'Anonymous User'}
                      >
                        <span className="font-mono text-sm font-bold truncate max-w-[120px]">
                          {rsvp.user.name?.split(' ')[0] || 'User'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
