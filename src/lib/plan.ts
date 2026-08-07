export function isPremium(premiumUntil: Date | string | null | undefined): boolean {
  if (!premiumUntil) return false;
  return new Date(premiumUntil).getTime() > Date.now();
}

export const PREMIUM_MONTHLY_PRICE_USD = 20;
export const PREMIUM_DURATION_DAYS = 30;
