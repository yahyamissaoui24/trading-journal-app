import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function setPlanFromSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;

  const isActive = ["active", "trialing"].includes(subscription.status);
  const firstItem = subscription.items.data[0];
  const currentPeriodEnd = new Date((firstItem?.current_period_end ?? 0) * 1000);
  const priceId = firstItem?.price.id;

  const where = userId ? { id: userId } : { stripeCustomerId: customerId };

  await prisma.user.updateMany({
    where,
    data: {
      plan: isActive ? "PREMIUM" : "FREE",
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        if (checkoutSession.mode === "subscription" && checkoutSession.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            checkoutSession.subscription as string
          );
          await setPlanFromSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await setPlanFromSubscription(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.updateMany({
          where: { stripeCustomerId: subscription.customer as string },
          data: { plan: "FREE", stripeSubscriptionId: null },
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
