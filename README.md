# Apex Journal

A multi-asset trading journal (Stocks, Indices, Forex, Crypto, Commodities, Futures) with email/password +
Google/Apple auth, and a $20/month Premium tier paid in crypto via NOWPayments. Built with Next.js 14
(App Router), Prisma + PostgreSQL, NextAuth, and Tailwind — styled from the DESIGN.md token file.

## 1. Prerequisites

- Node.js 18+
- A PostgreSQL database — this project is set up for **Supabase**, using two connection strings:
  - `DATABASE_URL` = the **Transaction pooler** connection (port `6543`, `?pgbouncer=true`)
  - `DIRECT_URL` = the **Session pooler** connection (port `5432`, same pooler host) — used for migrations
  - Note: Supabase's "Direct connection" (`db.xxxx.supabase.co`) is IPv6-only on the free tier and will
    fail from most home networks — use the Session pooler instead, not the Direct connection, for `DIRECT_URL`.
- A [NOWPayments](https://nowpayments.io) account (for crypto payments)
- (Optional) A Google Cloud project and/or Apple Developer account, if you want those sign-in options

## 2. Local setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `DATABASE_URL` / `DIRECT_URL` — your Supabase connection strings (see above)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` for local dev
- `NOWPAYMENTS_API_KEY` / `NOWPAYMENTS_IPN_SECRET` — see step 3
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — see step 4 (optional)
- `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` — see step 5 (optional)

Then:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 3. NOWPayments setup (required for Premium)

1. Sign up at [nowpayments.io](https://nowpayments.io) and complete their verification
2. In your dashboard → **Store Settings**, generate an **API key** → `NOWPAYMENTS_API_KEY`
3. In the same settings, find/generate your **IPN Secret Key** → `NOWPAYMENTS_IPN_SECRET`
   (this is what lets `/api/payments/webhook` verify that a callback really came from NOWPayments)
4. NOWPayments needs to reach your webhook URL to confirm payments, so this **will not work on
   `localhost`** — you'll need to test this against your deployed Vercel URL, or tunnel localhost with
   something like `ngrok` and set that as your IPN callback URL for testing.
5. Enable whichever coins you want to accept in your NOWPayments dashboard (BTC, ETH, USDT-TRC20, USDC are
   pre-wired into the pricing page's dropdown — add more in `src/app/pricing/page.tsx`'s `CRYPTO_OPTIONS`
   if you want others).

**How it works:** when a user clicks Upgrade, the app creates a NOWPayments invoice and shows them a
deposit address + exact amount. Once they send the crypto, NOWPayments detects it on-chain and calls your
`/api/payments/webhook`, which extends their `premiumUntil` by 30 days. There's no auto-renewal — crypto
payments aren't recurring by nature — so users renew manually from Settings before they expire.

## 4. Google Sign-In setup (optional)

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (type: Web application)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (and your production URL's
   equivalent once deployed)
4. Copy the Client ID and Client Secret into `.env`

If you leave these blank, the "Continue with Google" button will just fail — remove it from
`src/components/oauth-buttons.tsx` if you don't plan to set this up.

## 5. Apple Sign-In setup (optional, more involved)

Apple requires a paid Apple Developer account and its "client secret" is actually a JWT you generate
yourself (signed with a private key), not a plain string — and it expires every 6 months max, so you'll
need to regenerate it periodically. Broad steps:
1. Create an App ID and a Services ID in your Apple Developer account, with "Sign in with Apple" enabled
2. Generate a private key for Sign in with Apple, download the `.p8` file
3. Use a script (several exist on npm, e.g. `next-auth`'s docs link one) to generate a signed JWT from that
   key — that JWT is your `APPLE_CLIENT_SECRET`; your Services ID is `APPLE_CLIENT_ID`
4. Add the redirect URI `https://your-domain.com/api/auth/callback/apple` in your Services ID config
   (Apple does not allow `localhost` redirect URIs, so this one genuinely can't be tested locally)

Given the setup cost, many people ship with Google + email/password first and add Apple later. If you skip
it, remove the Apple button from `src/components/oauth-buttons.tsx`.

## 6. Deploying to Vercel

1. Push to GitHub, import into Vercel
2. Set the Vercel **Build Command** to:
   ```
   prisma generate && prisma migrate deploy && next build
   ```
3. Add all env vars from `.env` with production values (production `NEXTAUTH_URL`/`NEXT_PUBLIC_APP_URL`
   set to your real domain, NOWPayments IPN callback pointed at that domain, OAuth redirect URIs updated)
4. Deploy

## 7. Known limitations / what to upgrade before real users

- **Screenshots are stored as base64 strings directly in Postgres.** Fine for testing, but will bloat your
  database fast — swap for [Vercel Blob](https://vercel.com/storage/blob) or S3 before real usage.
- **No password reset flow** for email/password accounts yet.
- **No rate limiting** on `/api/register` or payment creation — worth adding before public launch.
- **Premium doesn't auto-renew.** This is inherent to one-off crypto payments, not a bug — users see their
  expiry date in Settings and renew manually.
- **NOWPayments webhook requires a public URL** — see the ngrok note in step 3 if testing locally.

## Project structure

```
src/
  app/
    (app)/              — authenticated shell (resizable sidebar + mobile nav)
      dashboard/         — stats (P&L/equity curve locked for Free), recent trades
      trades/            — log (list), new (form), [id] (view), [id]/edit (edit form)
      analytics/         — asset-class P&L + session breakdown, both Premium-gated
      settings/          — account, plan status + expiry, renew link
    api/
      auth/[...nextauth] — NextAuth handler (Credentials + Google + Apple)
      register/          — signup endpoint
      trades/            — CRUD, free-tier screenshot gating
      payments/          — NOWPayments create / webhook / status
    login/, signup/, pricing/  — public pages
  components/
    trade-form.tsx        — shared form used by both New Trade and Edit Trade
    app-sidebar.tsx        — resizable sidebar (drag right edge, persisted in localStorage)
    oauth-buttons.tsx       — Google/Apple sign-in buttons
    logo.tsx                — SVG logo + wordmark
    ui-atoms.tsx             — star rating, asset badge, locked/unlocked P&L text, card
  lib/
    prisma.ts, auth.ts, plan.ts, nowpayments.ts
prisma/schema.prisma      — User, Payment, Trade models
```
