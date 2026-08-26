"use server";

import { createClient } from "@/lib/supabase/server";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { generateInviteCode } from "@/lib/inviteCode";
import type { PersonalityResults } from "@/lib/personality/types";

export async function createTeam(name: string, kind: "workplace" | "personal" = "workplace") {
  if (!name || name.trim().length === 0) {
    throw new Error("Team name cannot be empty");
  }
  if (name.length > 100) {
    throw new Error("Team name must be 100 characters or less");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  let team: { id: string } | null = null;
  let attempts = 0;
  while (!team && attempts < 10) {
    const { data: inserted, error } = await supabase
      .from("teams")
      .insert({ name: name.trim(), owner_id: data.user.id, invite_code: generateInviteCode(), kind })
      .select("id")
      .single();
    if (!error) team = inserted;
    attempts++;
  }
  if (!team) throw new Error("Failed to create team");

  const { data: ownProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", data.user.id)
    .maybeSingle();

  const { error: memberError } = await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: data.user.id,
    role: "owner",
    display_name: ownProfile?.display_name || data.user.user_metadata?.full_name || null,
    avatar_url: ownProfile?.avatar_url || data.user.user_metadata?.avatar_url || null,
  });

  if (memberError) {
    // Avoid leaving an orphaned, ownerless team around.
    await supabase.from("teams").delete().eq("id", team.id);
    throw new Error("Failed to create team");
  }

  return team.id as string;
}

export async function joinTeamByCode(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_team_by_code", { code: code.trim().toUpperCase() });
  if (error || !data) throw new Error("Invalid invite code");
  return (data as { id: string }).id;
}

export async function regenerateInviteCode(teamId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  let newCode: string | null = null;
  let attempts = 0;
  while (!newCode && attempts < 10) {
    const candidate = generateInviteCode();
    const { error } = await supabase
      .from("teams")
      .update({ invite_code: candidate })
      .eq("id", teamId)
      .eq("owner_id", data.user.id);
    if (!error) newCode = candidate;
    attempts++;
  }
  if (!newCode) throw new Error("Failed to regenerate invite code");
  return newCode;
}

export async function leaveTeam(teamId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", data.user.id);
}

export async function removeMember(teamId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  const { data: team } = await supabase.from("teams").select("owner_id").eq("id", teamId).maybeSingle();
  if (!team || team.owner_id !== data.user.id) throw new Error("Only the team owner can remove members");

  await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", userId);
}

export async function shareProfileWithTeam(teamId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("results, display_name, avatar_url")
    .eq("id", data.user.id)
    .maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  if (!combinedProfile) {
    throw new Error("Complete at least 2 assessments before sharing with a team");
  }

  await supabase
    .from("team_members")
    .update({
      axes: combinedProfile.axes.map((a) => ({ id: a.id, score: a.score })),
      archetype_name: combinedProfile.archetype?.name ?? null,
      shared_at: new Date().toISOString(),
      // Refresh the join-time identity snapshot in case the member has
      // since updated their display name/avatar in Settings.
      display_name: profile?.display_name || null,
      avatar_url: profile?.avatar_url || null,
    })
    .eq("team_id", teamId)
    .eq("user_id", data.user.id);
}

export async function unshareProfileWithTeam(teamId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  await supabase
    .from("team_members")
    .update({ axes: null, archetype_name: null, shared_at: null })
    .eq("team_id", teamId)
    .eq("user_id", data.user.id);
}
