"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoWithWordmark } from "@/components/logo";
import { BTN_PREMIUM } from "@/components/ui-atoms";

const FREE_FEATURES = [
  "Manual trade logging, all asset classes",
  "Up to 2 screenshots per trade",
  "Win rate & trade counts",
  "Basic trade log filtering",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "See your actual P&L and equity curve",
  "Unlimited screenshots per trade",
  "Advanced analytics: session breakdown, P&L by asset class",
  "Saved setup templates & advanced tag filtering",
];

const CRYPTO_OPTIONS = [
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "usdttrc20", label: "USDT (TRC20)" },
  { value: "usdc", label: "USDC" },
];

type PaymentInfo = {
  paymentId: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
};

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payCurrency, setPayCurrency] = useState("btc");
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("WAITING");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPremium = session?.user?.plan === "PREMIUM";

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleStartPayment() {
    setError(null);

    if (status !== "authenticated") {
      router.push("/login?next=/pricing");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payCurrency }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not start payment. Please try again.");
      return;
    }

    setPayment(data);
    setPaymentStatus("WAITING");

    pollRef.current = setInterval(async () => {
      const statusRes = await fetch(`/api/payments/status?paymentId=${data.paymentId}`);
      const statusData = await statusRes.json();
      if (statusData.status) setPaymentStatus(statusData.status);
      if (statusData.premium) {
        if (pollRef.current) clearInterval(pollRef.current);
        router.push("/settings?upgraded=true");
        router.refresh();
      }
    }, 5000);
  }

  function copyAddress() {
    if (!payment) return;
    navigator.clipboard.writeText(payment.payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-surface px-page-margin py-stack-lg">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-stack-lg">
          <LogoWithWordmark size={28} />
          {status === "authenticated" && (
            <Link href="/dashboard" className="ml-auto text-body-sm text-on-surface-variant hover:text-on-surface">
              ← Back to app
            </Link>
          )}
        </div>

        <h1 className="text-headline-lg font-sans mb-2">Trade with more discipline</h1>
        <p className="text-body-lg text-on-surface-variant mb-stack-lg">
          Start free. Upgrade when you're ready to see your real numbers and deeper analytics.
        </p>

        <div className="grid md:grid-cols-2 gap-stack-md">
          <div className="bg-surface-container-low border border-surface-container-high rounded-md p-stack-lg">
            <h2 className="text-headline-sm font-sans mb-1">Free</h2>
            <p className="font-mono text-data-lg mb-stack-md">
              $0<span className="text-body-sm text-on-surface-variant"> / month</span>
            </p>
            <ul className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2 text-body-md text-on-surface-variant">
                  <span className="text-on-surface-variant">·</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-low border border-tertiary/40 rounded-md p-stack-lg relative">
            <span className="absolute -top-3 left-stack-lg bg-tertiary text-on-tertiary text-data-sm font-mono px-2 py-0.5 rounded-sm">
              PREMIUM
            </span>
            <h2 className="text-headline-sm font-sans mb-1">Premium</h2>
            <p className="font-mono text-data-lg mb-stack-md">
              $20<span className="text-body-sm text-on-surface-variant"> / month</span>
            </p>
            <ul className="space-y-2 mb-stack-lg">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex gap-2 text-body-md">
                  <span className="text-primary">✓</span> {f}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full text-center rounded py-2 text-body-md bg-primary/10 text-primary border border-primary/30">
                You're on Premium
              </div>
            ) : payment ? (
              <div className="border border-surface-container-high rounded-md p-stack-md space-y-stack-sm">
                <p className="text-body-sm text-on-surface-variant">
                  Send exactly this amount to unlock Premium for 30 days:
                </p>
                <p className="font-mono text-data-lg text-tertiary">
                  {payment.payAmount} {payment.payCurrency.toUpperCase()}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-data-sm font-mono bg-surface px-2 py-1.5 rounded break-all">
                    {payment.payAddress}
                  </code>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="text-body-sm text-primary hover:underline shrink-0"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-body-sm text-on-surface-variant flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
                  Status: {paymentStatus.toLowerCase()} — this page updates automatically once payment is detected.
                </p>
              </div>
            ) : (
              <>
                <label className="text-body-sm text-on-surface-variant block mb-1">Pay with</label>
                <select
                  value={payCurrency}
                  onChange={(e) => setPayCurrency(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded px-3 py-2 text-body-md mb-stack-sm focus:outline-none focus:border-tertiary"
                >
                  {CRYPTO_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStartPayment}
                  disabled={loading}
                  className={`w-full ${BTN_PREMIUM} disabled:opacity-50 disabled:cursor-not-allowed gap-2`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                  {loading ? "Creating payment…" : "Upgrade to Premium"}
                </button>
              </>
            )}
            {error && <p className="text-body-sm text-secondary mt-2">{error}</p>}
          </div>
        </div>

        <p className="text-body-sm text-on-surface-variant mt-stack-lg">
          Paid in crypto via NOWPayments. Premium lasts 30 days from confirmation — renew anytime from Settings.
        </p>
      </div>
    </div>
  );
}
