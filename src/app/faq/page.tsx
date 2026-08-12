import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about joining, running, and proposing clubs at UNSW Bengaluru.",
};

const faqs = [
  {
    question: "Who can apply to join a club?",
    answer:
      "Any currently enrolled UNSW Bengaluru student with a campus Google account. Sign in once and you can apply to as many clubs as you like.",
  },
  {
    question: "How long does a decision take?",
    answer:
      "Most membership applications and club proposals are reviewed within 3–5 business days. You can track the status of every request from your dashboard at any time.",
  },
  {
    question: "What's the difference between applying as a Member and an Executive?",
    answer:
      "Member gives you standard access to a club's activities and, once approved, its executive contact details. Executive is for students taking on a leadership or organising role within the club — those applications get a closer look from admins.",
  },
  {
    question: "Can I apply again after being rejected?",
    answer:
      "Yes. Rejected applications include feedback where the reviewer left it, and reapplying from the club page resets your request back to pending.",
  },
  {
    question: "How do I start a brand-new club?",
    answer:
      "Head to \"Propose a club\", describe what it will do and who it's for, and submit it for admin review. If it's approved, the club goes live in the directory immediately and you're added as its founding executive.",
  },
  {
    question: "Who can see a club's executive phone number and email?",
    answer:
      "Only students with an approved membership in that specific club, plus admins. It's hidden from everyone else, including pending applicants, to keep exec contact details from being spammed.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Frequently asked questions</h1>
      <p className="mt-2 text-ink/80">
        Can&apos;t find what you need?{" "}
        <a href="/contact" className="underline">
          Get in touch
        </a>
        .
      </p>
      <div className="mt-8">
        <FAQAccordion items={faqs} />
      </div>
    </div>
  );
}
