"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SignInButton } from "./SignInButton";

const links = [
  { href: "/clubs", label: "Directory" },
  { href: "/clubs/new", label: "Propose a club" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-unsw-charcoal bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/unsw-logo.png"
            alt="UNSW Bengaluru Logo"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="hidden font-display text-sm font-bold uppercase tracking-wider text-unsw-charcoal sm:inline-block border-l-2 border-unsw-charcoal pl-3">
            Club Portal
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-semibold hover:underline">
              {l.label}
            </Link>
          ))}
          {session?.user && (
            <Link href="/dashboard" className="text-sm font-semibold hover:underline">
              Dashboard
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-status-rejected hover:underline"
            >
              Admin
            </Link>
          )}
          <SignInButton />
        </div>

        <button
          className="border-2 border-unsw-charcoal p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-0.5 w-5 bg-unsw-charcoal" />
          <span className="mt-1 block h-0.5 w-5 bg-unsw-charcoal" />
          <span className="mt-1 block h-0.5 w-5 bg-unsw-charcoal" />
        </button>
      </nav>

      {open && (
        <div className="border-t-2 border-unsw-charcoal bg-paper px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold"
              >
                {l.label}
              </Link>
            ))}
            {session?.user && (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-semibold">
                Dashboard
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" onClick={() => setOpen(false)} className="text-sm font-semibold">
                Admin
              </Link>
            )}
            <SignInButton />
          </div>
        </div>
      )}
    </header>
  );
}
