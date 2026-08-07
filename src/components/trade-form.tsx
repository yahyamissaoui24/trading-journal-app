"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { StarRating, BTN_PRIMARY } from "@/components/ui-atoms";

const ASSET_CLASSES = [
  { value: "STOCKS", label: "Stocks", placeholder: "AAPL, TSLA" },
  { value: "INDICES", label: "Indices", placeholder: "SPX, NAS100" },
  { value: "FOREX", label: "Forex", placeholder: "EUR/USD, GBP/JPY" },
  { value: "CRYPTO", label: "Crypto", placeholder: "BTC/USDT" },
  { value: "COMMODITIES", label: "Commodities", placeholder: "XAU/USD, WTI" },
  { value: "FUTURES", label: "Futures", placeholder: "ES, NQ" },
];

// Session tags are optional on every trade — not just Forex/Indices — since some
// traders like to track time-of-day patterns across any market.

const FREE_SCREENSHOT_LIMIT = 2;

export type TradeFormValues = {
  id?: string;
  assetClass: string;
  symbol: string;
  direction: string;
  entryPrice: string;
  exitPrice: string;
  size: string;
  stopLoss: string;
  takeProfit: string;
  session: string;
  openedAt: string;
  rating: number;
  notes: string;
  tags: string;
  screenshots: string[];
};

function toDatetimeLocal(iso?: string | null) {
  if (!iso) return new Date().toISOString().slice(0, 16);
  return new Date(iso).toISOString().slice(0, 16);
}

