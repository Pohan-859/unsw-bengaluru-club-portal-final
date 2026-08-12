import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & directions",
  description: "Find the UNSW Bengaluru campus and get in touch with the Club Portal team.",
};

const ADDRESS =
  "UNSW Bengaluru Campus, Ground Floor, G1, Mulberry Block, Embassy Manyata Business Park, Bengaluru";

export default function ContactPage() {
  const mapsQuery = encodeURIComponent(ADDRESS);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Contact &amp; directions</h1>
      <p className="mt-2 text-ink/80">
        Questions about a specific club go to that club&apos;s executive once you&apos;re an
        approved member. For anything about the portal itself, reach the student team below.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-bold">Get in touch</h2>
          <dl className="mt-3 space-y-2 text-sm text-ink/80">
            <div>
              <dt className="font-semibold">Email</dt>
              <dd>clubportal@unswbengaluru.edu</dd>
            </div>
            <div>
              <dt className="font-semibold">Campus hours</dt>
              <dd>Monday–Saturday, 9:00 AM–6:00 PM IST</dd>
            </div>
          </dl>

          <h2 className="mt-6 font-display text-lg font-bold">Campus address</h2>
          <address className="mt-2 text-sm not-italic text-ink/80">{ADDRESS}</address>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block border-2 border-unsw-charcoal bg-unsw-yellow px-5 py-2 text-sm font-semibold"
          >
            Get directions →
          </a>
        </div>

        <div className="border-2 border-unsw-charcoal">
          <iframe
            title="Map to UNSW Bengaluru Campus, Embassy Manyata Business Park"
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            className="h-72 w-full md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
