import type { Metadata } from "next";
import RegistrationForm from "@/components/RegistrationForm";

export const metadata: Metadata = {
  title: "Propose a new club",
  description: "Submit a formal request to launch a new club at UNSW Bengaluru.",
};

export default function NewClubPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Propose a new club</h1>
      <p className="mt-2 text-ink/80">
        Don&apos;t see a club that fits? Tell us what you want to build and an admin will review
        it. Approved proposals go live in the directory immediately, and you&apos;re added as the
        founding executive.
      </p>
      <div className="mt-8">
        <RegistrationForm />
      </div>
    </div>
  );
}
