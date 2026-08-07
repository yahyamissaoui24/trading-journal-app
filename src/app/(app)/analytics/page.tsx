"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { Card, BTN_PREMIUM } from "@/components/ui-atoms";

type Trade = {
  assetClass: string;
  symbol: string;
  pnl: number | null;
  session: string | null;
};

const ASSET_COLORS: Record<string, string> = {
  STOCKS: "#94a3b8",
  INDICES: "#818cf8",
  FOREX: "#60a5fa",
  CRYPTO: "#c084fc",
  COMMODITIES: "#f59e0b",
  FUTURES: "#2dd4bf",
};

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === "PREMIUM";
  const [trades, setTrades] = useState<Trade[] | null>(null);

  useEffect(() => {
    fetch("/api/trades")
      .then((r) => r.json())
      .then((d) => setTrades(d.trades ?? []));
  }, []);

  const byAssetClass = useMemo(() => {
    if (!trades) return [];
    const map: Record<string, number> = {};
    trades.forEach((t) => {
      if (t.pnl == null) return;
      map[t.assetClass] = (map[t.assetClass] ?? 0) + t.pnl;
    });
    return Object.entries(map).map(([assetClass, pnl]) => ({
      assetClass,
      pnl: Math.round(pnl * 100) / 100,
    }));
  }, [trades]);

  const bySession = useMemo(() => {
    if (!trades) return [];
    const map: Record<string, number> = {};
    trades.forEach((t) => {
      if (t.pnl == null || !t.session) return;
      map[t.session] = (map[t.session] ?? 0) + t.pnl;
    });
    return Object.entries(map).map(([session, pnl]) => ({ session, pnl: Math.round(pnl * 100) / 100 }));
  }, [trades]);

  if (!trades) return <p className="text-body-md text-on-surface-variant">Loading…</p>;

  return (
    <div>
      <h1 className="text-headline-lg font-sans mb-stack-lg">Analytics</h1>

      <Card className="p-stack-md mb-stack-lg">
        <p className="text-body-sm text-on-surface-variant mb-stack-sm">P&amp;L by asset class</p>
        {!isPremium ? (
          <div className="py-stack-lg text-center">
            <p className="text-body-md text-on-surface-variant mb-stack-sm">
              This chart reveals dollar P&amp;L, so it's part of Premium.
            </p>
            <Link href="/pricing" className={BTN_PREMIUM}>
              ★ Upgrade to Premium
            </Link>
          </div>
        ) : byAssetClass.length === 0 ? (
          <p className="text-body-md text-on-surface-variant py-stack-lg text-center">
            Close a few trades to see this breakdown.
          </p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byAssetClass}>
                <CartesianGrid stroke="#242b31" strokeDasharray="3 3" />
                <XAxis dataKey="assetClass" stroke="#bccbb9" fontSize={12} tickLine={false} />
                <YAxis stroke="#bccbb9" fontSize={12} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: "#1a2026", border: "1px solid #2f353c", borderRadius: 8 }}
                  labelStyle={{ color: "#dde3eb" }}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {byAssetClass.map((d, i) => (
                    <Cell key={i} fill={ASSET_COLORS[d.assetClass] ?? "#4be277"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="p-stack-md relative overflow-hidden">
        <p className="text-body-sm text-on-surface-variant mb-stack-sm">
          Session performance <span className="text-tertiary">· Premium</span>
        </p>

        {!isPremium ? (
          <div className="py-stack-lg text-center">
            <p className="text-body-md text-on-surface-variant mb-stack-sm">
              Session breakdown, drawdown, and expectancy metrics are part of Premium.
            </p>
            <Link href="/pricing" className={BTN_PREMIUM}>
              ★ Upgrade to Premium
            </Link>
          </div>
        ) : bySession.length === 0 ? (
          <p className="text-body-md text-on-surface-variant py-stack-lg text-center">
            Log a few trades with a session tag to see this breakdown.
          </p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySession}>
                <CartesianGrid stroke="#242b31" strokeDasharray="3 3" />
                <XAxis dataKey="session" stroke="#bccbb9" fontSize={12} tickLine={false} />
                <YAxis stroke="#bccbb9" fontSize={12} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: "#1a2026", border: "1px solid #2f353c", borderRadius: 8 }}
                  labelStyle={{ color: "#dde3eb" }}
                />
                <Bar dataKey="pnl" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
