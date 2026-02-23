import Link from "next/link";
import {
  Shield,
  Brain,
  Building2,
  Users,
  TrendingUp,
  Check,
  ArrowRight,
  Play,
  AlertTriangle,
  Clock,
  Layers,
  Lock,
  BarChart3,
  Sparkles,
} from "lucide-react";
import FAQ from "@/components/landing/faq";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ========== NAVIGATION ========== */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-wide">
            <span className="text-gold">P</span>
            <span className="text-text-primary">ATRIMONY</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              FAQ
            </a>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-gold-light"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Background gradient effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-gold">
            <Sparkles className="h-4 w-4" />
            <span>Now with AI-Powered Wealth Insights</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl lg:text-7xl">
            Your Entire Empire.{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              One Command Center.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            See every asset, every entity, every dollar — updated in real time.
            The wealth intelligence platform for portfolios over $10M.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-bg-primary transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
            >
              Start Your 14-Day Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-text-primary transition-colors hover:border-border-light hover:bg-bg-card">
              <Play className="h-4 w-4 text-gold" />
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <p className="mt-12 text-sm text-text-muted">
            Trusted by{" "}
            <span className="font-semibold text-text-secondary">
              2,400+ principals
            </span>{" "}
            managing over{" "}
            <span className="font-semibold text-text-secondary">
              $47B in combined assets
            </span>
          </p>
        </div>
      </section>

      {/* ========== LOGOS / SOCIAL PROOF BAR ========== */}
      <section className="border-y border-border/50 bg-bg-secondary/50 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-text-muted">
            As featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Forbes", "Bloomberg", "Financial Times", "Barron's", "WSJ"].map(
              (name) => (
                <span
                  key={name}
                  className="text-lg font-semibold tracking-wide text-text-muted/40 transition-colors hover:text-text-muted/70"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========== PROBLEM SECTION ========== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              The Problem
            </p>
            <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
              Your wealth is scattered across 15+ platforms
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              You built an empire, but you can&apos;t see it all in one place.
              That ends today.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {/* Pain Point 1 */}
            <div className="rounded-2xl border border-border bg-bg-card p-8 transition-colors hover:border-border-light">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10">
                <Layers className="h-6 w-6 text-danger" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-text-primary">
                Fragmented Visibility
              </h3>
              <p className="leading-relaxed text-text-secondary">
                Fragmented visibility across brokerages, banks, and advisors.
                Your net worth is a jigsaw puzzle scattered across a dozen
                logins.
              </p>
            </div>

            {/* Pain Point 2 */}
            <div className="rounded-2xl border border-border bg-bg-card p-8 transition-colors hover:border-border-light">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-text-primary">
                Stale Reports
              </h3>
              <p className="leading-relaxed text-text-secondary">
                Stale quarterly reports that are outdated before you read them.
                By the time your advisor sends a PDF, the numbers are already
                wrong.
              </p>
            </div>

            {/* Pain Point 3 */}
            <div className="rounded-2xl border border-border bg-bg-card p-8 transition-colors hover:border-border-light">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                <AlertTriangle className="h-6 w-6 text-gold" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-text-primary">
                No Structural View
              </h3>
              <p className="leading-relaxed text-text-secondary">
                No single view of your trusts, LLCs, and holding structures.
                You&apos;re making million-dollar decisions without seeing the
                full picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SOLUTION / FEATURES ========== */}
      <section id="features" className="bg-bg-secondary/50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              The Solution
            </p>
            <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Six powerful modules that give you complete command over your
              wealth — all in one secure platform.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: "Real-Time Net Worth Dashboard",
                description:
                  "See your total net worth update in real time across every account, entity, and asset class. No more waiting for quarterly statements.",
              },
              {
                icon: Building2,
                title: "Entity & Trust Structure Map",
                description:
                  "Visualize your entire holding structure — trusts, LLCs, LPs, S-Corps — and how assets flow between them. Interactive and always current.",
              },
              {
                icon: Brain,
                title: "AI-Powered Wealth Insights",
                description:
                  "Get proactive alerts on concentration risk, rebalancing opportunities, and anomalies. Your AI co-pilot surfaces what human eyes miss.",
              },
              {
                icon: BarChart3,
                title: "Tax Exposure Forecasting",
                description:
                  "Model your projected tax liability across federal, state, and estate taxes in real time. Run scenarios before making moves.",
              },
              {
                icon: Lock,
                title: "Secure Document Vault",
                description:
                  "Store trust documents, operating agreements, insurance policies, and estate plans in an encrypted, organized vault accessible to your team.",
              },
              {
                icon: Users,
                title: "Multi-Generational View",
                description:
                  "See wealth across generations. Track gifting strategies, inheritance structures, and next-gen readiness all in one unified view.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-bg-card p-8 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/20">
                  <feature.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== OFFER STACK (Hormozi-style) ========== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              The Grand Slam Offer
            </p>
            <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
              Everything You Get
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Here&apos;s a breakdown of what you&apos;d pay to piece this
              together yourself — and what you actually invest with Patrimony.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <div className="space-y-4">
              {[
                {
                  name: "Core Platform — Real-Time Net Worth Dashboard",
                  value: "$50,000/yr",
                },
                {
                  name: "AI-Powered Wealth Insights Engine",
                  value: "$12,000/yr",
                },
                {
                  name: "Entity & Trust Structure Mapping",
                  value: "$8,000/yr",
                },
                {
                  name: "Tax Exposure Forecasting Module",
                  value: "$15,000/yr",
                },
                {
                  name: "Encrypted Document Vault",
                  value: "$5,000/yr",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-gold" />
                    <span className="text-text-primary">{item.name}</span>
                  </div>
                  <span className="shrink-0 text-text-muted line-through">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 rounded-xl border border-border-light bg-bg-card px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-text-primary">
                  Total Value
                </span>
                <span className="text-lg text-text-muted line-through">
                  $90,000/yr
                </span>
              </div>
            </div>

            {/* Actual Price */}
            <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-gold/10 to-gold/5 px-8 py-8 text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-gold">
                Your Investment
              </p>
              <p className="mt-2 text-4xl font-bold text-text-primary md:text-5xl">
                Starting at{" "}
                <span className="text-gold">$297</span>
                <span className="text-xl font-normal text-text-secondary">
                  /month
                </span>
              </p>
              <p className="mt-3 text-text-secondary">
                That&apos;s over 96% less than building this yourself.
              </p>
              <Link
                href="/sign-up"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 font-semibold text-bg-primary transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
              >
                Start Your 14-Day Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <section id="pricing" className="bg-bg-secondary/50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              Pricing
            </p>
            <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
              Choose Your Tier
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Every plan includes a 14-day free trial. No credit card required
              to start.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {/* Steward Tier */}
            <div className="flex flex-col rounded-2xl border border-border bg-bg-card p-8">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Steward
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  For individuals getting started with consolidated visibility.
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-text-primary">
                    $297
                  </span>
                  <span className="text-text-muted">/month</span>
                </div>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {[
                  "Up to 10 connected accounts",
                  "Basic wealth insights",
                  "Monthly portfolio digest",
                  "Email support",
                  "1GB document vault",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-xl border border-border py-3.5 text-center font-semibold text-text-primary transition-colors hover:border-border-light hover:bg-bg-card-hover"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Principal Tier */}
            <div className="relative flex flex-col rounded-2xl border-2 border-gold/40 bg-bg-card p-8 shadow-lg shadow-gold/5">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-bg-primary">
                  Most Popular
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Principal
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  For principals who need full visibility and AI-powered
                  intelligence.
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gold">$797</span>
                  <span className="text-text-muted">/month</span>
                </div>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {[
                  "Unlimited connected accounts",
                  "Weekly AI wealth briefings",
                  "Full entity & trust mapping",
                  "Annual tax exposure estimate",
                  "Priority support",
                  "10GB document vault",
                  "Advisor seat included",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-xl bg-gold py-3.5 text-center font-semibold text-bg-primary transition-colors hover:bg-gold-light"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Dynasty Tier */}
            <div className="flex flex-col rounded-2xl border border-border bg-bg-card p-8">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Dynasty
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  For families and offices managing wealth across generations.
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-text-primary">
                    $1,997
                  </span>
                  <span className="text-text-muted">/month</span>
                </div>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {[
                  "Everything in Principal",
                  "Family member accounts included",
                  "Daily AI briefings + custom alerts",
                  "Multi-generational wealth view",
                  "Real-time tax scenario modeling",
                  "Unlimited document vault",
                  "Dedicated wealth advisor",
                  "Custom API integrations",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-xl border border-border py-3.5 text-center font-semibold text-text-primary transition-colors hover:border-border-light hover:bg-bg-card-hover"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GUARANTEE ========== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-10 text-center md:p-14">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <Shield className="h-8 w-8 text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
              The 48-Hour Visibility Guarantee
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-secondary">
              If you don&apos;t have complete visibility into your net worth
              within 48 hours of onboarding, we&apos;ll refund your first 3
              months. No questions asked. No fine print. We take on the risk so
              you don&apos;t have to.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="bg-bg-secondary/50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Everything you need to know about Patrimony.
            </p>
          </div>
          <div className="mt-12">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          {/* Background glow */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[100px]" />
            </div>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold text-text-primary md:text-5xl">
              Stop Flying Blind.{" "}
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                See Your Empire.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
              Join 2,400+ principals who replaced spreadsheets, PDFs, and
              guesswork with a single source of truth.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-bg-primary transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
              >
                Start Your 14-Day Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-text-primary transition-colors hover:border-border-light hover:bg-bg-card">
                <Play className="h-4 w-4 text-gold" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border bg-bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="text-xl font-bold tracking-wide">
                <span className="text-gold">P</span>
                <span className="text-text-primary">ATRIMONY</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                Your Legacy, In Real Time.
              </p>
              <p className="mt-2 text-sm text-text-muted">
                The wealth intelligence platform for portfolios over $10M.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  "Features",
                  "Pricing",
                  "Security",
                  "Integrations",
                  "Changelog",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Company
              </h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Press", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-text-muted transition-colors hover:text-text-primary"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Legal
              </h4>
              <ul className="space-y-3">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "SOC 2 Compliance",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Patrimony. All rights reserved.
            </p>
            <p className="text-sm text-text-muted">
              Patrimony — Your Legacy, In Real Time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