export function TradeForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: Partial<TradeFormValues> & { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isPremium = session?.user?.plan === "PREMIUM";

  const [assetClass, setAssetClass] = useState(initial?.assetClass ?? "STOCKS");
  const [symbol, setSymbol] = useState(initial?.symbol ?? "");
  const [direction, setDirection] = useState(initial?.direction ?? "LONG");
  const [entryPrice, setEntryPrice] = useState(initial?.entryPrice ?? "");
  const [exitPrice, setExitPrice] = useState(initial?.exitPrice ?? "");
  const [size, setSize] = useState(initial?.size ?? "");
  const [stopLoss, setStopLoss] = useState(initial?.stopLoss ?? "");
  const [takeProfit, setTakeProfit] = useState(initial?.takeProfit ?? "");
  const [tradeSession, setTradeSession] = useState(initial?.session ?? "");
  const [openedAt, setOpenedAt] = useState(toDatetimeLocal(initial?.openedAt));
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [screenshots, setScreenshots] = useState<string[]>(initial?.screenshots ?? []);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeAsset = ASSET_CLASSES.find((a) => a.value === assetClass)!;
  const showSession = true;
  const screenshotLimitHit = !isPremium && screenshots.length >= FREE_SCREENSHOT_LIMIT;

  function readFiles(files: FileList | File[]) {
    const remaining = isPremium ? Infinity : FREE_SCREENSHOT_LIMIT - screenshots.length;
    const toRead = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);

    toRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setScreenshots((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (screenshotLimitHit) return;
    if (e.dataTransfer.files?.length) readFiles(e.dataTransfer.files);
  }

  function removeScreenshot(index: number) {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      assetClass,
      symbol,
      direction,
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : null,
      size: parseFloat(size),
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      session: showSession ? tradeSession || null : null,
      openedAt: new Date(openedAt).toISOString(),
      rating: rating || null,
      notes: notes || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      screenshots,
    };

    const res = await fetch(mode === "create" ? "/api/trades" : `/api/trades/${initial?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not save trade.");
      return;
    }

    router.push(mode === "create" ? "/trades" : `/trades/${initial?.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-headline-lg font-sans mb-stack-lg">
        {mode === "create" ? "New Trade" : "Edit Trade"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-stack-md">
        <div>
          <label className="text-body-sm text-on-surface-variant block mb-1">Asset class</label>
          <div className="flex flex-wrap gap-2">
            {ASSET_CLASSES.map((a) => (
              <button
                type="button"
                key={a.value}
                onClick={() => setAssetClass(a.value)}
                className={`px-3 py-1.5 rounded-sm text-body-sm border ${
                  assetClass === a.value
                    ? "border-primary text-primary bg-primary/10"
                    : "border-surface-container-high text-on-surface-variant"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-stack-md">
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Symbol / Pair</label>
            <input
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder={activeAsset.placeholder}
              className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
            />
          </div>
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Direction</label>
            <div className="flex gap-2">
              {["LONG", "SHORT"].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`flex-1 py-2 rounded text-body-sm border ${
                    direction === d
                      ? d === "LONG"
                        ? "border-primary text-primary bg-primary/10"
                        : "border-secondary text-secondary bg-secondary/10"
                      : "border-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-stack-md">
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Entry price</label>
            <input
              required
              type="number"
              step="any"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
            />
          </div>
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Exit price (optional)</label>
            <input
              type="number"
              step="any"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-stack-md">
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Size / lots</label>
            <input
              required
              type="number"
              step="any"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
            />
          </div>
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Stop loss</label>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
            />
          </div>
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Take profit</label>
            <input
              type="number"
              step="any"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
            />
          </div>
        </div>

        {showSession && (
          <div>
            <label className="text-body-sm text-on-surface-variant block mb-1">Session (optional)</label>
            <div className="flex gap-2">
              {["Asian", "London", "New York"].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setTradeSession((current) => (current === s ? "" : s))}
                  className={`px-3 py-1.5 rounded-sm text-body-sm border ${
                    tradeSession === s
                      ? "border-primary text-primary bg-primary/10"
                      : "border-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-body-sm text-on-surface-variant block mb-1">Date &amp; time</label>
          <input
            required
            type="datetime-local"
            value={openedAt}
            onChange={(e) => setOpenedAt(e.target.value)}
            className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 font-mono focus:outline-none focus:border-tertiary"
          />
        </div>

        <div>
          <label className="text-body-sm text-on-surface-variant block mb-1">
            Screenshots {!isPremium && `(${screenshots.length}/${FREE_SCREENSHOT_LIMIT} on Free plan)`}
          </label>

          {screenshots.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {screenshots.map((src, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-16 w-16 object-cover rounded border border-surface-container-high"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(i)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-secondary text-on-secondary text-data-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove screenshot"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {screenshotLimitHit ? (
            <div className="border border-tertiary/30 bg-tertiary/10 rounded p-stack-sm text-body-sm">
              You've hit the Free plan screenshot limit.{" "}
              <Link href="/pricing" className="text-tertiary hover:underline">
                Upgrade to Premium
              </Link>{" "}
              for unlimited screenshots.
            </div>
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-md py-stack-lg cursor-pointer transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-surface-container-high hover:border-outline"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant">
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-body-sm text-on-surface-variant">
                Drag &amp; drop chart screenshots, or click to browse
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && readFiles(e.target.files)}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <label className="text-body-sm text-on-surface-variant block mb-1">Execution rating</label>
          <StarRating value={rating} onChange={setRating} size={22} />
        </div>

        <div>
          <label className="text-body-sm text-on-surface-variant block mb-1">Tags (comma separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="breakout, FOMO, earnings play"
            className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 text-body-md focus:outline-none focus:border-tertiary"
          />
        </div>

        <div>
          <label className="text-body-sm text-on-surface-variant block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Setup reasoning, mistakes, emotions…"
            className="w-full bg-surface-container-low border border-surface-container-high rounded px-3 py-2 text-body-md focus:outline-none focus:border-tertiary"
          />
        </div>

        {error && <p className="text-body-sm text-secondary">{error}</p>}

        <div className="flex gap-stack-sm">
          <button type="submit" disabled={loading} className={`${BTN_PRIMARY} disabled:opacity-50`}>
            {loading ? "Saving…" : mode === "create" ? "Save trade" : "Save changes"}
          </button>
          <Link
            href={mode === "create" ? "/trades" : `/trades/${initial?.id}`}
            className="border border-surface-container-high rounded px-stack-lg py-2 text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
