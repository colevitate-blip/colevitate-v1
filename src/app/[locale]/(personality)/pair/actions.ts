"use server";

import { createClient } from "@/lib/supabase/server";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix, type AxisScore } from "@/components/personality/combined/scoringMatrix";
import { generateInviteCode } from "@/lib/inviteCode";
import { getStripe, COMPATIBILITY_REPORT_PRICE_CENTS, COMPATIBILITY_REPORT_CURRENCY } from "@/lib/stripe/server";
import { SITE_URL } from "@/lib/seo/siteConfig";
import type { PersonalityResults } from "@/lib/personality/types";
import type { RelationshipType } from "@/components/personality/compatibility/relationshipFraming";

export type ShareLevel = "summary_only" | "axes";

export type PairingAxisSnapshot = Pick<AxisScore, "id" | "label" | "leftPole" | "rightPole" | "score">;

function toAxisSnapshot(axes: AxisScore[]): PairingAxisSnapshot[] {
  return axes.map((a) => ({ id: a.id, label: a.label, leftPole: a.leftPole, rightPole: a.rightPole, score: a.score }));
}

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return { supabase, user: data.user };
}

async function logPairingEvent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pairingId: string,
  userId: string,
  eventType: "invite_created" | "invite_accepted" | "invite_declined"
) {
  await supabase.from("pairing_events").insert({ pairing_id: pairingId, user_id: userId, event_type: eventType });
}

export async function createPairingInvite(relationshipType: RelationshipType) {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("results, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  if (!combinedProfile) {
    throw new Error("Complete at least 2 assessments before inviting someone to compare");
  }

  const axes = toAxisSnapshot(computeScoringMatrix(results));
  const displayName = profile?.display_name || user.user_metadata?.full_name || null;

  let pairing: { id: string; invite_code: string } | null = null;
  let attempts = 0;
  while (!pairing && attempts < 10) {
    const { data: inserted, error } = await supabase
      .from("pairings")
      .insert({
        inviter_id: user.id,
        invite_code: generateInviteCode(),
        relationship_type: relationshipType,
        inviter_display_name: displayName,
        inviter_axes: axes,
        inviter_archetype_name: combinedProfile.archetype?.name ?? null,
      })
      .select("id, invite_code")
      .single();
    if (!error) pairing = inserted;
    attempts++;
  }
  if (!pairing) throw new Error("Failed to create invite");

  await logPairingEvent(supabase, pairing.id, user.id, "invite_created");

  return { pairingId: pairing.id, code: pairing.invite_code };
}

export async function getPairingPreview(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_pairing_invite_preview", { code: code.trim().toUpperCase() });
  if (error || !data || data.length === 0) return null;
  return data[0] as { id: string; inviter_display_name: string | null; relationship_type: RelationshipType; status: string };
}

export async function acceptPairingInvite(code: string, shareLevel: ShareLevel) {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("results, display_name, acquisition_source")
    .eq("id", user.id)
    .maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  if (!combinedProfile) {
    throw new Error("Complete at least 2 assessments before comparing");
  }

  const axes = toAxisSnapshot(computeScoringMatrix(results));
  const displayName = profile?.display_name || user.user_metadata?.full_name || null;

  // Security-definer RPC — the only path that can ever set invitee_id/
  // status/consent_share_level/axes on this table, so a raw REST call
  // can't smuggle in extra column writes the way a plain client update
  // could (see migration 0004_pairings.sql for the full reasoning).
  const { data: claimed, error: claimError } = await supabase.rpc("accept_pairing_invite", {
    p_code: code.trim().toUpperCase(),
    p_share_level: shareLevel,
    p_display_name: displayName,
    p_axes: axes,
    p_archetype_name: combinedProfile.archetype?.name ?? null,
  });

  if (claimError || !claimed) {
    throw new Error(claimError?.message || "This invite is no longer available");
  }

  if (!profile?.acquisition_source) {
    await supabase
      .from("profiles")
      .update({ acquisition_source: "invite", acquisition_pairing_id: claimed.id })
      .eq("id", user.id)
      .is("acquisition_source", null);
  }

  await logPairingEvent(supabase, claimed.id, user.id, "invite_accepted");

  return { pairingId: claimed.id as string };
}

export async function revokePairingInvite(pairingId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("pairings")
    .update({ status: "revoked" })
    .eq("id", pairingId)
    .eq("inviter_id", user.id)
    .eq("status", "pending");

  if (error) throw new Error("Failed to revoke invite");
}

export async function declinePairingInvite(code: string) {
  const { supabase, user } = await requireUser();

  const preview = await getPairingPreview(code);
  const { error } = await supabase.rpc("decline_pairing_invite", { p_code: code.trim().toUpperCase() });

  if (!error && preview) {
    await logPairingEvent(supabase, preview.id, user.id, "invite_declined");
  }
}

export async function createPairingCheckoutSession(pairingId: string) {
  const { supabase, user } = await requireUser();

  const { data: pairing } = await supabase
    .from("pairings")
    .select("id, inviter_id, invitee_id, status, unlocked_at")
    .eq("id", pairingId)
    .maybeSingle();

  // RLS's select policy already scopes this to the caller being a party
  // to the pairing, but a missing row and "not your pairing" both surface
  // here as pairing === null, so this check also covers not-a-party.
  if (!pairing || (pairing.inviter_id !== user.id && pairing.invitee_id !== user.id)) {
    throw new Error("Not part of this pairing");
  }
  if (pairing.status !== "accepted") {
    throw new Error("Both people need to complete the invite before unlocking the report");
  }
  if (pairing.unlocked_at) {
    throw new Error("This report is already unlocked");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: COMPATIBILITY_REPORT_CURRENCY,
          unit_amount: COMPATIBILITY_REPORT_PRICE_CENTS,
          product_data: { name: "Compatibility Report" },
        },
      },
    ],
    success_url: `${SITE_URL}/pair/${pairingId}/report?checkout=success`,
    cancel_url: `${SITE_URL}/pair/${pairingId}/report?checkout=cancelled`,
    metadata: { pairingId },
  });

  await supabase.from("pairing_purchases").insert({
    pairing_id: pairingId,
    purchaser_id: user.id,
    stripe_checkout_session_id: session.id,
    amount_cents: COMPATIBILITY_REPORT_PRICE_CENTS,
    currency: COMPATIBILITY_REPORT_CURRENCY,
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  return session.url;
}
