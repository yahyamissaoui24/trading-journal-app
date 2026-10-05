"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, BTN_PREMIUM } from "@/components/ui-atoms";

function SettingsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const justUpgraded = searchParams.get("upgraded") === "true";

  const isPremium = session?.user?.plan === "PREMIUM";
  const premiumUntil = session?.user?.premiumUntil ? new Date(session.user.premiumUntil) : null;

  return (
    <div className="max-w-xl">
      <h1 className="text-headline-lg font-sans mb-stack-lg">Settings</h1>

      {justUpgraded && (
        <div className="mb-stack-md bg-primary/10 border border-primary/30 rounded-md p-stack-md text-body-md text-primary">
          Welcome to Premium — your P&L, equity curve, and advanced analytics are now unlocked.
        </div>
      )}

      <Card className="p-stack-lg mb-stack-md">
        <p className="text-body-sm text-on-surface-variant mb-1">Account</p>
        <p className="text-body-md">{session?.user?.email}</p>
      </Card>

      <Card className="p-stack-lg">
        <div className="flex items-center justify-between mb-stack-sm">
          <p className="text-body-sm text-on-surface-variant">Plan</p>
          <span
            className={`text-data-sm font-mono px-2 py-0.5 rounded-sm ${
              isPremium ? "bg-primary/15 text-primary" : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {isPremium ? "PREMIUM" : "FREE"}
          </span>
        </div>

        {isPremium && premiumUntil && (
          <p className="text-body-sm text-on-surface-variant mb-stack-sm">
            Active until {premiumUntil.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}

        <Link href="/pricing" className={BTN_PREMIUM}>
          ★ {isPremium ? "Renew / extend Premium" : "Upgrade to Premium"}
        </Link>

        {isPremium && (
          <p className="text-body-sm text-on-surface-variant mt-stack-sm">
            Premium doesn't auto-renew (crypto payments aren't recurring) — renew before your expiry date to
            keep uninterrupted access.
          </p>
        )}
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
