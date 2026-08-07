"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, AssetBadge, PnlText, StarRating } from "@/components/ui-atoms";

type Trade = {
  id: string;
  assetClass: string;
  symbol: string;
  direction: string;
  entryPrice: number;
  exitPrice: number | null;
  size: number;
  stopLoss: number | null;
  takeProfit: number | null;
  session: string | null;
  openedAt: string;
  closedAt: string | null;
  pnl: number | null;
  rating: number | null;
  notes: string | null;
  tags: string[];
  screenshots: string[];
};

export default function TradeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === "PREMIUM";
  const [trade, setTrade] = useState<Trade | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/trades/${id}`)
      .then((r) => r.json())
      .then((d) => setTrade(d.trade));
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this trade? This cannot be undone.")) return;
    await fetch(`/api/trades/${id}`, { method: "DELETE" });
    router.push("/trades");
    router.refresh();
  }

  if (!trade) return <p className="text-body-md text-on-surface-variant">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-stack-sm mb-stack-lg flex-wrap">
        <AssetBadge assetClass={trade.assetClass} />
        <h1 className="text-headline-lg font-sans font-mono">{trade.symbol}</h1>
        <span className="text-body-md text-on-surface-variant">{trade.direction}</span>
        <div className="ml-auto flex gap-stack-sm">
          <Link href={`/trades/${id}/edit`} className="text-body-sm text-primary hover:underline">
            Edit
          </Link>
          <button onClick={handleDelete} className="text-body-sm text-secondary hover:underline">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md mb-stack-lg">
        <Card className="p-stack-md">
          <p className="text-body-sm text-on-surface-variant mb-1">Entry</p>
          <p className="font-mono text-data-md">{trade.entryPrice}</p>
        </Card>
        <Card className="p-stack-md">
          <p className="text-body-sm text-on-surface-variant mb-1">Exit</p>
          <p className="font-mono text-data-md">{trade.exitPrice ?? "—"}</p>
        </Card>
        <Card className="p-stack-md">
          <p className="text-body-sm text-on-surface-variant mb-1">Size</p>
          <p className="font-mono text-data-md">{trade.size}</p>
        </Card>
        <Card className="p-stack-md">
          <p className="text-body-sm text-on-surface-variant mb-1">P&amp;L</p>
          <PnlText value={trade.pnl} className="text-data-md" locked={!isPremium} />
        </Card>
      </div>

      {!isPremium && (
        <div className="mb-stack-lg text-body-sm text-on-surface-variant bg-surface-container-low border border-surface-container-high rounded-md p-stack-sm">
          P&amp;L figures are hidden on the Free plan.{" "}
          <Link href="/pricing" className="text-tertiary hover:underline">
            Upgrade to Premium
          </Link>{" "}
          to see them.
        </div>
      )}

      {trade.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-stack-md">
          {trade.tags.map((t) => (
            <span key={t} className="text-data-sm font-mono px-2 py-0.5 rounded-sm bg-surface-container-high text-on-surface-variant">
              #{t}
            </span>
          ))}
        </div>
      )}

      {trade.screenshots.length > 0 && (
        <div className="mb-stack-lg">
          <p className="text-body-sm text-on-surface-variant mb-2">Screenshots</p>
          <div className="flex flex-wrap gap-2">
            {trade.screenshots.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                onClick={() => setLightbox(src)}
                className="h-24 w-24 object-cover rounded border border-surface-container-high cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}

      <Card className="p-stack-md mb-stack-md">
        <p className="text-body-sm text-on-surface-variant mb-2">Execution rating</p>
        <StarRating value={trade.rating} size={22} />
      </Card>

      {trade.notes && (
        <Card className="p-stack-md">
          <p className="text-body-sm text-on-surface-variant mb-2">Notes</p>
          <p className="text-body-md whitespace-pre-wrap">{trade.notes}</p>
        </Card>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out p-stack-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded shadow-modal" />
        </div>
      )}
    </div>
  );
}
