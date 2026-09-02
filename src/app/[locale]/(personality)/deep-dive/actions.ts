"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe, DEEP_DIVE_REPORT_PRICE_CENTS, DEEP_DIVE_REPORT_CURRENCY } from "@/lib/stripe/server";
import { SITE_URL } from "@/lib/seo/siteConfig";

export async function createDeepDiveCheckoutSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("deep_dive_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .maybeSingle();
  if (existing) throw new Error("Your Deep Dive Report is already unlocked");

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: DEEP_DIVE_REPORT_CURRENCY,
          unit_amount: DEEP_DIVE_REPORT_PRICE_CENTS,
          product_data: { name: "Deep Dive Report" },
        },
      },
    ],
    success_url: `${SITE_URL}/deep-dive?checkout=success`,
    cancel_url: `${SITE_URL}/deep-dive?checkout=cancelled`,
    metadata: { type: "deep_dive", userId: user.id },
  });

  await supabase.from("deep_dive_purchases").insert({
    user_id: user.id,
    stripe_checkout_session_id: session.id,
    amount_cents: DEEP_DIVE_REPORT_PRICE_CENTS,
    currency: DEEP_DIVE_REPORT_CURRENCY,
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  return session.url;
}
