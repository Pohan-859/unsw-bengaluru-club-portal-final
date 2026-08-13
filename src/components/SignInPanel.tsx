"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPanel() {
  const [submitting, setSubmitting] = useState(false);

  async function handleMicrosoftSignIn() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signIn("azure-ad", { callbackUrl: "/dashboard" });
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className={`w-full space-y-4 ${submitting ? "pointer-events-none" : ""}`}>
      {/* Microsoft Outlook SSO — the only legitimate auth method */}
      <button
        type="button"
        disabled={submitting}
        onClick={handleMicrosoftSignIn}
        className="flex w-full items-center justify-center gap-3 border-2 border-unsw-charcoal bg-[#0078D4] py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:bg-[#005A9E] shadow-brutal disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
        {submitting ? "Connecting to Outlook…" : "Sign in with Microsoft Outlook"}
      </button>

      <p className="text-center text-xs text-muted">
        Use your campus Microsoft account to sign in securely.
      </p>
    </div>
  );
}
