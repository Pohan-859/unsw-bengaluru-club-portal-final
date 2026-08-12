import Link from "next/link";

// Fixed CTA bar, mobile only — keeps the primary action reachable without
// scrolling back up. Sits above the safe-area so it clears iOS home bars.
export default function StickyMobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-unsw-charcoal bg-unsw-yellow md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        href="/clubs"
        className="block px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-unsw-charcoal"
      >
        Browse the club directory →
      </Link>
    </div>
  );
}
