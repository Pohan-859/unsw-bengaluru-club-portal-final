"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="bg-[#FF4444] border-4 border-unsw-charcoal p-6 shadow-brutal mb-8 transform -rotate-2">
        <AlertTriangle className="w-16 h-16 text-unsw-charcoal mx-auto" />
      </div>
      
      <h1 className="text-3xl md:text-5xl font-display font-bold text-unsw-charcoal mb-4 uppercase">
        System Error
      </h1>
      
      <p className="font-mono text-lg text-unsw-charcoal mb-8 max-w-md">
        Something went wrong on our end. Please try again.
      </p>
      
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-3 bg-paper border-2 border-unsw-charcoal px-8 py-4 font-mono font-bold uppercase shadow-brutal hover:-translate-y-1 hover:bg-unsw-yellow transition-all"
      >
        <RefreshCcw className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
}
