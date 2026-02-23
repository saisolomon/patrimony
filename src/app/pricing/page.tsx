"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Crown,
  Shield,
  Building2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

const plans = [
  {
    id: "steward",
    name: "Steward",
    icon: Shield,
    monthlyPrice: 297,
    annualPrice: 2851,
    description: "For individuals beginning to consolidate their wealth picture.",
    features: [
      "Up to 10 connected accounts",
      "Basic net worth dashboard",
      "Monthly AI digest",
      "Standard entity mapping",
      "Email support",
      "1 GB document vault",
    ],
    cta: "Start 14-Day Trial",
    ctaLink: "/onboarding",
    highlighted: false,
  },
  {
    id: "principal",
    name: "Principal",
    icon: Crown,
    monthlyPrice: 797,
    annualPrice: 7651,
    description:
      "For those who demand full visibility and proactive intelligence.",
    features: [
      "Unlimited connected accounts",
      "Advanced net worth dashboard",
      "Weekly AI briefings",
      "Full entity & trust mapping",
      "Annual tax exposure estimate",
      "Priority support",
      "10 GB document vault",
    ],
    cta: "Start 14-Day Trial",
    ctaLink: "/onboarding",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "dynasty",
    name: "Dynasty",
    icon: Building2,
    monthlyPrice: 1997,
    annualPrice: 19171,
    description:
      "For families building legacies across generations.",
    features: [
      "Everything in Principal",
      "Family member access (up to 5)",
      "Daily AI insights + custom alerts",
      "Multi-generational wealth view",
      "Real-time tax scenario modeling",
      "Unlimited document vault",
      "Dedicated wealth advisor",
    ],
    cta: "Contact Us",
    ctaLink: "/contact",
    highlighted: false,
  },
];

const comparisonFeatures = [
  {
    category: "Accounts & Connections",
    features: [
      { name: "Connected accounts", steward: "Up to 10", principal: "Unlimited", dynasty: "Unlimited" },
      { name: "Bank & brokerage sync", steward: true, principal: true, dynasty: true },
      { name: "Real estate tracking", steward: true, principal: true, dynasty: true },
      { name: "Alternative investments", steward: false, principal: true, dynasty: true },
      { name: "Private equity & VC", steward: false, principal: true, dynasty: true },
    ],
  },
  {
    category: "Dashboard & Analytics",
    features: [
      { name: "Net worth dashboard", steward: "Basic", principal: "Advanced", dynasty: "Advanced" },
      { name: "Performance analytics", steward: false, principal: true, dynasty: true },
      { name: "Asset allocation view", steward: true, principal: true, dynasty: true },
      { name: "Multi-generational view", steward: false, principal: false, dynasty: true },
      { name: "Custom dashboards", steward: false, principal: true, dynasty: true },
    ],
  },
  {
    category: "AI Intelligence",
    features: [
      { name: "AI digest frequency", steward: "Monthly", principal: "Weekly", dynasty: "Daily" },
      { name: "Custom AI alerts", steward: false, principal: false, dynasty: true },
      { name: "Tax exposure estimate", steward: false, principal: "Annual", dynasty: "Real-time" },
      { name: "Tax scenario modeling", steward: false, principal: false, dynasty: true },
      { name: "Predictive insights", steward: false, principal: true, dynasty: true },
    ],
  },
  {
    category: "Entity Management",
    features: [
      { name: "Entity mapping", steward: "Standard", principal: "Full", dynasty: "Full" },
      { name: "Trust mapping", steward: false, principal: true, dynasty: true },
      { name: "LLC & corp tracking", steward: true, principal: true, dynasty: true },
      { name: "Beneficiary tracking", steward: false, principal: true, dynasty: true },
      { name: "Entity document storage", steward: false, principal: true, dynasty: true },
    ],
  },
  {
    category: "Storage & Support",
    features: [
      { name: "Document vault", steward: "1 GB", principal: "10 GB", dynasty: "Unlimited" },
      { name: "Support level", steward: "Email", principal: "Priority", dynasty: "Dedicated advisor" },
      { name: "Family member access", steward: false, principal: false, dynasty: "Up to 5" },
      { name: "Onboarding assistance", steward: false, principal: true, dynasty: true },
      { name: "Quarterly review call", steward: false, principal: false, dynasty: true },
    ],
  },
];

