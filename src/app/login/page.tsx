"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoWithWordmark } from "@/components/logo";
import { OAuthButtons } from "@/components/oauth-buttons";
import { BTN_PRIMARY } from "@/components/ui-atoms";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-page-margin">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-stack-lg">
          <LogoWithWordmark size={32} href="/" />
        </div>

        <div className="bg-surface-container-low border border-surface-container-high rounded-md p-stack-lg">
          <h1 className="text-headline-md font-sans mb-stack-md">Sign in</h1>

          <OAuthButtons />

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label className="text-body-sm text-on-surface-variant block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-surface-container-high rounded px-3 py-2 text-body-md focus:outline-none focus:border-tertiary transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-body-sm text-on-surface-variant block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-surface-container-high rounded px-3 py-2 text-body-md focus:outline-none focus:border-tertiary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-body-sm text-secondary">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${BTN_PRIMARY} disabled:opacity-50`}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-body-sm text-on-surface-variant mt-stack-md">
          No account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
