"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClubData {
  slug: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string;
  meetingInfo: string | null;
  execName: string | null;
  execEmail: string | null;
  execPhone: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  instagram: string | null;
}

export default function EditClubForm({ club }: { club: ClubData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    tagline: club.tagline || "",
    description: club.description || "",
    meetingInfo: club.meetingInfo || "",
    execName: club.execName || "",
    execEmail: club.execEmail || "",
    execPhone: club.execPhone || "",
    logoUrl: club.logoUrl || "",
    coverUrl: club.coverUrl || "",
    instagram: club.instagram || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/clubs/${club.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update club details.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/clubs/${club.slug}`);
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-unsw-charcoal bg-white p-6 space-y-5 shadow-brutal">
      {success && (
        <div className="border-2 border-status-approved bg-status-approved-bg p-3 text-xs font-bold text-status-approved">
          ✓ Club details saved successfully! Redirecting to club page...
        </div>
      )}

      {error && (
        <div className="border-2 border-status-rejected bg-status-rejected-bg p-3 text-xs font-bold text-status-rejected">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-muted">
          Tagline
        </label>
        <input
          type="text"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="e.g. Weekly market briefings & stock pitches."
          className="mt-1.5 w-full border-2 border-line p-2.5 text-sm"
          maxLength={120}
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-muted">
          Description
        </label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Full overview of the club's goals, events, and community."
          className="mt-1.5 w-full border-2 border-line p-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-muted">
          Meeting Schedule &amp; Location
        </label>
        <input
          type="text"
          value={form.meetingInfo}
          onChange={(e) => setForm({ ...form, meetingInfo: e.target.value })}
          placeholder="e.g. Thursdays, 6:00 PM — Block C, Room 204"
          className="mt-1.5 w-full border-2 border-line p-2.5 text-sm"
          maxLength={200}
        />
      </div>

      <div className="border-t-2 border-line pt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Executive Contact Name
          </label>
          <input
            type="text"
            value={form.execName}
            onChange={(e) => setForm({ ...form, execName: e.target.value })}
            placeholder="e.g. Ananya Rao"
            className="mt-1.5 w-full border-2 border-line p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Executive Email
          </label>
          <input
            type="email"
            value={form.execEmail}
            onChange={(e) => setForm({ ...form, execEmail: e.target.value })}
            placeholder="president@club.unswbengaluru.edu"
            className="mt-1.5 w-full border-2 border-line p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Executive Phone
          </label>
          <input
            type="tel"
            value={form.execPhone}
            onChange={(e) => setForm({ ...form, execPhone: e.target.value })}
            placeholder="+91 90000 00001"
            className="mt-1.5 w-full border-2 border-line p-2 text-xs"
          />
        </div>
      </div>

      <div className="border-t-2 border-line pt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Logo Image URL
          </label>
          <input
            type="url"
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="mt-1.5 w-full border-2 border-line p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Instagram Handle
          </label>
          <input
            type="text"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="@unswbengaluru_club"
            className="mt-1.5 w-full border-2 border-line p-2 text-xs"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 border-2 border-unsw-charcoal bg-unsw-yellow py-3 font-display text-sm font-bold uppercase tracking-wide text-unsw-charcoal hover:bg-unsw-charcoal hover:text-unsw-yellow disabled:opacity-60 transition-colors"
        >
          {submitting ? "Saving Changes…" : "Save Club Details"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/clubs/${club.slug}`)}
          className="border-2 border-unsw-charcoal px-5 py-3 font-display text-sm font-bold uppercase hover:bg-paper"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
