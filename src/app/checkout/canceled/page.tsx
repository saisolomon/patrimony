import Link from "next/link";
import { XCircle, ArrowLeft, Shield } from "lucide-react";

export default function CheckoutCanceledPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-warning/10 border-2 border-warning/30 flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-10 h-10 text-warning" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Checkout Canceled
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          No worries — you weren&apos;t charged. Your trial is still waiting for
          you.
        </p>

        <div className="bg-bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-gold" />
            <p className="text-sm font-medium text-text-primary">
              48-Hour Visibility Guarantee
            </p>
          </div>
          <p className="text-sm text-text-secondary text-left">
            If you don&apos;t have complete visibility into your net worth
            within 48 hours of onboarding, we&apos;ll refund your first 3
            months. No questions asked.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all duration-200"
          >
            View Plans Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
