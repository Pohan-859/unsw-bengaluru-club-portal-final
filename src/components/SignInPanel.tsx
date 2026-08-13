"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPanel() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
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

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !email.trim()) return;
    setSubmitting(true);
    try {
      await signIn("campus-email", {
        email: email.trim(),
        name: name.trim() || email.split("@")[0],
        role,
        callbackUrl: role === "ADMIN" ? "/admin" : "/dashboard",
      });
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className={`w-full space-y-4 ${submitting ? "pointer-events-none" : ""}`}>
      {/* Primary Microsoft Outlook Auth */}
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

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-unsw-charcoal/20" />
        </div>
        <span className="relative bg-paper px-3 font-mono text-xs font-semibold uppercase text-muted">
          Or sign in with campus email
        </span>
      </div>

      {/* Email-based login — requires manually entering a real email */}
      <form onSubmit={handleEmailSignIn} className="border-2 border-unsw-charcoal bg-white p-5 space-y-3 shadow-brutal">
        <div>
          <label htmlFor="signin-email" className="block font-mono text-xs font-bold uppercase tracking-wide text-muted">
            Campus Email Address *
          </label>
          <input
            id="signin-email"
            type="email"
            required
            disabled={submitting}
            placeholder="your.email@student.unsw.edu.au"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border-2 border-line p-2.5 text-sm font-mono disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="signin-name" className="block font-mono text-xs font-bold uppercase tracking-wide text-muted">
            Full Name
          </label>
          <input
            id="signin-name"
            type="text"
            disabled={submitting}
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border-2 border-line p-2.5 text-sm disabled:opacity-60"
          />
        </div>

        {/* Role selector */}
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wide text-muted mb-2">
            Sign in as
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`border-2 border-unsw-charcoal py-2 px-3 font-display text-xs font-bold uppercase tracking-wide transition-colors ${
                role === "STUDENT"
                  ? "bg-unsw-charcoal text-unsw-yellow"
                  : "bg-white text-unsw-charcoal hover:bg-paper"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`border-2 border-unsw-charcoal py-2 px-3 font-display text-xs font-bold uppercase tracking-wide transition-colors ${
                role === "ADMIN"
                  ? "bg-unsw-charcoal text-unsw-yellow"
                  : "bg-white text-unsw-charcoal hover:bg-paper"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !email.trim()}
          className="w-full border-2 border-unsw-charcoal bg-unsw-yellow py-2.5 font-display text-xs font-bold uppercase text-unsw-charcoal hover:bg-unsw-charcoal hover:text-unsw-yellow disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Signing In…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
