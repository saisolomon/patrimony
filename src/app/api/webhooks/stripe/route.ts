import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;
        if (!clerkUserId) {
          console.error("No clerkUserId in checkout session metadata");
          break;
        }

        // Link Stripe customer to user
        await prisma.user.update({
          where: { clerkUserId },
          data: { stripeCustomerId: session.customer as string },
        });

        // Fetch subscription details from Stripe
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const planId = subscription.metadata?.planId ?? "steward";
        const billingInterval = subscription.metadata?.billingInterval ?? "monthly";

        // Create subscription record
        const user = await prisma.user.findUnique({ where: { clerkUserId } });
        if (user) {
          await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
              stripeSubscriptionId: subscriptionId,
              plan: planId,
              billingInterval,
              status: subscription.status,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            create: {
              userId: user.id,
              stripeSubscriptionId: subscriptionId,
              plan: planId,
              billingInterval,
              status: subscription.status,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "canceled" },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("Payment succeeded:", invoice.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
        if (user) {
          await prisma.subscription.updateMany({
            where: { userId: user.id },
            data: { status: "past_due" },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
