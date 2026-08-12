export type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <div className="divide-y-2 divide-unsw-charcoal border-2 border-unsw-charcoal">
      {items.map((item) => (
        <details key={item.question} className="group p-4 open:bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold">
            {item.question}
            <span className="ml-4 text-unsw-charcoal transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
