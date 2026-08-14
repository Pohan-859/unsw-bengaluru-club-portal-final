import React from 'react';
import { formatDate } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date | string;
  author: {
    name: string | null;
  };
}

interface AnnouncementFeedProps {
  announcements: Announcement[];
}

export default function AnnouncementFeed({ announcements }: AnnouncementFeedProps) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="border-2 border-unsw-charcoal bg-paper p-6 shadow-brutal text-center text-muted font-body">
        No announcements yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => {
        const isPinned = announcement.isPinned;
        return (
          <div
            key={announcement.id}
            className={`border-2 border-unsw-charcoal bg-paper p-6 shadow-brutal transition-transform hover:-translate-y-1 ${
              isPinned ? 'border-l-8 border-l-unsw-yellow' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display font-bold text-xl text-unsw-charcoal">
                {announcement.title}
              </h3>
              {isPinned && (
                <span className="font-mono text-xs bg-unsw-yellow border-2 border-unsw-charcoal px-2 py-1 font-bold">
                  PINNED
                </span>
              )}
            </div>
            <p className="text-sm font-body text-ink whitespace-pre-wrap mb-4">
              {announcement.content}
            </p>
            <div className="flex justify-between items-center text-xs font-mono text-muted border-t-2 border-line pt-2 mt-2">
              <span>By {announcement.author.name || 'Unknown'}</span>
              <span>{formatDate(announcement.createdAt)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
