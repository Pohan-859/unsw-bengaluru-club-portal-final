'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type RSVPStatus = 'GOING' | 'MAYBE' | 'NOT_GOING' | null;

interface RSVPButtonProps {
  eventId: string;
  currentStatus: RSVPStatus;
  capacity?: number | null;
  rsvpCount?: number;
}

export default function RSVPButton({ eventId, currentStatus, capacity, rsvpCount = 0 }: RSVPButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isFull = capacity ? rsvpCount >= capacity : false;
  const canGo = !isFull || currentStatus === 'GOING';

  const handleRSVP = async (status: 'GOING' | 'MAYBE' | 'NOT_GOING') => {
    if (!session) {
      router.push('/signin');
      return;
    }

    setIsLoading(true);
    
    try {
      const isCancelling = currentStatus === status;
      
      if (isCancelling) {
        await fetch(`/api/events/${eventId}/rsvp`, {
          method: 'DELETE',
        });
      } else {
        await fetch(`/api/events/${eventId}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
      }
      
      router.refresh();
    } catch (error) {
      console.error('Failed to RSVP:', error);
      alert('Failed to update RSVP status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleRSVP('GOING')}
        disabled={isLoading || !canGo}
        className={`px-6 py-3 font-mono font-bold border-2 border-unsw-charcoal shadow-brutal transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${
          currentStatus === 'GOING' 
            ? 'bg-status-approved text-unsw-charcoal' 
            : 'bg-white text-unsw-charcoal'
        }`}
      >
        {isLoading && currentStatus === 'GOING' ? 'WAIT...' : 'GOING'}
      </button>

      <button
        onClick={() => handleRSVP('MAYBE')}
        disabled={isLoading}
        className={`px-6 py-3 font-mono font-bold border-2 border-unsw-charcoal shadow-brutal transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${
          currentStatus === 'MAYBE' 
            ? 'bg-status-pending text-unsw-charcoal' 
            : 'bg-white text-unsw-charcoal'
        }`}
      >
        {isLoading && currentStatus === 'MAYBE' ? 'WAIT...' : 'MAYBE'}
      </button>

      <button
        onClick={() => handleRSVP('NOT_GOING')}
        disabled={isLoading}
        className={`px-6 py-3 font-mono font-bold border-2 border-unsw-charcoal shadow-brutal transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${
          currentStatus === 'NOT_GOING' 
            ? 'bg-paper text-unsw-charcoal/60' 
            : 'bg-white text-unsw-charcoal'
        }`}
      >
        {isLoading && currentStatus === 'NOT_GOING' ? 'WAIT...' : 'NOT GOING'}
      </button>
    </div>
  );
}
