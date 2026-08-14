import Link from 'next/link';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    startTime: Date;
    endTime: Date | null;
    capacity: number | null;
    club: {
      name: string;
      slug: string;
    };
    _count?: {
      rsvps: number;
    };
  };
}

export default function EventCard({ event }: EventCardProps) {
  const formatter = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const rsvpCount = event._count?.rsvps || 0;
  const isFull = event.capacity && rsvpCount >= event.capacity;
  const capacityPercent = event.capacity ? Math.min(100, (rsvpCount / event.capacity) * 100) : null;

  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div className="border-2 border-unsw-charcoal bg-white p-6 shadow-brutal transition-transform duration-200 group-hover:-translate-y-1 h-full flex flex-col">
        <div className="mb-2">
          <span className="font-mono text-xs font-bold text-unsw-charcoal uppercase tracking-wider bg-unsw-yellow px-2 py-1 border-2 border-unsw-charcoal">
            {event.club.name}
          </span>
        </div>
        
        <h3 className="font-display text-xl font-bold text-unsw-charcoal mt-3 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="mt-auto space-y-2 text-sm text-unsw-charcoal/80 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>{formatter.format(new Date(event.startTime))}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {event.capacity && (
          <div className="mt-4 pt-4 border-t-2 border-unsw-charcoal border-dashed">
            <div className="flex justify-between text-xs font-mono font-bold mb-1">
              <span>RSVPs: {rsvpCount}/{event.capacity}</span>
              {isFull && <span className="text-status-rejected">FULL</span>}
            </div>
            <div className="h-2 w-full bg-paper border-2 border-unsw-charcoal">
              <div 
                className={`h-full border-r-2 border-unsw-charcoal ${isFull ? 'bg-status-rejected' : 'bg-unsw-yellow'}`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
