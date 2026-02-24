"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Crown } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Welcome to Patrimony
        </h1>
        <p className="text-lg text-text-secondary mb-2">
          Your subscription is active
        </p>
        <p className="text-sm text-text-muted mb-8">
          Your 14-day free trial has started. You won&apos;t be charged until
          the trial ends.
        </p>

        <div className="bg-bg-card border border-border rounded-xl p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/15 ring-1 ring-gold/30 flex items-center justify-center">
              <Crown className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                What happens next
              </p>
              <p className="text-xs text-text-muted">
                Session: {sessionId?.slice(0, 20)}...
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "Explore your personalized dashboard",
              "Review your AI-powered insights",
              "Connect your financial accounts",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-gold">
                    {i + 1}
                  </span>
                </span>
                <span className="text-sm text-text-secondary">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all duration-200"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-text-muted mt-6">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="text-text-muted">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
