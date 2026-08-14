"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostAnnouncementFormProps {
  clubId: string;
}

export default function PostAnnouncementForm({ clubId }: PostAnnouncementFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clubId,
          title,
          content,
          isPinned,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post announcement');
      }

      setTitle('');
      setContent('');
      setIsPinned(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-unsw-charcoal bg-paper p-6 shadow-brutal space-y-4">
      <h3 className="font-display font-bold text-xl text-unsw-charcoal mb-4">Post Announcement</h3>
      
      {error && (
        <div className="bg-status-rejected text-paper p-2 border-2 border-unsw-charcoal font-mono text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-1">
        <label htmlFor="title" className="font-mono text-sm font-bold text-unsw-charcoal">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 border-unsw-charcoal p-2 focus:outline-none focus:ring-2 focus:ring-unsw-yellow font-body"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="content" className="font-mono text-sm font-bold text-unsw-charcoal">
          Content
        </label>
        <textarea
          id="content"
          required
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-2 border-unsw-charcoal p-2 focus:outline-none focus:ring-2 focus:ring-unsw-yellow font-body resize-none"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="isPinned"
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="h-4 w-4 border-2 border-unsw-charcoal rounded-none accent-unsw-charcoal cursor-pointer"
        />
        <label htmlFor="isPinned" className="font-mono text-sm font-bold text-unsw-charcoal cursor-pointer">
          Pin Announcement
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-unsw-yellow border-2 border-unsw-charcoal px-4 py-2 font-display font-bold text-unsw-charcoal shadow-brutal hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? 'POSTING...' : 'POST ANNOUNCEMENT'}
      </button>
    </form>
  );
}
