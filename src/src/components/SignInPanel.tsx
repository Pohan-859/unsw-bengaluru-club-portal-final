"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPanel() {
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleQuickSignIn(email: string, name: string, role: "STUDENT" | "ADMIN") {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signIn("outlook-login", {
        email,
        name,
        role,
        callbackUrl: role === "ADMIN" ? "/admin" : "/dashboard",
      });
    } catch {
      setSubmitting(false);
    }
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !customEmail.trim()) return;
    setSubmitting(true);
    try {
      await signIn("outlook-login", {
        email: customEmail.trim(),
        name: customName.trim() || customEmail.split("@")[0],
        role: "STUDENT",
        callbackUrl: "/dashboard",
      });
    } catch {
      setSubmitting(false);
    }
  }

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
          Or Campus Quick Sign In
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={() =>
            handleQuickSignIn("student@student.unsw.edu.au", "UNSW Student", "STUDENT")
          }
          className="border-2 border-unsw-charcoal bg-white py-3 px-4 text-center font-display text-xs font-bold uppercase tracking-wide text-unsw-charcoal transition-transform hover:-translate-y-0.5 hover:border-unsw-yellow shadow-brutal disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in…" : "Student Login"}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() =>
            handleQuickSignIn("admin@unswbengaluru.edu", "Campus Admin", "ADMIN")
          }
          className="border-2 border-unsw-charcoal bg-unsw-charcoal py-3 px-4 text-center font-display text-xs font-bold uppercase tracking-wide text-unsw-yellow transition-transform hover:-translate-y-0.5 hover:border-unsw-yellow shadow-brutal disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in…" : "Admin Login"}
        </button>
      </div>

      <form onSubmit={handleCustomSubmit} className="mt-4 border-2 border-unsw-charcoal bg-white p-4 space-y-3 shadow-brutal">
        <label className="block text-left font-mono text-xs font-bold uppercase tracking-wide text-muted">
          Campus Email Address
        </label>
        <input
          type="email"
          required
          disabled={submitting}
          placeholder="your.email@student.unsw.edu.au"
          value={customEmail}
          onChange={(e) => setCustomEmail(e.target.value)}
          className="w-full border-2 border-line p-2.5 text-xs font-mono disabled:opacity-60"
        />
        <input
          type="text"
          disabled={submitting}
          placeholder="Full Name"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full border-2 border-line p-2.5 text-xs disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting || !customEmail.trim()}
          className="w-full border-2 border-unsw-charcoal bg-unsw-yellow py-2.5 font-display text-xs font-bold uppercase text-unsw-charcoal hover:bg-unsw-charcoal hover:text-unsw-yellow disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Signing In…" : "Sign In with Email"}
        </button>
      </form>
    </div>
  );
}
