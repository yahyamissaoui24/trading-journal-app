import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/plan";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");
  if (!paymentId) return NextResponse.json({ error: "paymentId is required." }, { status: 400 });

  const payment = await prisma.payment.findUnique({ where: { paymentId } });
  if (!payment || payment.userId !== session.user.id) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return NextResponse.json({
    status: payment.status,
    premium: isPremium(user?.premiumUntil),
    premiumUntil: user?.premiumUntil,
  });
}
