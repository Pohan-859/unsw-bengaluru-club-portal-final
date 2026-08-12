import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin overview",
  robots: { index: false },
};

export default async function AdminOverviewPage() {
  const [pendingMemberships, pendingRegistrations, clubCount, studentCount] = await Promise.all([
    prisma.membership.count({ where: { status: "PENDING" } }),
    prisma.clubRegistration.count({ where: { status: "PENDING" } }),
    prisma.club.count({ where: { isActive: true } }),
    prisma.user.count(),
  ]);

  const cards = [
    {
      href: "/admin/memberships",
      label: "Membership applications",
      value: pendingMemberships,
      hint: "awaiting a decision",
    },
    {
      href: "/admin/registrations",
      label: "Club proposals",
      value: pendingRegistrations,
      hint: "awaiting a decision",
    },
    { href: "/clubs", label: "Active clubs", value: clubCount, hint: "in the directory" },
    { href: "/admin/students", label: "Registered students", value: studentCount, hint: "manage user accounts" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Admin overview</h1>
      <p className="mt-2 text-ink/80">Review incoming requests, manage students, and keep the directory current.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="plate flex flex-col justify-between p-5 hover:bg-paper transition-transform hover:-translate-y-1"
          >
            <span className="font-mono text-xs uppercase tracking-wide text-muted">{c.label}</span>
            <span className="mt-4 font-display text-4xl font-bold">{c.value}</span>
            <span className="mt-1 text-xs text-muted font-semibold">{c.hint} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
