"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, AssetBadge, PnlText, StarRating, BTN_PRIMARY, BTN_PREMIUM } from "@/components/ui-atoms";

type Trade = {
  id: string;
  assetClass: string;
  symbol: string;
  direction: string;
  pnl: number | null;
  rating: number | null;
  openedAt: string;
};

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Card className="p-stack-md">
      <p className="text-body-sm text-on-surface-variant mb-1">{label}</p>
      <p className={`font-mono text-data-lg ${accent ?? ""}`}>{value}</p>
    </Card>
  );
}

function LockedStatCard({ label }: { label: string }) {
  return (
    <Card className="p-stack-md">
      <p className="text-body-sm text-on-surface-variant mb-1">{label}</p>
      <p className="font-mono text-data-lg text-on-surface-variant flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="11" width="16" height="9" rx="1.5" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        ••••
      </p>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === "PREMIUM";
  const [trades, setTrades] = useState<Trade[] | null>(null);

  useEffect(() => {
    fetch("/api/trades")
      .then((r) => r.json())
      .then((d) => setTrades(d.trades ?? []));
  }, []);

  if (!trades) {
    return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  }

  const closed = trades.filter((t) => t.pnl != null);
  const wins = closed.filter((t) => (t.pnl ?? 0) > 0).length;
  const winRate = closed.length ? ((wins / closed.length) * 100).toFixed(1) + "%" : "—";
  const totalPnl = closed.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

  let running = 0;
  const equityData = [...closed]
    .sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime())
    .map((t, i) => {
      running += t.pnl ?? 0;
      return { i: i + 1, equity: Math.round(running * 100) / 100 };
    });

  const recent = [...trades]
    .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-stack-lg">
        <h1 className="text-headline-lg font-sans">Dashboard</h1>
        <Link href="/trades/new" className={BTN_PRIMARY}>
          + New Trade
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md mb-stack-lg">
        <StatCard label="Win rate" value={winRate} />
        {isPremium ? (
          <StatCard
            label="Total P&L"
            value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}`}
            accent={totalPnl >= 0 ? "text-primary" : "text-secondary"}
          />
        ) : (
          <LockedStatCard label="Total P&L" />
        )}
        <StatCard label="Closed trades" value={String(closed.length)} />
        <StatCard label="Open trades" value={String(trades.length - closed.length)} />
      </div>

      <Card className="p-stack-md mb-stack-lg">
        <p className="text-body-sm text-on-surface-variant mb-stack-sm">Equity curve</p>
        {!isPremium ? (
          <div className="py-stack-lg text-center">
            <p className="text-body-md text-on-surface-variant mb-stack-sm">
              Your equity curve reveals account size, so it's part of Premium.
            </p>
            <Link href="/pricing" className={BTN_PREMIUM}>
              ★ Upgrade to Premium
            </Link>
          </div>
        ) : equityData.length > 1 ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData}>
                <CartesianGrid stroke="#242b31" strokeDasharray="3 3" />
                <XAxis dataKey="i" stroke="#bccbb9" fontSize={12} tickLine={false} />
                <YAxis stroke="#bccbb9" fontSize={12} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: "#1a2026", border: "1px solid #2f353c", borderRadius: 8 }}
                  labelStyle={{ color: "#dde3eb" }}
                />
                <Line type="monotone" dataKey="equity" stroke="#4be277" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-body-md text-on-surface-variant py-stack-lg text-center">
            Log a few closed trades to see your equity curve.
          </p>
        )}
      </Card>

      <Card className="p-stack-md">
        <div className="flex items-center justify-between mb-stack-sm">
          <p className="text-body-sm text-on-surface-variant">Recent trades</p>
          <Link href="/trades" className="text-body-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-body-md text-on-surface-variant py-stack-lg text-center">
            No trades yet. Log your first trade to get started.
          </p>
        ) : (
          <div className="divide-y divide-surface-container-high">
            {recent.map((t) => (
              <Link
                key={t.id}
                href={`/trades/${t.id}`}
                className="flex items-center justify-between py-stack-sm hover:bg-surface-container transition-colors -mx-stack-sm px-stack-sm rounded"
              >
                <div className="flex items-center gap-stack-sm">
                  <AssetBadge assetClass={t.assetClass} />
                  <span className="font-mono text-body-md">{t.symbol}</span>
                  <span className="text-body-sm text-on-surface-variant">{t.direction}</span>
                </div>
                <div className="flex items-center gap-stack-md">
                  <StarRating value={t.rating} size={12} />
                  <PnlText value={t.pnl} locked={!isPremium} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
