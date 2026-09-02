"use server";

import { randomBytes, randomInt } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { generateAnonLabel } from "@/lib/discovery/anonLabel";
import { localizedPath } from "@/lib/i18n/serverRedirect";
import type { PersonalityResults } from "@/lib/personality/types";
import type { ApproachableScope, ApproachIntent } from "@/components/discovery/discoveryTypes";

// Petname-style slugs (adjective-animal-suffix, e.g. "clever-otter-4f2a") keep public
// share URLs from leaking the account's real name or email handle.
const ADJECTIVES = [
  "clever", "calm", "bold", "quiet", "swift", "bright", "gentle", "brave",
  "curious", "witty", "sunny", "cosmic", "vivid", "mellow", "nimble", "keen",
];
const ANIMALS = [
  "otter", "falcon", "panda", "fox", "heron", "lynx", "chameleon", "sparrow",
  "badger", "dolphin", "raven", "koala", "wren", "gecko", "orca", "hare",
];

function generateSlug(): string {
  const adjective = ADJECTIVES[randomInt(ADJECTIVES.length)];
  const animal = ANIMALS[randomInt(ANIMALS.length)];
  const suffix = randomBytes(2).toString("hex");
  return `${adjective}-${animal}-${suffix}`;
}

export async function updateDisplayName(name: string) {
  if (!name || name.trim().length === 0) {
    throw new Error("Display name cannot be empty");
  }
  if (name.length > 100) {
    throw new Error("Display name must be 100 characters or less");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  await supabase
    .from("profiles")
    .upsert({ id: data.user.id, display_name: name.trim() });
}

export async function enableSharing() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("share_slug")
    .eq("id", data.user.id)
    .maybeSingle();

  let slug = profile?.share_slug;

  if (!slug) {
    // Generate slug and retry on unique violation
    let attempts = 0;
    while (!slug && attempts < 10) {
      const candidate = generateSlug();
      const { error } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          share_slug: candidate,
          is_public: true,
        },
        { onConflict: "id" }
      );

      if (!error) {
        slug = candidate;
      }
      attempts++;
    }

    if (!slug) {
      throw new Error("Failed to generate unique share slug");
    }
  } else {
    // Slug already exists, just enable public access
    await supabase
      .from("profiles")
      .update({ is_public: true })
      .eq("id", data.user.id);
  }

  return slug;
}

export async function disableSharing() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  await supabase
    .from("profiles")
    .update({ is_public: false })
    .eq("id", data.user.id);
}

// Separate opt-in from is_public/share_slug above: sharing gives one link
// full profile access, this lets strangers with no link find the user in
// a browsable list and message them (see supabase/migrations/0007_approachability.sql,
// 0008_anonymous_discovery.sql). The only writer of profiles.approachable* /
// approachable_snapshots is the set_approachable() security-definer RPC, so
// this action just assembles the same slim axes/archetype snapshot
// createPairingInvite/shareProfileWithTeam already compute and hands it to
// that RPC — real display_name/avatar_url are never sent here at all;
// set_approachable stores only a generated pseudonym (anon_label), matching
// the "anonymous until a connection is accepted" requirement.
// Every user-owned table (profiles, snapshots, teams, pairings,
// approachable_snapshots, blocks, reports, ...) declares its user_id/owner_id
// FK as `references auth.users (id) on delete cascade` (see supabase/migrations),
// so deleting the auth user is enough to erase everything tied to them —
// requires the service-role client since a user can't delete their own
// auth.users row through the anon-key client.
export async function deleteAccount() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) throw new Error("Not authenticated");

  const admin = createServiceRoleClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error(error.message);

  await supabase.auth.signOut();
  redirect(await localizedPath("/"));
}

export async function setApproachable(on: boolean, scope: ApproachableScope, intents: ApproachIntent[] | null) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");

  if (!on || scope === "paused") {
    const { error } = await supabase.rpc("set_approachable", {
      p_on: false,
      p_scope: "paused",
      p_intents: null,
      p_axes: null,
      p_archetype_name: null,
      p_anon_label: null,
    });
    if (error) throw new Error(error.message);
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("results")
    .eq("id", data.user.id)
    .maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  if (!combinedProfile) {
    throw new Error("Complete at least 2 assessments before turning this on");
  }

  const axes = computeScoringMatrix(results).map((a) => ({ id: a.id, score: a.score }));

  const { error } = await supabase.rpc("set_approachable", {
    p_on: true,
    p_scope: scope,
    p_intents: scope === "intents" ? intents : null,
    p_axes: axes,
    p_archetype_name: combinedProfile.archetype?.name ?? null,
    p_anon_label: generateAnonLabel(),
  });
  if (error) throw new Error(error.message);
}
