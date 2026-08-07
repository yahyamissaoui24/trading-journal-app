const NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1";

function apiKey() {
  const key = process.env.NOWPAYMENTS_API_KEY;
  if (!key) throw new Error("NOWPAYMENTS_API_KEY is not set.");
  return key;
}

export async function createNowPayment(params: {
  priceAmount: number;
  priceCurrency: string;
  payCurrency?: string;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
}) {
  const res = await fetch(`${NOWPAYMENTS_API_BASE}/payment`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      pay_currency: params.payCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription,
      ipn_callback_url: params.ipnCallbackUrl,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "NOWPayments payment creation failed.");
  }
  return data as {
    payment_id: string;
    pay_address: string;
    pay_amount: number;
    pay_currency: string;
    price_amount: number;
    price_currency: string;
    order_id: string;
    payment_status: string;
  };
}

// NOWPayments signs IPN callbacks with HMAC-SHA512 over the JSON body with keys
// sorted alphabetically (no spaces). We recompute it and compare.
export function verifyNowPaymentsSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) return false;

  const crypto = require("crypto") as typeof import("crypto");
  const parsed = JSON.parse(rawBody);
  const sorted = JSON.stringify(sortKeys(parsed));
  const computed = crypto.createHmac("sha512", secret).update(sorted).digest("hex");
  return computed === signature;
}

function sortKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = sortKeys(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}

export async function getNowPaymentStatus(paymentId: string) {
  const res = await fetch(`${NOWPAYMENTS_API_BASE}/payment/${paymentId}`, {
    headers: { "x-api-key": apiKey() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Could not fetch payment status.");
  return data as { payment_status: string; pay_currency: string };
}
