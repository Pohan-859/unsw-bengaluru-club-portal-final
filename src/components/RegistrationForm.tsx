"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "Academic",
  "Business & Finance",
  "Culture & Community",
  "Entrepreneurship",
  "Sports & Wellbeing",
  "Technology",
  "Arts & Media",
  "Other",
];

export default function RegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", category: categories[0], description: "", meetingPlan: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      router.push(`/thank-you?type=registration&club=${encodeURIComponent(form.name)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-unsw-charcoal bg-white p-6">
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
        Proposed club name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          maxLength={80}
          className="mt-2 w-full border-2 border-line p-2 text-sm normal-case"
          placeholder="e.g. Robotics & Automation Society"
        />
      </label>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
        Category
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="mt-2 w-full border-2 border-line p-2 text-sm normal-case"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
        What will this club do?
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          maxLength={1000}
          className="mt-2 w-full border-2 border-line p-2 text-sm normal-case"
          placeholder="Who it's for, what activities it runs, and why campus needs it."
        />
      </label>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
        Planned first meeting or event (optional)
        <input
          value={form.meetingPlan}
          onChange={(e) => setForm({ ...form, meetingPlan: e.target.value })}
          maxLength={200}
          className="mt-2 w-full border-2 border-line p-2 text-sm normal-case"
          placeholder="e.g. Info session in week 3, Innovation Hub"
        />
      </label>

      {error && <p className="mt-3 text-sm text-status-rejected">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full border-2 border-unsw-charcoal bg-unsw-charcoal py-3 font-display text-sm font-bold uppercase tracking-wide text-unsw-yellow disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit proposal"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Reviewed by campus admin within 3–5 business days.
      </p>
    </form>
  );
}
