import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { planId, billingInterval } = (await req.json()) as {
      planId: PlanId;
      billingInterval: "monthly" | "annual";
    };

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const unitAmount =
      billingInterval === "annual" ? plan.annualPrice : plan.monthlyPrice;
    const interval = billingInterval === "annual" ? "year" : "month";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Patrimony ${plan.name} Plan`,
              description: `${plan.name} tier — ${billingInterval} billing`,
            },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        trial_period_days: plan.trialDays,
        metadata: {
          planId,
          billingInterval,
          clerkUserId: userId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
