const TICKER_ITEMS = [
  { symbol: "AAPL", asset: "Stocks", change: "+1.24%", up: true },
  { symbol: "EUR/USD", asset: "Forex", change: "-0.18%", up: false },
  { symbol: "BTC/USDT", asset: "Crypto", change: "+3.62%", up: true },
  { symbol: "XAU/USD", asset: "Commodities", change: "+0.41%", up: true },
  { symbol: "NAS100", asset: "Indices", change: "-0.55%", up: false },
  { symbol: "ES", asset: "Futures", change: "+0.87%", up: true },
  { symbol: "GBP/JPY", asset: "Forex", change: "-0.29%", up: false },
  { symbol: "TSLA", asset: "Stocks", change: "+2.11%", up: true },
  { symbol: "ETH/USDT", asset: "Crypto", change: "+1.95%", up: true },
  { symbol: "WTI", asset: "Commodities", change: "-1.03%", up: false },
];

function TickerItem({ symbol, asset, change, up }: (typeof TICKER_ITEMS)[number]) {
  return (
    <div className="flex items-center gap-2.5 px-stack-lg shrink-0">
      <span className="font-mono text-data-md text-on-surface">{symbol}</span>
      <span className="text-body-sm text-on-surface-variant">{asset}</span>
      <span className={`font-mono text-data-sm ${up ? "text-primary" : "text-secondary"}`}>
        {up ? "▲" : "▼"} {change}
      </span>
    </div>
  );
}

export function TickerTape() {
  // Duplicate the list once so the CSS animation (translateX -50%) loops seamlessly.
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="border-y border-surface-container-high bg-surface-container-lowest overflow-hidden py-stack-sm">
      <div className="flex ticker-track w-max">
        {items.map((item, i) => (
          <TickerItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
