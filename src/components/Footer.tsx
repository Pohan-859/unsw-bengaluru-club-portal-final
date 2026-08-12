import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-unsw-charcoal bg-unsw-charcoal pb-16 pt-10 text-paper md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 bg-white p-2 rounded w-fit">
            <Image
              src="/unsw-logo.png"
              alt="UNSW Bengaluru Logo"
              width={160}
              height={44}
              className="h-9 w-auto object-contain"
            />
          </div>
          <p className="mt-3 font-display text-sm font-bold text-unsw-yellow">Campus Club Portal</p>
          <p className="mt-1 text-xs text-paper/70">
            The official portal for discovering, joining and leading student clubs at UNSW Bengaluru.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-paper/50">Navigation</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/clubs" className="hover:underline">
                Club directory
              </Link>
            </li>
            <li>
              <Link href="/clubs/new" className="hover:underline">
                Propose a club
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact &amp; directions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-paper/50">Campus &amp; Legal</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of use
              </Link>
            </li>
          </ul>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm text-unsw-yellow hover:underline"
          >
            Follow campus clubs on Instagram ↗
          </a>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-6xl px-4 font-mono text-xs text-paper/40">
        © {new Date().getFullYear()} UNSW Bengaluru Club Portal. Official Student Community System.
      </p>
    </footer>
  );
}
