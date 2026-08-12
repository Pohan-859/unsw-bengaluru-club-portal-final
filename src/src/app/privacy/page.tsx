import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How the UNSW Bengaluru Club Portal collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink/80">
        <section>
          <h2 className="font-display text-lg font-bold text-ink">What we collect</h2>
          <p className="mt-2">
            When you sign in with Google, we store your name, campus email address and profile
            photo. When you apply to a club or propose a new one, we store the details you submit
            — your chosen role, any message to the club, and the proposal itself.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">How we use it</h2>
          <p className="mt-2">
            Your details are used to process membership and club-registration applications,
            display your application status on your dashboard, and let club executives and admins
            review requests. Executive contact details are only shown to students with an approved
            membership in that specific club.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">What we don&apos;t do</h2>
          <p className="mt-2">
            We don&apos;t sell your data, and we don&apos;t share it outside the portal except
            with the club executives and admins directly involved in reviewing your requests.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Your choices</h2>
          <p className="mt-2">
            You can withdraw a pending application at any time by contacting the portal team, and
            you can request deletion of your account data by emailing
            clubportal@unswbengaluru.edu.
          </p>
        </section>
      </div>

      <p className="mt-10 border-2 border-line p-4 text-xs text-muted">
        This is placeholder policy text for a student project — replace it with wording reviewed
        by your university before handling real student data.
      </p>
    </div>
  );
}
