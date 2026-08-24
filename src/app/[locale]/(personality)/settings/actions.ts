"use server";

import { randomBytes, randomInt } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

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
