import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thanks — request received",
  robots: { index: false },
};

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { type?: string; club?: string };
}) {
  const isRegistration = searchParams.type === "registration";
  const clubName = searchParams.club || "the club";

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-unsw-charcoal bg-unsw-yellow font-display text-2xl font-bold">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">
        {isRegistration ? "Proposal received" : "Application submitted"}
      </h1>
      <p className="mt-4 text-ink/80">
        {isRegistration
          ? `Thanks for proposing ${clubName}. An admin will review it and get back to you — typically within 3–5 business days.`
          : `Thanks for applying to ${clubName}. You'll see the decision on your dashboard — typically within 3–5 business days.`}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard"
          className="border-2 border-unsw-charcoal bg-unsw-charcoal px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-unsw-yellow"
        >
          Go to dashboard
        </Link>
        <Link
          href="/clubs"
          className="border-2 border-unsw-charcoal px-6 py-3 font-display text-sm font-bold uppercase tracking-wide"
        >
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
