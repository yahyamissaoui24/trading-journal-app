const MOCK_TRADES = [
  { symbol: "EUR/USD", asset: "Forex", dir: "LONG", pnl: "+142.30", up: true, stars: 4 },
  { symbol: "BTC/USDT", asset: "Crypto", dir: "LONG", pnl: "+890.12", up: true, stars: 5 },
  { symbol: "NAS100", asset: "Indices", dir: "SHORT", pnl: "-64.50", up: false, stars: 2 },
  { symbol: "XAU/USD", asset: "Commodities", dir: "LONG", pnl: "+58.90", up: true, stars: 3 },
];

const ASSET_COLORS: Record<string, string> = {
  Forex: "text-asset-forex bg-asset-forex/15",
  Crypto: "text-asset-crypto bg-asset-crypto/15",
  Indices: "text-asset-indices bg-asset-indices/15",
  Commodities: "text-asset-commodities bg-asset-commodities/15",
};

function MiniStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="9" height="9" viewBox="0 0 24 24" fill={n <= count ? "#f59e0b" : "none"} stroke={n <= count ? "#f59e0b" : "#333a40"} strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function HeroMockPanel() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative bg-surface-container-low border border-surface-container-high rounded-lg shadow-modal overflow-hidden">
        <div className="flex items-center gap-1.5 px-stack-md py-2.5 border-b border-surface-container-high">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-tertiary/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
          <span className="ml-3 text-data-sm font-mono text-on-surface-variant">apexjournal.app/dashboard</span>
        </div>

        <div className="p-stack-lg">
          <div className="grid grid-cols-3 gap-stack-sm mb-stack-md">
            <div className="bg-surface-container rounded-md p-stack-sm">
              <p className="text-body-sm text-on-surface-variant mb-0.5">Win rate</p>
              <p className="font-mono text-data-lg text-on-surface">68.4%</p>
            </div>
            <div className="bg-surface-container rounded-md p-stack-sm">
              <p className="text-body-sm text-on-surface-variant mb-0.5">Total P&amp;L</p>
              <p className="font-mono text-data-lg text-primary">+2,104.80</p>
            </div>
            <div className="bg-surface-container rounded-md p-stack-sm">
              <p className="text-body-sm text-on-surface-variant mb-0.5">Trades</p>
              <p className="font-mono text-data-lg text-on-surface">47</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {MOCK_TRADES.map((t) => (
              <div
                key={t.symbol}
                className="flex items-center justify-between bg-surface-container/60 rounded px-stack-sm py-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-data-sm font-mono px-1.5 py-0.5 rounded-sm ${ASSET_COLORS[t.asset]}`}>
                    {t.asset}
                  </span>
                  <span className="font-mono text-body-sm text-on-surface">{t.symbol}</span>
                  <span className="text-data-sm text-on-surface-variant">{t.dir}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MiniStars count={t.stars} />
                  <span className={`font-mono text-data-sm ${t.up ? "text-primary" : "text-secondary"}`}>
                    {t.pnl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
