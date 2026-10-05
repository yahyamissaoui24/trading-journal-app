import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FREE_SCREENSHOT_LIMIT = 2;

async function getOwnedTrade(id: string, userId: string) {
  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade || trade.userId !== userId) return null;
  return trade;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const trade = await getOwnedTrade(id, session.user.id);
  if (!trade) return NextResponse.json({ error: "Trade not found." }, { status: 404 });

  return NextResponse.json({ trade });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await getOwnedTrade(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Trade not found." }, { status: 404 });

  const body = await req.json();

  if (session.user.plan === "FREE" && Array.isArray(body.screenshots) && body.screenshots.length > FREE_SCREENSHOT_LIMIT) {
    return NextResponse.json(
      {
        error: `Free plan is limited to ${FREE_SCREENSHOT_LIMIT} screenshots per trade. Upgrade to Premium for unlimited screenshots.`,
        code: "PREMIUM_REQUIRED",
      },
      { status: 403 }
    );
  }

  const entryPrice = body.entryPrice ?? existing.entryPrice;
  const exitPrice = body.exitPrice ?? existing.exitPrice;
  const size = body.size ?? existing.size;
  const direction = body.direction ?? existing.direction;

  let pnl = existing.pnl;
  if (exitPrice != null) {
    const direction_mult = direction === "LONG" ? 1 : -1;
    pnl = (exitPrice - entryPrice) * size * direction_mult;
  }

  const trade = await prisma.trade.update({
    where: { id: id },
    data: {
      ...body,
      openedAt: body.openedAt ? new Date(body.openedAt) : undefined,
      closedAt: body.closedAt ? new Date(body.closedAt) : undefined,
      pnl,
    },
  });

  return NextResponse.json({ trade });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await getOwnedTrade(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Trade not found." }, { status: 404 });

  await prisma.trade.delete({ where: { id: id } });

  return NextResponse.json({ success: true });
}
