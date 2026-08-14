import { prisma } from '@/lib/prisma';
import EventCard from '@/components/EventCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campus Events | UNSW Bengaluru Club Portal',
  description: 'Discover and RSVP to upcoming events at UNSW Bengaluru.',
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = searchParams;

  const events = await prisma.event.findMany({
    where: {
      isPublic: true,
      startTime: {
        gte: new Date(),
      },
      title: q ? { contains: q, mode: 'insensitive' } : undefined,
      club: category ? { category } : undefined,
    },
    include: {
      club: {
        select: { name: true, slug: true },
      },
      _count: {
        select: { rsvps: true },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  // Basic categories matching the clubs page
  const categories = ['Academic', 'Cultural', 'Sports', 'Technical', 'Social'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-unsw-charcoal mb-4 uppercase">
          Campus Events
        </h1>
        <p className="text-lg font-mono text-unsw-charcoal/80">
          Discover and RSVP to upcoming events across campus.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
          <a
            href="/events"
            className={`px-4 py-2 border-2 border-unsw-charcoal font-mono text-sm font-bold shadow-brutal transition-transform hover:-translate-y-1 whitespace-nowrap ${
              !category ? 'bg-unsw-yellow' : 'bg-white'
            }`}
          >
            All
          </a>
          {categories.map((c) => (
            <a
              key={c}
              href={`/events?category=${c}`}
              className={`px-4 py-2 border-2 border-unsw-charcoal font-mono text-sm font-bold shadow-brutal transition-transform hover:-translate-y-1 whitespace-nowrap ${
                category === c ? 'bg-unsw-yellow' : 'bg-white'
              }`}
            >
              {c}
            </a>
          ))}
        </div>
        
        <form className="flex gap-2">
          <input 
            type="text" 
            name="q" 
            defaultValue={q || ''}
            placeholder="Search events..."
            className="px-4 py-2 border-2 border-unsw-charcoal font-mono text-sm shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
          />
          <button type="submit" className="px-4 py-2 bg-unsw-charcoal text-white font-mono text-sm font-bold shadow-brutal hover:-translate-y-1 transition-transform border-2 border-unsw-charcoal">
            SEARCH
          </button>
        </form>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event as any} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-unsw-charcoal bg-paper">
          <p className="font-mono text-xl text-unsw-charcoal font-bold">
            No upcoming events found.
          </p>
        </div>
      )}
    </div>
  );
}
