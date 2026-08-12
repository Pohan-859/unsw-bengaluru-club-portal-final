"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date | string;
  _count: {
    memberships: number;
    registrations: number;
  };
}

export default function AdminUserRow({ user, currentUserId }: { user: UserItem; currentUserId: string }) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  async function toggleRole() {
    const nextRole = role === "ADMIN" ? "STUDENT" : "ADMIN";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: nextRole }),
      });
      if (!res.ok) throw new Error("Failed to update user role");
      setRole(nextRole);
      router.refresh();
    } catch {
      alert("Could not update user role.");
    } finally {
      setLoading(false);
    }
  }

  const isSelf = user.id === currentUserId;

  return (
    <tr className="border-b border-line hover:bg-paper/50">
      <td className="p-3 font-semibold text-sm">
        {user.name || "Student"}
        {isSelf && (
          <span className="ml-2 font-mono text-[10px] text-muted uppercase font-bold">(You)</span>
        )}
      </td>
      <td className="p-3 font-mono text-xs text-ink/80">{user.email}</td>
      <td className="p-3">
        <span
          className={`inline-block px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
            role === "ADMIN"
              ? "bg-unsw-charcoal text-unsw-yellow"
              : "bg-paper text-ink border border-line"
          }`}
        >
          {role}
        </span>
      </td>
      <td className="p-3 font-mono text-xs text-muted">
        {user._count.memberships} clubs · {user._count.registrations} proposals
      </td>
      <td className="p-3 font-mono text-xs text-muted">{formatDate(user.createdAt)}</td>
      <td className="p-3 text-right">
        {!isSelf && (
          <button
            onClick={toggleRole}
            disabled={loading}
            className="border border-unsw-charcoal bg-white px-2.5 py-1 text-xs font-bold hover:bg-unsw-yellow transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : role === "ADMIN" ? "Demote to Student" : "Make Admin"}
          </button>
        )}
      </td>
    </tr>
  );
}
