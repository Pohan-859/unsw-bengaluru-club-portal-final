import type { Metadata } from "next";
import Image from "next/image";
import SignInPanel from "@/components/SignInPanel";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="bg-white p-3 border-2 border-unsw-charcoal shadow-brutal mb-4">
        <Image
          src="/unsw-logo.png"
          alt="UNSW Bengaluru Logo"
          width={180}
          height={50}
          className="h-12 w-auto object-contain"
          priority
        />
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold">Sign in to UNSW Club Portal</h1>
      <p className="mt-2 text-xs text-ink/80">
        Use your UNSW student Outlook account (@student.unsw.edu.au) to apply to clubs, track applications, and propose new ones.
      </p>
      <div className="mt-6 w-full">
        <SignInPanel />
      </div>
    </div>
  );
}
