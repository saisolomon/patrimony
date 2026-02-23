"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. Patrimony uses bank-level AES-256 encryption at rest and TLS 1.3 in transit. We are SOC 2 Type II certified and undergo annual penetration testing by independent security firms. Your credentials are never stored on our servers — we use read-only tokenized connections through Plaid and similar aggregation partners. Every employee with data access undergoes background checks and operates under strict least-privilege policies.",
  },
  {
    question: "How does Patrimony connect to my accounts?",
    answer:
      "We integrate with over 12,000 financial institutions through secure, read-only connections via Plaid, Yodlee, and direct custodial APIs. For alternative assets — private equity, real estate, art, collectibles — our concierge team works with your advisors to import valuations manually or via API. Most clients are fully connected within 48 hours of onboarding.",
  },
  {
    question: "Can my wealth advisor access my dashboard?",
    answer:
      "Yes. Patrimony supports multi-seat access with granular permissions. You can invite your financial advisor, CPA, estate attorney, or family office staff and control exactly which entities, accounts, and reports each person can view. Advisor access is included at no extra cost on the Principal and Dynasty tiers.",
  },
  {
    question: "What types of assets can I track?",
    answer:
      "Patrimony tracks the full spectrum of wealth: public equities, fixed income, cash and money market accounts, hedge funds, private equity, venture capital, real estate holdings, trusts, LLCs, S-Corps, cryptocurrency, art and collectibles, insurance policies, and structured notes. If it has value, we can track it.",
  },
  {
    question: "How is this different from Personal Capital or Mint?",
    answer:
      "Consumer tools like Personal Capital and Mint were built for mass-market users with simple portfolios. Patrimony was purpose-built for principals with $10M+ in assets who hold wealth across multiple entities, trusts, and jurisdictions. We support entity structure mapping, multi-generational views, AI-powered tax exposure forecasting, and institutional-grade reporting — none of which exist in consumer platforms. Think of it as the difference between a retail brokerage app and a Bloomberg Terminal.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-bg-card transition-colors hover:border-border-light"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <span className="pr-4 text-lg font-medium text-text-primary">
              {faq.question}
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openIndex === index
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-5 leading-relaxed text-text-secondary">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
