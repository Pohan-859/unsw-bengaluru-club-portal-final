import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms governing use of the UNSW Bengaluru Club Portal.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Terms of use</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink/80">
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Eligibility</h2>
          <p className="mt-2">
            This portal is for current UNSW Bengaluru students and staff. Sign-in is restricted to
            campus Google accounts where that restriction is configured.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Accurate information</h2>
          <p className="mt-2">
            Membership applications and club proposals should be truthful. Admins may reject or
            remove requests that misrepresent a club or an applicant.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Club conduct</h2>
          <p className="mt-2">
            Clubs and their executives are expected to follow UNSW&apos;s student code of conduct
            in all activities organised through a club listed on this portal.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-ink">Changes</h2>
          <p className="mt-2">
            These terms may be updated as the portal evolves; continued use after a change means
            you accept the update.
          </p>
        </section>
      </div>

      <p className="mt-10 border-2 border-line p-4 text-xs text-muted">
        Placeholder terms for a student project — have these reviewed before running the portal
        for real club administration.
      </p>
    </div>
  );
}
