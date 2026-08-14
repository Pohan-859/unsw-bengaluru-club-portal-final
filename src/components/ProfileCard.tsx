import React from 'react';

interface ProfileCardProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    major: string | null;
    gradYear: number | null;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="border-2 border-unsw-charcoal bg-white p-8 shadow-brutal flex flex-col md:flex-row gap-8 items-start md:items-center">
      <div className="flex-shrink-0">
        {user.image ? (
          <img src={user.image} alt={user.name || 'User'} className="w-24 h-24 rounded-full border-2 border-unsw-charcoal object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-unsw-charcoal bg-unsw-yellow flex items-center justify-center font-display text-4xl font-bold">
            {initial}
          </div>
        )}
      </div>
      
      <div className="flex-grow space-y-2">
        <h1 className="font-display text-4xl font-bold">{user.name || 'Anonymous Student'}</h1>
        <p className="font-mono text-unsw-charcoal/80">{user.email}</p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {user.major && (
            <span className="inline-block px-3 py-1 bg-paper border-2 border-unsw-charcoal font-mono text-sm shadow-[2px_2px_0_0_#231F20]">
              {user.major}
            </span>
          )}
          {user.gradYear && (
            <span className="inline-block px-3 py-1 bg-paper border-2 border-unsw-charcoal font-mono text-sm shadow-[2px_2px_0_0_#231F20]">
              Class of {user.gradYear}
            </span>
          )}
        </div>
        
        {user.bio && (
          <p className="font-body pt-4 max-w-2xl">{user.bio}</p>
        )}
      </div>
    </div>
  );
}
