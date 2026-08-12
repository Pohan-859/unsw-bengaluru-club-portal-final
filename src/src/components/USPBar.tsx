const items = [
  "50+ registered clubs",
  "Applications reviewed in 3–5 business days",
  "One sign-in with your campus Google account",
];

export default function USPBar() {
  return (
    <div className="border-b-2 border-unsw-charcoal bg-unsw-charcoal text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-center font-mono text-xs uppercase tracking-wide">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-6">
            {i > 0 && <span className="hidden text-unsw-yellow sm:inline">/</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
