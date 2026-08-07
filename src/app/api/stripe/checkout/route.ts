import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PREMIUM_PRICE_ID } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!PREMIUM_PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe price is not configured. Set STRIPE_PREMIUM_PRICE_ID." },
      { status: 500 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/settings?upgraded=true`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
