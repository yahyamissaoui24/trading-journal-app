import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FREE_SCREENSHOT_LIMIT = 2;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const assetClass = searchParams.get("assetClass");
  const symbol = searchParams.get("symbol");

  const trades = await prisma.trade.findMany({
    where: {
      userId: session.user.id,
      ...(assetClass ? { assetClass: assetClass as any } : {}),
      ...(symbol ? { symbol: { contains: symbol, mode: "insensitive" } } : {}),
    },
    orderBy: { openedAt: "desc" },
  });

  return NextResponse.json({ trades });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const {
    assetClass,
    symbol,
    direction,
    entryPrice,
    exitPrice,
    size,
    stopLoss,
    takeProfit,
    session: tradeSession,
    openedAt,
    closedAt,
    rating,
    notes,
    tags,
    screenshots,
  } = body;

  if (!assetClass || !symbol || !direction || entryPrice == null || size == null || !openedAt) {
    return NextResponse.json(
      { error: "assetClass, symbol, direction, entryPrice, size, and openedAt are required." },
      { status: 400 }
    );
  }

  const screenshotList: string[] = Array.isArray(screenshots) ? screenshots : [];

  if (session.user.plan === "FREE" && screenshotList.length > FREE_SCREENSHOT_LIMIT) {
    return NextResponse.json(
      {
        error: `Free plan is limited to ${FREE_SCREENSHOT_LIMIT} screenshots per trade. Upgrade to Premium for unlimited screenshots.`,
        code: "PREMIUM_REQUIRED",
      },
      { status: 403 }
    );
  }

  let pnl: number | null = null;
  if (exitPrice != null) {
    const direction_mult = direction === "LONG" ? 1 : -1;
    pnl = (exitPrice - entryPrice) * size * direction_mult;
  }

  const trade = await prisma.trade.create({
    data: {
      userId: session.user.id,
      assetClass,
      symbol,
      direction,
      entryPrice,
      exitPrice: exitPrice ?? null,
      size,
      stopLoss: stopLoss ?? null,
      takeProfit: takeProfit ?? null,
      session: tradeSession ?? null,
      openedAt: new Date(openedAt),
      closedAt: closedAt ? new Date(closedAt) : null,
      pnl,
      rating: rating ?? null,
      notes: notes ?? null,
      tags: Array.isArray(tags) ? tags : [],
      screenshots: screenshotList,
    },
  });

  return NextResponse.json({ trade }, { status: 201 });
}
