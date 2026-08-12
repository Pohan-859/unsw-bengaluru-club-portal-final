"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function ApplyForm({
  clubId,
  clubName,
  viewerStatus,
}: {
  clubId: string;
  clubName: string;
  viewerStatus: "PENDING" | "APPROVED" | "REJECTED" | string | null;
}) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<"MEMBER" | "EXECUTIVE">("MEMBER");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authStatus === "loading") {
    return <div className="h-40 animate-pulse border-2 border-line bg-white" />;
  }

  if (!session) {
    return (
      <div className="border-2 border-unsw-charcoal bg-white p-6 text-center shadow-brutal">
        <p className="text-sm text-ink/80">Sign in with your campus Outlook account to apply.</p>
        <button
          onClick={() => signIn()}
          className="mt-4 w-full border-2 border-unsw-charcoal bg-unsw-yellow px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-unsw-charcoal hover:bg-unsw-charcoal hover:text-unsw-yellow transition-colors"
        >
          Sign In to Apply
        </button>
      </div>
    );
  }

  if (viewerStatus === "PENDING") {
    return (
      <div className="border-2 border-unsw-charcoal bg-white p-6 text-sm shadow-brutal">
        Your application to {clubName} is <strong>pending review</strong>. You&apos;ll see the
        decision on your{" "}
        <a href="/dashboard" className="underline font-bold">
          dashboard
        </a>
        .
      </div>
    );
  }

  if (viewerStatus === "APPROVED") {
    return (
      <div className="border-2 border-unsw-charcoal bg-status-approved-bg p-6 text-sm text-status-approved font-semibold shadow-brutal">
        ✓ You&apos;re an approved member of {clubName}. Executive contact details are unlocked above.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a short statement explaining why you wish to join.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId, role, message: message.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      router.push(`/thank-you?type=membership&club=${encodeURIComponent(clubName)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-unsw-charcoal bg-white p-6 shadow-brutal">
      <h3 className="font-display text-lg font-bold">
        {viewerStatus === "REJECTED" ? "Apply again" : `Apply to join ${clubName}`}
      </h3>

      <fieldset className="mt-4">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
          Applying as
        </legend>
        <div className="mt-2 flex gap-3">
          {(["MEMBER", "EXECUTIVE"] as const).map((r) => (
            <label
              key={r}
              className={`flex-1 cursor-pointer border-2 px-3 py-2 text-center text-sm font-semibold transition-colors ${
                role === r ? "border-unsw-charcoal bg-unsw-yellow text-unsw-charcoal" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="sr-only"
              />
              {r === "MEMBER" ? "Member" : "Executive"}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
        Why do you want to join? <span className="text-status-rejected font-bold">* (Required)</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={500}
          className="mt-2 w-full border-2 border-line p-2 text-sm normal-case focus:border-unsw-charcoal"
          placeholder="State in a sentence or two why you want to join this club..."
        />
      </label>

      {error && <p className="mt-3 text-xs text-status-rejected font-bold">⚠️ {error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full border-2 border-unsw-charcoal bg-unsw-charcoal py-3 font-display text-sm font-bold uppercase tracking-wide text-unsw-yellow hover:bg-unsw-yellow hover:text-unsw-charcoal disabled:opacity-60 transition-colors"
      >
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
