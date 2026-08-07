import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Only throw at runtime when a route actually tries to use it, not at build time.
  console.warn("STRIPE_SECRET_KEY is not set. Stripe routes will fail until it is configured.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-07-29.dahlia",
});

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || "";
