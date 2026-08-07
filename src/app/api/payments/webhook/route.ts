import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNowPaymentsSignature } from "@/lib/nowpayments";
import { PREMIUM_DURATION_DAYS } from "@/lib/plan";

export const runtime = "nodejs";

const SUCCESS_STATUSES = ["confirmed", "finished"];
const TERMINAL_FAIL_STATUSES = ["failed", "expired"];

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nowpayments-sig");

  if (!verifyNowPaymentsSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const paymentId = String(payload.payment_id);
  const status = String(payload.payment_status || "").toLowerCase();

  const payment = await prisma.payment.findUnique({ where: { paymentId } });
  if (!payment) {
    return NextResponse.json({ error: "Unknown payment." }, { status: 404 });
  }

  const newStatus = status.toUpperCase() as
    | "WAITING"
    | "CONFIRMING"
    | "CONFIRMED"
    | "FINISHED"
    | "FAILED"
    | "EXPIRED";

  await prisma.payment.update({
    where: { paymentId },
    data: {
      status: newStatus,
      payCurrency: payload.pay_currency ?? payment.payCurrency,
    },
  });

  if (SUCCESS_STATUSES.includes(status) && payment.status !== "FINISHED" && payment.status !== "CONFIRMED") {
    // Extend from "now" or from the current premiumUntil, whichever is later —
    // so renewing early doesn't lose remaining time.
    const user = await prisma.user.findUnique({ where: { id: payment.userId } });
    const base = user?.premiumUntil && user.premiumUntil.getTime() > Date.now() ? user.premiumUntil : new Date();
    const newExpiry = new Date(base.getTime() + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: payment.userId },
      data: { premiumUntil: newExpiry },
    });
  }

  if (TERMINAL_FAIL_STATUSES.includes(status)) {
    // no-op beyond the status update above — Payment row stays as an audit trail
  }

  return NextResponse.json({ received: true });
}
