"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDecisionButtons({
  kind,
  id,
}: {
  kind: "memberships" | "registrations";
  id: string;
}) {
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function decide(status: "APPROVED" | "REJECTED") {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/${kind}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, feedback: feedback || undefined }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setShowFeedback(null);
      setFeedback("");
      router.refresh();
    } catch {
      alert("Something went wrong updating this request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (showFeedback) {
    return (
      <div className="mt-3 w-full">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={
            showFeedback === "REJECTED" ? "Optional: why it's being rejected" : "Optional note"
          }
          rows={2}
          maxLength={300}
          className="w-full border-2 border-line p-2 text-sm"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => decide(showFeedback)}
            disabled={submitting}
            className={`flex-1 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60 ${
              showFeedback === "APPROVED" ? "bg-status-approved" : "bg-status-rejected"
            }`}
          >
            {submitting ? "Saving…" : `Confirm ${showFeedback.toLowerCase()}`}
          </button>
          <button
            onClick={() => setShowFeedback(null)}
            className="border-2 border-unsw-charcoal px-3 py-1.5 text-sm font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowFeedback("APPROVED")}
        className="border-2 border-status-approved bg-status-approved-bg px-3 py-1.5 text-sm font-semibold text-status-approved hover:bg-status-approved hover:text-white"
      >
        Approve
      </button>
      <button
        onClick={() => setShowFeedback("REJECTED")}
        className="border-2 border-status-rejected bg-status-rejected-bg px-3 py-1.5 text-sm font-semibold text-status-rejected hover:bg-status-rejected hover:text-white"
      >
        Reject
      </button>
    </div>
  );
}
