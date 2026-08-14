import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import RoleBadge from '@/components/RoleBadge';
import ProfileCard from '@/components/ProfileCard';

interface ProfilePageProps {
  params: { email: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const decodedEmail = decodeURIComponent(params.email);
  const user = await prisma.user.findUnique({ where: { email: decodedEmail } });

  if (!user) {
    return { title: 'User Not Found' };
  }

  return {
    title: `${user.name || 'User'} | UNSW Club Portal`,
    description: user.bio || `Student profile for ${user.name || user.email}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const decodedEmail = decodeURIComponent(params.email);

  const user = await prisma.user.findUnique({
    where: { email: decodedEmail },
    include: {
      memberships: {
        where: { status: 'APPROVED' },
        include: {
          club: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwner = session?.user?.email === user.email;

  if (!user.isProfilePublic && !isOwner) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-[50vh]">
        <div className="border-2 border-unsw-charcoal bg-white p-8 shadow-brutal text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Private Profile</h1>
          <p className="font-body">This profile is private.</p>
        </div>
      </div>
    );
  }

  const founderClubIds = new Set<string>();
  const executiveMemberships = user.memberships.filter(m => m.role === 'EXECUTIVE');
  for (const membership of executiveMemberships) {
    const firstExec = await prisma.membership.findFirst({
      where: { clubId: membership.clubId, role: 'EXECUTIVE' },
      orderBy: { createdAt: 'asc' },
    });
    if (firstExec && firstExec.userId === user.id) {
      founderClubIds.add(membership.clubId);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <ProfileCard user={user} />
      
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold">Clubs</h2>
        
        {user.memberships.length === 0 ? (
          <p className="font-body text-gray-500">Not a member of any clubs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.memberships.map((membership) => (
              <Link key={membership.id} href={`/clubs/${membership.club.slug}`}>
                <div className="block border-2 border-unsw-charcoal bg-paper p-6 shadow-brutal hover:-translate-y-1 transition-transform h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">{membership.club.name}</h3>
                  </div>
                  <div className="mt-4">
                     <RoleBadge 
                       role={membership.role} 
                       customTitle={membership.customTitle} 
                       isFounder={founderClubIds.has(membership.clubId)} 
                     />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
