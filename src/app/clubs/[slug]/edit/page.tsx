import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditClubForm from "@/components/EditClubForm";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const club = await prisma.club.findUnique({ where: { slug: params.slug } });
  if (!club) return { title: "Club Not Found" };
  return { title: `Edit ${club.name}` };
}

export default async function EditClubPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/auth/signin?callbackUrl=/clubs/${params.slug}/edit`);

  const club = await prisma.club.findUnique({ where: { slug: params.slug } });
  if (!club || !club.isActive) notFound();

  const isAdmin = session.user.role === "ADMIN";
  let isExecutive = false;

  if (!isAdmin) {
    const membership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId: session.user.id, clubId: club.id } },
    });
    isExecutive = membership?.role === "EXECUTIVE" && membership?.status === "APPROVED";
  }

  if (!isAdmin && !isExecutive) {
    redirect(`/clubs/${params.slug}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="border-b-2 border-unsw-charcoal pb-4">
        <span className="inline-block bg-unsw-yellow px-2 py-0.5 font-mono text-xs font-bold uppercase text-unsw-charcoal">
          {club.category} Executive Dashboard
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold">Edit {club.name}</h1>
        <p className="mt-1 text-sm text-ink/80">
          Update public details, meeting schedules, executive contacts, and logo images.
        </p>
      </div>

      <div className="mt-8">
        <EditClubForm club={club} />
      </div>
    </div>
  );
}
