import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripe;
}

// No solo Combined Profile price exists yet to discount against, so this
// is a flat standalone unlock — see the "pair bundle pricing" follow-up
// noted in the Compatibility / Sharing Feature plan.
export const COMPATIBILITY_REPORT_PRICE_CENTS = 999;
export const COMPATIBILITY_REPORT_CURRENCY = "usd";
