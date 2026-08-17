"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSlug(baseName: string): string {
  const base = slugify(baseName) || "profile";
  const suffix = randomBytes(3).toString("hex");
  return `${base}-${suffix}`;
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
    const { data: displayNameData } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", data.user.id)
      .maybeSingle();

    const baseName = displayNameData?.display_name || data.user.email?.split("@")[0] || "profile";

    // Generate slug and retry on unique violation
    let attempts = 0;
    while (!slug && attempts < 10) {
      const candidate = generateSlug(baseName);
      const { error } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          share_slug: candidate,
          is_public: true,
        },
        { onConflict: "share_slug" }
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
