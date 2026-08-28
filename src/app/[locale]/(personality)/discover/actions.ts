"use server";

import { createClient } from "@/lib/supabase/server";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { generateAnonLabel } from "@/lib/discovery/anonLabel";
import type { PersonalityResults } from "@/lib/personality/types";
import type { ApproachIntent } from "@/components/discovery/discoveryTypes";

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return { supabase, user: data.user };
}

// Mirrors createPairingInvite/shareProfileWithTeam: compute the sender's
// own slim axes snapshot client-request-side, then hand everything to the
// security-definer RPC, which is the only thing that can validate the
// recipient's approachable/scope/intent state and write the row (see
// supabase/migrations/0007_approachability.sql, 0008_anonymous_discovery.sql).
// Real display_name/avatar_url are never sent — only the sender's existing
// anon_label (falling back to a fresh one for a sender who isn't approachable
// themselves and so has no snapshot row yet).
export async function sendApproach(recipientId: string, message: string, intent: ApproachIntent) {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("results")
    .eq("id", user.id)
    .maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  if (!combinedProfile) {
    throw new Error("Complete at least 2 assessments before approaching someone");
  }

  const axes = computeScoringMatrix(results).map((a) => ({ id: a.id, score: a.score }));

  const { data: snapshot } = await supabase
    .from("approachable_snapshots")
    .select("anon_label")
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = await supabase.rpc("send_approach_request", {
    p_recipient_id: recipientId,
    p_message: message,
    p_intent: intent,
    p_sender_axes: axes,
    p_sender_archetype_name: combinedProfile.archetype?.name ?? null,
    p_sender_anon_label: snapshot?.anon_label || generateAnonLabel(),
  });
  if (error) throw new Error(error.message);
}

export async function acceptApproach(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("accept_approach_request", { p_id: id });
  if (error) throw new Error(error.message);
}

export async function declineApproach(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("decline_approach_request", { p_id: id });
  if (error) throw new Error(error.message);
}

export async function withdrawApproach(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("withdraw_approach_request", { p_id: id });
  if (error) throw new Error(error.message);
}

export async function blockUser(userId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("block_user", { p_blocked_id: userId });
  if (error) throw new Error(error.message);
}

export async function reportUser(reportedUserId: string, reportedApproachRequestId: string | null, reason: string, details: string | null) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("submit_report", {
    p_reported_user_id: reportedUserId,
    p_reported_approach_request_id: reportedApproachRequestId,
    p_reason: reason,
    p_details: details,
  });
  if (error) throw new Error(error.message);
}

export async function deleteApproachabilityData() {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("delete_approachability_data");
  if (error) throw new Error(error.message);
}
