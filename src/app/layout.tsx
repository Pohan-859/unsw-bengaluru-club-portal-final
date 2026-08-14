import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

// Meta titles & descriptions (checklist items 7 & 8): a sane sitewide
// default plus a template so every page sets its own <title> that still
// carries the site name.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find and run clubs at UNSW Bengaluru`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Browse every registered club at UNSW Bengaluru, apply to join as a member or executive, and propose new clubs — all in one campus portal.",
  openGraph: {
    title: `${SITE_NAME} — Find and run clubs at UNSW Bengaluru`,
    description:
      "Browse every registered club at UNSW Bengaluru, apply to join, and propose new clubs.",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/unsw-logo.png",
    shortcut: "/unsw-logo.png",
    apple: "/unsw-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <GoogleAnalytics />
        <Providers>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <StickyMobileCTA />
        </Providers>
      </body>
    </html>
  );
}
