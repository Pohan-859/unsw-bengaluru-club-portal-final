import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="text-unsw-yellow font-display font-black text-9xl tracking-tighter drop-shadow-[4px_4px_0_#231F20] mb-4">
        404
      </div>
      <h1 className="text-3xl md:text-5xl font-display font-bold text-unsw-charcoal mb-6 uppercase">
        Club Not Found
      </h1>
      <p className="font-mono text-lg text-unsw-charcoal mb-10 max-w-md">
        The page or club you are looking for has gone missing or never existed in the first place.
      </p>
      <Link 
        href="/directory"
        className="inline-flex items-center gap-3 bg-unsw-yellow border-2 border-unsw-charcoal px-8 py-4 font-mono font-bold uppercase shadow-brutal hover:-translate-y-1 hover:bg-paper transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Directory
      </Link>
    </div>
  );
}
