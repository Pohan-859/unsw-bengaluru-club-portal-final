"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  eventId: string;
  checkInPin: string | null;
  isExecutiveOrAdmin: boolean;
  isCheckedIn: boolean;
}

export default function CheckInPanel({ eventId, checkInPin, isExecutiveOrAdmin, isCheckedIn }: Props) {
  const router = useRouter();
  const [pinInput, setPinInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/events/${eventId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "✅ Checked in successfully!" });
        setPinInput("");
        router.refresh();
      } else {
        setMessage({ text: data.error || "Failed to check in", error: true });
      }
    } catch {
      setMessage({ text: "Network error", error: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailCheckin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/events/${eventId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: emailInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: `✅ ${data.message}` });
        setEmailInput("");
        router.refresh();
      } else {
        setMessage({ text: data.error || "Check-in failed", error: true });
      }
    } catch {
      setMessage({ text: "Network error", error: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-2 border-unsw-charcoal bg-white p-5 shadow-brutal space-y-4">
      <h3 className="font-display text-base font-bold flex items-center gap-2">
        <span>🎟️ Event Check-In</span>
        {isCheckedIn && (
          <span className="bg-status-approved/20 text-status-approved px-2 py-0.5 font-mono text-xs border border-status-approved">
            Checked In ✓
          </span>
        )}
      </h3>

      {/* For Executives: Show Event PIN & Manual Checkin */}
      {isExecutiveOrAdmin && (
        <div className="border-2 border-unsw-charcoal bg-unsw-yellow p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-unsw-charcoal">
              Event PIN Code (Share with attendees)
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-unsw-charcoal bg-white px-3 py-1 border-2 border-unsw-charcoal">
              {checkInPin || "N/A"}
            </span>
          </div>

          <form onSubmit={handleEmailCheckin} className="flex gap-2 pt-2 border-t border-unsw-charcoal/20">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="student.email@unsw.edu.au"
              className="flex-1 border-2 border-unsw-charcoal px-3 py-1 text-xs font-mono"
            />
            <button
              type="submit"
              disabled={loading || !emailInput.trim()}
              className="bg-unsw-charcoal text-unsw-yellow px-3 py-1 font-display text-xs font-bold uppercase hover:bg-white hover:text-unsw-charcoal transition-colors border-2 border-unsw-charcoal"
            >
              Check In Student
            </button>
          </form>
        </div>
      )}

      {/* Student Self-Check-In PIN Input */}
      {!isCheckedIn && (
        <form onSubmit={handlePinSubmit} className="space-y-2">
          <label className="block font-mono text-xs text-muted">
            Enter the 6-digit PIN announced by event organizers:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="123456"
              className="w-32 border-2 border-unsw-charcoal px-3 py-2 font-mono text-center text-lg font-bold tracking-widest uppercase"
            />
            <button
              type="submit"
              disabled={loading || pinInput.length < 6}
              className="border-2 border-unsw-charcoal bg-unsw-yellow px-4 py-2 font-display text-xs font-bold uppercase tracking-wide hover:bg-unsw-charcoal hover:text-unsw-yellow disabled:opacity-60 transition-colors shadow-brutal"
            >
              {loading ? "Checking..." : "Submit PIN"}
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className={`text-xs font-bold ${message.error ? "text-status-rejected" : "text-status-approved"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
