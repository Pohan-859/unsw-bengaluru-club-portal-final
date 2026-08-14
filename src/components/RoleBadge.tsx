import React from 'react';

interface RoleBadgeProps {
  role: 'MEMBER' | 'EXECUTIVE' | string;
  customTitle?: string | null;
  isFounder?: boolean;
}

export default function RoleBadge({ role, customTitle, isFounder }: RoleBadgeProps) {
  const isExecutive = role === 'EXECUTIVE';
  const displayTitle = customTitle || (isExecutive ? 'Executive' : 'Member');

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span
        className={`inline-block px-3 py-1 border-2 border-unsw-charcoal font-mono text-xs uppercase font-bold shadow-[2px_2px_0_0_#231F20] ${
          isExecutive ? 'bg-unsw-charcoal text-unsw-yellow' : 'bg-white text-unsw-charcoal'
        }`}
      >
        {displayTitle}
      </span>
      {isFounder && (
        <span className="inline-block px-2 py-1 bg-unsw-yellow border-2 border-unsw-charcoal font-mono text-[10px] uppercase font-bold shadow-[2px_2px_0_0_#231F20]">
          Founder
        </span>
      )}
    </div>
  );
}
