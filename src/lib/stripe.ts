import Stripe from "stripe";

function getStripeInstance() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Return a proxy that throws helpful errors at runtime
    // but doesn't crash at build time
    return null as unknown as Stripe;
  }
  return new Stripe(key, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

export const stripe = getStripeInstance();

export const PLANS = {
  steward: {
    name: "Steward",
    monthlyPrice: 29700, // cents
    annualPrice: 285100,
    trialDays: 14,
  },
  principal: {
    name: "Principal",
    monthlyPrice: 79700,
    annualPrice: 765100,
    trialDays: 14,
  },
  dynasty: {
    name: "Dynasty",
    monthlyPrice: 199700,
    annualPrice: 1917100,
    trialDays: 14,
  },
} as const;

export type PlanId = keyof typeof PLANS;