const faqs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, your current plan stays active until the end of your billing cycle, and we'll pro-rate any difference.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No setup fees, ever. Your subscription price is all-inclusive. We handle the full onboarding process — account connections, entity mapping, and data verification — at no additional cost.",
  },
  {
    question: "What happens after the trial?",
    answer:
      "After your 14-day trial, you'll be billed for your chosen plan. You can cancel anytime during the trial with no charge. We'll send you a reminder 3 days before the trial ends so there are no surprises.",
  },
  {
    question: "Do you offer enterprise pricing?",
    answer:
      "Yes. For family offices and multi-family setups requiring custom configurations, dedicated infrastructure, or white-label solutions, we offer tailored enterprise plans. Contact our team to discuss your specific needs.",
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-text-primary text-sm font-medium">{value}</span>;
  }
  if (value) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/10">
        <Check className="w-4 h-4 text-gold" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-bg-card">
      <X className="w-4 h-4 text-text-muted" />
    </span>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const formatPrice = (monthly: number, annual: number) => {
    if (isAnnual) {
      const monthlyEquiv = Math.round(annual / 12);
      return { display: monthlyEquiv.toLocaleString(), period: "/mo", note: `$${annual.toLocaleString()}/yr` };
    }
    return { display: monthly.toLocaleString(), period: "/mo", note: null };
  };

  const handleCheckout = async (planId: string) => {
    if (planId === "dynasty") return; // Dynasty uses "Contact Us"
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingInterval: isAnnual ? "annual" : "monthly",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Crown className="w-4 h-4 text-bg-primary" />
              </div>
              <span className="text-lg font-semibold text-text-primary tracking-tight">
                Patrimony
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">14-Day Free Trial on All Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Command Your Wealth
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Choose the plan that matches the complexity of your portfolio
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium transition-colors ${
              !isAnnual ? "text-text-primary" : "text-text-muted"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
              isAnnual
                ? "bg-gold border-gold"
                : "bg-bg-card border-border"
            }`}
            role="switch"
            aria-checked={isAnnual}
            aria-label="Toggle annual billing"
          >
            <span
              className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out ${
                isAnnual
                  ? "translate-x-5 bg-bg-primary"
                  : "translate-x-0.5 bg-text-secondary"
              } mt-[1px]`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              isAnnual ? "text-text-primary" : "text-text-muted"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
              Save 20%
            </span>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const price = formatPrice(plan.monthlyPrice, plan.annualPrice);
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-px ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-gold via-gold/40 to-gold/10"
                    : "bg-border"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-gold text-bg-primary shadow-lg shadow-gold/20">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full rounded-2xl p-6 sm:p-8 flex flex-col ${
                    plan.highlighted
                      ? "bg-bg-secondary"
                      : "bg-bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.highlighted
                          ? "bg-gold/15 ring-1 ring-gold/30"
                          : "bg-bg-card-hover ring-1 ring-border"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          plan.highlighted ? "text-gold" : "text-text-secondary"
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-text-primary">
                        ${price.display}
                      </span>
                      <span className="text-text-muted text-sm">
                        {price.period}
                      </span>
                    </div>
                    {price.note && (
                      <p className="text-xs text-text-muted mt-1">
                        Billed annually at {price.note}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            plan.highlighted ? "text-gold" : "text-success"
                          }`}
                        />
                        <span className="text-sm text-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.id === "dynasty" ? (
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-bg-card-hover text-text-primary border border-border hover:border-border-light hover:bg-border/30 transition-all duration-200"
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loadingPlan === plan.id}
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02]"
                          : "bg-bg-card-hover text-text-primary border border-border hover:border-border-light hover:bg-border/30"
                      }`}
                    >
                      {loadingPlan === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting to Stripe...
                        </>
                      ) : (
                        <>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Compare Every Feature
            </h2>
            <p className="text-text-secondary">
              A detailed look at what each plan includes
            </p>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden bg-bg-card">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-bg-secondary border-b border-border">
              <div className="text-sm font-medium text-text-muted">Feature</div>
              <div className="text-sm font-medium text-text-secondary text-center">Steward</div>
              <div className="text-sm font-medium text-gold text-center">Principal</div>
              <div className="text-sm font-medium text-text-secondary text-center">Dynasty</div>
            </div>

            {/* Table Body */}
            {comparisonFeatures.map((category, catIdx) => (
              <div key={category.category}>
                {/* Category Header */}
                <div className="px-6 py-3 bg-bg-primary/50 border-b border-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {category.category}
                  </span>
                </div>
                {category.features.map((feature, featIdx) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-4 gap-4 px-6 py-3 items-center ${
                      featIdx < category.features.length - 1 || catIdx < comparisonFeatures.length - 1
                        ? "border-b border-border/50"
                        : ""
                    } hover:bg-bg-card-hover/50 transition-colors`}
                  >
                    <div className="text-sm text-text-secondary">{feature.name}</div>
                    <div className="flex justify-center">
                      <FeatureValue value={feature.steward} />
                    </div>
                    <div className="flex justify-center">
                      <FeatureValue value={feature.principal} />
                    </div>
                    <div className="flex justify-center">
                      <FeatureValue value={feature.dynasty} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 48-Hour Guarantee */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent" />
            <div className="absolute inset-0 rounded-2xl border border-gold/20" />
            <div className="relative px-8 py-12 sm:px-12 sm:py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                48-Hour Visibility Guarantee
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
                If you don&apos;t have complete visibility into your net worth within 48 hours
                of onboarding, we&apos;ll refund your first 3 months. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary">
              Everything you need to know before getting started
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-bg-card overflow-hidden transition-colors hover:border-border-light"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-text-primary pr-4">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            Ready to See Your Full Picture?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Join the families who have already gained complete visibility over their wealth.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all duration-200"
          >
            Start Your 14-Day Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Crown className="w-3 h-3 text-bg-primary" />
            </div>
            <span className="text-sm font-medium text-text-secondary">
              Patrimony
            </span>
          </div>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Patrimony. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
