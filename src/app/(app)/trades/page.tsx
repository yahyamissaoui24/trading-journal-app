"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, AssetBadge, PnlText, StarRating, BTN_PRIMARY } from "@/components/ui-atoms";

type Trade = {
  id: string;
  assetClass: string;
  symbol: string;
  direction: string;
  entryPrice: number;
  exitPrice: number | null;
  pnl: number | null;
  rating: number | null;
  openedAt: string;
};

const ASSET_CLASSES = ["STOCKS", "INDICES", "FOREX", "CRYPTO", "COMMODITIES", "FUTURES"];

export default function TradeLogPage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === "PREMIUM";
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [assetClass, setAssetClass] = useState<string>("");
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (assetClass) params.set("assetClass", assetClass);
    if (symbol) params.set("symbol", symbol);
    fetch(`/api/trades?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setTrades(d.trades ?? []));
  }, [assetClass, symbol]);

  return (
    <div>
      <div className="flex items-center justify-between mb-stack-lg">
        <h1 className="text-headline-lg font-sans">Trade Log</h1>
        <Link href="/trades/new" className={BTN_PRIMARY}>
          + New Trade
        </Link>
      </div>

      <div className="flex flex-wrap gap-stack-sm mb-stack-md">
        <button
          onClick={() => setAssetClass("")}
          className={`px-3 py-1 rounded-sm text-body-sm border ${
            assetClass === ""
              ? "border-primary text-primary bg-primary/10"
              : "border-surface-container-high text-on-surface-variant"
          }`}
        >
          All
        </button>
        {ASSET_CLASSES.map((ac) => (
          <button
            key={ac}
            onClick={() => setAssetClass(ac)}
            className={`px-3 py-1 rounded-sm text-body-sm border ${
              assetClass === ac
                ? "border-primary text-primary bg-primary/10"
                : "border-surface-container-high text-on-surface-variant"
            }`}
          >
            {ac.charAt(0) + ac.slice(1).toLowerCase()}
          </button>
        ))}
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Search symbol…"
          className="ml-auto bg-surface-container-low border border-surface-container-high rounded-sm px-3 py-1 text-body-sm focus:outline-none focus:border-tertiary"
        />
      </div>

      <Card className="overflow-hidden">
        {!trades ? (
          <p className="text-body-md text-on-surface-variant p-stack-lg text-center">Loading…</p>
        ) : trades.length === 0 ? (
          <p className="text-body-md text-on-surface-variant p-stack-lg text-center">
            No trades match these filters.
          </p>
        ) : (
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-surface-container-high text-on-surface-variant text-left">
                <th className="p-stack-sm font-normal">Date</th>
                <th className="p-stack-sm font-normal">Asset</th>
                <th className="p-stack-sm font-normal">Symbol</th>
                <th className="p-stack-sm font-normal">Dir</th>
                <th className="p-stack-sm font-normal text-right">Entry</th>
                <th className="p-stack-sm font-normal text-right">Exit</th>
                <th className="p-stack-sm font-normal text-right">P&L</th>
                <th className="p-stack-sm font-normal">Rating</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-surface-container-high last:border-0 hover:bg-surface-container cursor-pointer"
                  onClick={() => (window.location.href = `/trades/${t.id}`)}
                >
                  <td className="p-stack-sm font-mono text-data-sm text-on-surface-variant">
                    {new Date(t.openedAt).toLocaleDateString()}
                  </td>
                  <td className="p-stack-sm">
                    <AssetBadge assetClass={t.assetClass} />
                  </td>
                  <td className="p-stack-sm font-mono">{t.symbol}</td>
                  <td className="p-stack-sm text-on-surface-variant">{t.direction}</td>
                  <td className="p-stack-sm text-right font-mono">{t.entryPrice}</td>
                  <td className="p-stack-sm text-right font-mono">{t.exitPrice ?? "—"}</td>
                  <td className="p-stack-sm text-right">
                    <PnlText value={t.pnl} locked={!isPremium} />
                  </td>
                  <td className="p-stack-sm">
                    <StarRating value={t.rating} size={12} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
