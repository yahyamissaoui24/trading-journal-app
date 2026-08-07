"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TradeForm, TradeFormValues } from "@/components/trade-form";

export default function EditTradePage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<(Partial<TradeFormValues> & { id: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/trades/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.trade) {
          setError("Trade not found.");
          return;
        }
        const t = d.trade;
        setInitial({
          id: t.id,
          assetClass: t.assetClass,
          symbol: t.symbol,
          direction: t.direction,
          entryPrice: String(t.entryPrice),
          exitPrice: t.exitPrice != null ? String(t.exitPrice) : "",
          size: String(t.size),
          stopLoss: t.stopLoss != null ? String(t.stopLoss) : "",
          takeProfit: t.takeProfit != null ? String(t.takeProfit) : "",
          session: t.session ?? "",
          openedAt: t.openedAt,
          rating: t.rating ?? 0,
          notes: t.notes ?? "",
          tags: (t.tags ?? []).join(", "),
          screenshots: t.screenshots ?? [],
        });
      });
  }, [id]);

  if (error) return <p className="text-body-md text-secondary">{error}</p>;
  if (!initial) return <p className="text-body-md text-on-surface-variant">Loading…</p>;

  return <TradeForm mode="edit" initial={initial} />;
}
