import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNowPayment } from "@/lib/nowpayments";
import { PREMIUM_MONTHLY_PRICE_USD } from "@/lib/plan";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const payCurrency: string | undefined = body?.payCurrency;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const orderId = `apex_${session.user.id}_${randomUUID()}`;

  try {
    const payment = await createNowPayment({
      priceAmount: PREMIUM_MONTHLY_PRICE_USD,
      priceCurrency: "usd",
      payCurrency,
      orderId,
      orderDescription: "Apex Journal Premium — 30 days",
      ipnCallbackUrl: `${appUrl}/api/payments/webhook`,
    });

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        paymentId: payment.payment_id,
        orderId,
        status: "WAITING",
        priceAmount: PREMIUM_MONTHLY_PRICE_USD,
        priceCurrency: "usd",
        payCurrency: payment.pay_currency,
      },
    });

    return NextResponse.json({
      paymentId: payment.payment_id,
      payAddress: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
    });
  } catch (err: any) {
    console.error("NOWPayments create error:", err);
    return NextResponse.json({ error: err.message || "Could not create payment." }, { status: 500 });
  }
}
