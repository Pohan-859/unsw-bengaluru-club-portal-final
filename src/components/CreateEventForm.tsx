'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreateEventFormProps {
  clubId: string;
  clubSlug: string;
}

export default function CreateEventForm({ clubId, clubSlug }: CreateEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      startTime: new Date(formData.get('startTime') as string).toISOString(),
      endTime: new Date(formData.get('endTime') as string).toISOString(),
      capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null,
      isPublic: formData.get('isPublic') === 'on',
      clubId,
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to create event');
      }

      const event = await res.json();
      router.push(`/events/${event.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-status-rejected p-4 border-2 border-unsw-charcoal font-mono text-white shadow-brutal">
          ERROR: {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-display font-bold text-unsw-charcoal mb-2">Event Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full p-3 border-2 border-unsw-charcoal bg-white font-mono shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-display font-bold text-unsw-charcoal mb-2">Description *</label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full p-3 border-2 border-unsw-charcoal bg-white font-mono shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
        />
      </div>

      <div>
        <label htmlFor="location" className="block font-display font-bold text-unsw-charcoal mb-2">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          className="w-full p-3 border-2 border-unsw-charcoal bg-white font-mono shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startTime" className="block font-display font-bold text-unsw-charcoal mb-2">Start Time *</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            required
            className="w-full p-3 border-2 border-unsw-charcoal bg-white font-mono shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block font-display font-bold text-unsw-charcoal mb-2">End Time *</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            required
            className="w-full p-3 border-2 border-unsw-charcoal bg-white font-mono shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
          />
        </div>
      </div>

      <div>
        <label htmlFor="capacity" className="block font-display font-bold text-unsw-charcoal mb-2">Capacity (Optional)</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          min="1"
          className="w-full p-3 border-2 border-unsw-charcoal bg-white font-mono shadow-brutal focus:outline-none focus:ring-2 focus:ring-unsw-yellow"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          defaultChecked
          className="w-6 h-6 border-2 border-unsw-charcoal shadow-brutal accent-unsw-yellow"
        />
        <label htmlFor="isPublic" className="font-display font-bold text-unsw-charcoal">Public Event</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto px-8 py-4 bg-unsw-yellow text-unsw-charcoal font-display font-bold text-lg border-2 border-unsw-charcoal shadow-brutal transition-transform hover:-translate-y-1 disabled:opacity-50"
      >
        {isLoading ? 'CREATING...' : 'CREATE EVENT'}
      </button>
    </form>
  );
}
