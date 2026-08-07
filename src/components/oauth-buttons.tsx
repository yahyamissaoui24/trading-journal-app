"use client";

import { signIn } from "next-auth/react";

export function OAuthButtons() {
  return (
    <div className="space-y-2 mb-stack-md">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full flex items-center justify-center gap-2 border border-surface-container-high rounded py-2 text-body-md text-on-surface hover:bg-surface-container transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
          />
        </svg>
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
        className="w-full flex items-center justify-center gap-2 border border-surface-container-high rounded py-2 text-body-md text-on-surface hover:bg-surface-container transition-colors"
      >
        <svg width="16" height="18" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M13.15 9.55c-.02-2 1.63-2.96 1.7-3-.93-1.36-2.38-1.55-2.9-1.57-1.24-.13-2.42.73-3.05.73-.63 0-1.6-.71-2.63-.7-1.35.02-2.6.79-3.29 2-1.4 2.44-.36 6.05 1.01 8.03.67.97 1.46 2.06 2.5 2.02 1-.04 1.38-.65 2.6-.65 1.21 0 1.56.65 2.62.63 1.08-.02 1.77-1 2.43-1.97.77-1.13 1.08-2.22 1.1-2.28-.02-.01-2.1-.81-2.09-3.24ZM11.1 3.28c.55-.67.92-1.6.82-2.53-.79.03-1.75.53-2.32 1.19-.5.58-.95 1.54-.83 2.44.87.07 1.77-.44 2.33-1.1Z" />
        </svg>
        Continue with Apple
      </button>

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px bg-surface-container-high flex-1" />
        <span className="text-body-sm text-on-surface-variant">or</span>
        <div className="h-px bg-surface-container-high flex-1" />
      </div>
    </div>
  );
}
