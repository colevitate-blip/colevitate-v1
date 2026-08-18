import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const pairingId = session.metadata?.pairingId;
    if (pairingId) {
      const supabase = createServiceRoleClient();

      // Idempotent: only the row still 'pending' for this exact session
      // transitions, so a duplicate webhook delivery is a no-op second
      // time through.
      const { data: purchase } = await supabase
        .from("pairing_purchases")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
        })
        .eq("stripe_checkout_session_id", session.id)
        .eq("status", "pending")
        .select("id")
        .maybeSingle();

      if (purchase) {
        await supabase.from("pairings").update({ unlocked_at: new Date().toISOString() }).eq("id", pairingId);
        await supabase
          .from("pairing_events")
          .insert({ pairing_id: pairingId, event_type: "report_unlocked", metadata: { stripe_checkout_session_id: session.id } });
      }
    }
  }

  return NextResponse.json({ received: true });
}
