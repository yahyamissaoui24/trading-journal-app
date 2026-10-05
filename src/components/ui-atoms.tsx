// Shared button styles — outlined "pill" look (tinted background, soft border, colored text)
// used consistently for every primary action button and every Premium/upgrade button.
export const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-primary/12 border border-primary/25 px-stack-lg py-2.5 text-body-md font-medium text-primary hover:bg-primary/18 hover:border-primary/35 transition-colors duration-200 cursor-pointer";
export const BTN_PREMIUM =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-tertiary/10 border border-tertiary/25 px-stack-lg py-2.5 text-body-md font-medium text-tertiary hover:bg-tertiary/16 hover:border-tertiary/35 transition-colors duration-200 cursor-pointer";
export const BTN_GHOST =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-surface-container-high px-stack-lg py-2.5 text-body-md text-on-surface hover:bg-surface-container hover:border-outline-variant transition-colors duration-200 cursor-pointer";

export function StarRating({
  value,
  onChange,
  size = 16,
}: {
  value: number | null | undefined;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const rating = value ?? 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${n} star`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={n <= rating ? "#f59e0b" : "none"}
            stroke={n <= rating ? "#f59e0b" : "#1e2227"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const ASSET_LABELS: Record<string, string> = {
  STOCKS: "Stocks",
  INDICES: "Indices",
  FOREX: "Forex",
  CRYPTO: "Crypto",
  COMMODITIES: "Commodities",
  FUTURES: "Futures",
};

const ASSET_COLORS: Record<string, string> = {
  STOCKS: "text-asset-stocks bg-asset-stocks/15",
  INDICES: "text-asset-indices bg-asset-indices/15",
  FOREX: "text-asset-forex bg-asset-forex/15",
  CRYPTO: "text-asset-crypto bg-asset-crypto/15",
  COMMODITIES: "text-asset-commodities bg-asset-commodities/15",
  FUTURES: "text-asset-futures bg-asset-futures/15",
};

export function AssetBadge({ assetClass }: { assetClass: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-data-sm font-mono ${
        ASSET_COLORS[assetClass] ?? "text-on-surface-variant bg-surface-container-high"
      }`}
    >
      {ASSET_LABELS[assetClass] ?? assetClass}
    </span>
  );
}

export function PnlText({
  value,
  className = "",
  locked = false,
}: {
  value: number | null | undefined;
  className?: string;
  locked?: boolean;
}) {
  if (locked) {
    return (
      <span
        className={`font-mono text-data-md text-on-surface-variant inline-flex items-center gap-1 ${className}`}
        title="Upgrade to Premium to see your P&L"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="11" width="16" height="9" rx="1.5" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        ••••
      </span>
    );
  }

  if (value == null) {
    return <span className={`font-mono text-data-md text-on-surface-variant ${className}`}>—</span>;
  }
  const positive = value >= 0;
  return (
    <span
      className={`font-mono text-data-md ${positive ? "text-primary" : "text-secondary"} ${className}`}
    >
      {positive ? "+" : ""}
      {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-low border border-surface-container-high rounded-md ${className}`}>
      {children}
    </div>
  );
}
