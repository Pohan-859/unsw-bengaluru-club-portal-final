"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import RoleBadge from "./RoleBadge";

interface Member {
  id: string;
  role: "MEMBER" | "EXECUTIVE";
  customTitle: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Props {
  clubId: string;
  clubSlug: string;
  members: Member[];
}

export default function MemberManagementTable({ clubSlug, members }: Props) {
  const router = useRouter();
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdateTitle(membershipId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/memberships/${membershipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customTitle: titleInput }),
      });
      if (res.ok) {
        setEditingTitleId(null);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(membershipId: string, status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      const res = await fetch(`/api/memberships/${membershipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    window.open(`/api/clubs/${clubSlug}/members?format=csv`, "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Club Members ({members.length})</h3>
        <button
          type="button"
          onClick={exportCSV}
          className="border-2 border-unsw-charcoal bg-unsw-yellow px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide hover:bg-unsw-charcoal hover:text-unsw-yellow transition-colors shadow-brutal"
        >
          📥 Export Members CSV
        </button>
      </div>

      <div className="overflow-x-auto border-2 border-unsw-charcoal bg-white shadow-brutal">
        <table className="w-full text-left text-sm">
          <thead className="border-b-2 border-unsw-charcoal bg-paper font-mono text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Member</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role / Title</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y border-line">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-paper/50">
                <td className="p-3 font-semibold text-ink">{m.user.name || "Anonymous"}</td>
                <td className="p-3 font-mono text-xs text-muted">{m.user.email}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <RoleBadge role={m.role} customTitle={m.customTitle} />
                    {editingTitleId === m.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          placeholder="e.g. Treasurer"
                          className="border border-unsw-charcoal px-2 py-0.5 font-mono text-xs"
                        />
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleUpdateTitle(m.id)}
                          className="bg-unsw-charcoal px-2 py-0.5 font-mono text-xs text-unsw-yellow"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTitleId(null)}
                          className="text-xs text-muted"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTitleId(m.id);
                          setTitleInput(m.customTitle || "");
                        }}
                        className="text-[10px] font-mono text-muted underline hover:text-ink"
                      >
                        ✏️ Title
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="p-3 text-right flex items-center justify-end gap-2">
                  {m.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(m.id, "APPROVED")}
                        disabled={loading}
                        className="border-2 border-unsw-charcoal bg-status-approved/20 px-2 py-1 text-xs font-bold text-status-approved hover:bg-status-approved hover:text-white transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(m.id, "REJECTED")}
                        disabled={loading}
                        className="border-2 border-unsw-charcoal bg-status-rejected/20 px-2 py-1 text-xs font-bold text-status-rejected hover:bg-status-rejected hover:text-white transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
