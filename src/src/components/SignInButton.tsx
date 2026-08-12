"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function SignInButton({ className = "" }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className={`h-9 w-24 animate-pulse bg-line ${className}`} />;
  }

  if (session) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="hidden font-mono text-xs text-muted sm:inline">
          {session.user?.email}
          {session.user?.role === "ADMIN" && (
            <span className="ml-1.5 inline-block bg-unsw-charcoal px-1.5 py-0.5 text-[10px] font-bold text-unsw-yellow uppercase">
              ADMIN
            </span>
          )}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="border-2 border-unsw-charcoal px-3 py-1.5 text-sm font-semibold hover:bg-unsw-charcoal hover:text-paper transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className={`border-2 border-unsw-charcoal bg-unsw-yellow px-4 py-1.5 text-sm font-semibold text-unsw-charcoal hover:bg-unsw-charcoal hover:text-unsw-yellow transition-colors ${className}`}
    >
      Sign in
    </Link>
  );
}
