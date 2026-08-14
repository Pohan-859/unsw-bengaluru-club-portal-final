import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import CreateEventForm from "@/components/CreateEventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: { clubId?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!searchParams.clubId) {
    redirect("/dashboard");
  }

  const club = await prisma.club.findUnique({
    where: { id: searchParams.clubId },
  });

  if (!club) notFound();

  // Check if executive or admin
  const membership = await prisma.membership.findUnique({
    where: {
      userId_clubId: {
        userId: session.user.id,
        clubId: club.id,
      },
    },
  });

  const isExecutiveOrAdmin =
    session.user.role === "ADMIN" ||
    (membership?.role === "EXECUTIVE" && membership?.status === "APPROVED");

  if (!isExecutiveOrAdmin) {
    redirect(`/clubs/${club.slug}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-wide text-muted">
          {club.name}
        </span>
        <h1 className="font-display text-3xl font-bold">Create New Event</h1>
      </div>
      <CreateEventForm clubId={club.id} clubSlug={club.slug} />
    </div>
  );
}
