import Link from "next/link";
import { LogoWithWordmark, Logo } from "@/components/logo";
import { TickerTape } from "@/components/landing/ticker-tape";
import { HeroMockPanel } from "@/components/landing/hero-mock-panel";
import { IconLayers, IconImage, IconStar, IconChart, IconPencil, IconCoin } from "@/components/landing/icons";
import { BTN_PRIMARY, BTN_PREMIUM } from "@/components/ui-atoms";

const FEATURES = [
  {
    icon: <IconLayers />,
    title: "Every market, one log",
    body: "Stocks, indices, Forex, crypto, commodities, and futures — tracked side by side instead of scattered across broker tabs and spreadsheets.",
  },
  {
    icon: <IconImage />,
    title: "The chart, not just the number",
    body: "Drop in your entry screenshot right where you logged the trade. Six months later, you'll remember why you clicked buy — not just that you did.",
  },
  {
    icon: <IconStar />,
    title: "Rate the execution, not the outcome",
    body: "A trade can win on a bad process or lose on a good one. A 1–5 execution rating keeps you honest about which happened.",
  },
  {
    icon: <IconPencil />,
    title: "Fix a log entry after the fact",
    body: "Missed the exit price, forgot a tag — edit any trade later without deleting and starting over.",
  },
  {
    icon: <IconChart />,
    title: "Analytics that find the pattern",
    body: "P&L by asset class, by session, by setup tag. The habit costing you money is usually invisible until it's graphed.",
  },
  {
    icon: <IconCoin />,
    title: "Pay in crypto, no card needed",
    body: "Premium unlocks for $20/month, settled in BTC, ETH, USDT, or USDC — no subscription lock-in, renew only when you want to.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-surface-container-high">
        <div className="max-w-page mx-auto px-page-margin py-stack-sm flex items-center justify-between">
          <LogoWithWordmark size={26} />
          <nav className="flex items-center gap-stack-md">
            <Link href="/pricing" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block">
              Pricing
            </Link>
            <Link href="/login" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`${BTN_PRIMARY} !px-stack-md !py-1.5 !text-body-sm`}
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-page mx-auto px-page-margin pt-stack-lg pb-stack-lg md:pt-16 md:pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <p className="text-body-sm font-mono text-tertiary mb-stack-sm">/ apex journal</p>
            <h1 className="text-[2.5rem] leading-[1.1] md:text-[3.25rem] md:leading-[1.08] font-sans font-semibold tracking-tight mb-stack-md">
              Know exactly why
              <br />
              you win. <span className="text-primary">And why you lose.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-stack-lg max-w-md">
              Log every trade — stocks, Forex, crypto, indices, commodities, futures — with the chart, the
              reasoning, and an honest rating of your own execution. The patterns show up before they cost
              you again.
            </p>
            <div className="flex flex-wrap items-center gap-stack-sm">
              <Link
                href="/signup"
                className={`${BTN_PRIMARY} !py-2.5`}
              >
                Start journaling free
              </Link>
              <Link
                href="/login"
                className="border border-surface-container-high rounded px-stack-lg py-2.5 text-body-md text-on-surface hover:bg-surface-container transition-colors"
              >
                Sign in
              </Link>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-stack-md">
              Free forever for manual logging. No card required.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <HeroMockPanel />
          </div>
        </div>
      </section>

      <TickerTape />

      {/* Features */}
      <section className="max-w-page mx-auto px-page-margin py-16 md:py-24">
        <div className="max-w-xl mb-stack-lg">
          <h2 className="text-headline-lg font-sans font-semibold mb-stack-sm">
            Built for traders who outgrew spreadsheets
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            A journal only works if you actually keep it. This one is fast enough that you will.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-surface-container-low border border-surface-container-high rounded-md p-stack-lg hover:border-outline-variant transition-colors"
            >
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-stack-sm">
                {f.icon}
              </div>
              <h3 className="text-headline-sm font-sans mb-1.5">{f.title}</h3>
              <p className="text-body-md text-on-surface-variant">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Free vs Premium visual */}
      <section className="max-w-page mx-auto px-page-margin py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-stack-lg items-center">
          <div>
            <p className="text-body-sm font-mono text-tertiary mb-stack-sm">/ what premium unlocks</p>
            <h2 className="text-headline-lg font-sans font-semibold mb-stack-sm">
              See the number, not just the streak
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-stack-md max-w-md">
              The Free plan tracks every trade but keeps dollar P&amp;L out of view — Premium unlocks your
              real numbers: total P&amp;L, equity curve, and P&amp;L broken down by asset class and session.
            </p>
            <Link href="/pricing" className={BTN_PREMIUM}>
              ★ See Premium — $20/mo in crypto
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-stack-sm">
            <div className="bg-surface-container-low border border-surface-container-high rounded-md p-stack-md">
              <p className="text-body-sm text-on-surface-variant mb-stack-sm">Free</p>
              <p className="font-mono text-data-lg text-on-surface-variant flex items-center gap-1 mb-stack-md">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="11" width="16" height="9" rx="1.5" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                ••••
              </p>
              <div className="space-y-1.5">
                {[40, 65, 30, 80].map((h, i) => (
                  <div key={i} className="h-2 rounded-full bg-surface-container-high" style={{ width: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low border border-tertiary/40 rounded-md p-stack-md">
              <p className="text-body-sm text-tertiary mb-stack-sm">Premium</p>
              <p className="font-mono text-data-lg text-primary mb-stack-md">+2,104.80</p>
              <div className="space-y-1.5">
                {[40, 65, 30, 80].map((h, i) => (
                  <div key={i} className="h-2 rounded-full bg-primary/50" style={{ width: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-page mx-auto px-page-margin py-16 md:py-20">
        <div className="bg-surface-container-low border border-surface-container-high rounded-lg p-stack-lg md:p-12 text-center">
          <h2 className="text-headline-lg font-sans font-semibold mb-stack-sm">
            Your next trade deserves a record.
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-stack-lg max-w-md mx-auto">
            Start logging in the next two minutes — no card, no commitment.
          </p>
          <Link
            href="/signup"
            className={`${BTN_PRIMARY} !py-2.5`}
          >
            Start journaling free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-container-high">
        <div className="max-w-page mx-auto px-page-margin py-stack-lg flex flex-col sm:flex-row items-center justify-between gap-stack-sm">
          <Logo size={22} />
          <div className="flex items-center gap-stack-md text-body-sm text-on-surface-variant">
            <Link href="/pricing" className="hover:text-on-surface transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-on-surface transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-on-surface transition-colors">
              Sign up
            </Link>
          </div>
          <p className="text-body-sm text-on-surface-variant">© {new Date().getFullYear()} Apex Journal</p>
        </div>
      </footer>
    </div>
  );
}
