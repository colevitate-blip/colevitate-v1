import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { ApproachabilitySettingsForm, type ApproachabilityMeta } from "@/components/settings/ApproachabilitySettingsForm";
import type { ProfileMeta } from "@/lib/personality/storage";
import type { ApproachableScope, ApproachIntent } from "@/components/discovery/discoveryTypes";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(await loginRedirectTarget("/settings"));
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, is_public, share_slug, approachable, approachable_scope, approachable_intents")
    .eq("id", user.id)
    .maybeSingle();

  // Separate table/query: the anon_label a stranger would actually see lives on
  // approachable_snapshots (see 0008_anonymous_discovery.sql), not profiles —
  // only present once the user has turned approachable on at least once.
  const { data: snapshotData } = await supabase
    .from("approachable_snapshots")
    .select("anon_label")
    .eq("user_id", user.id)
    .maybeSingle();

  const profileMeta: ProfileMeta = {
    displayName: profileData?.display_name || null,
    avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url || null,
    isPublic: profileData?.is_public || false,
    shareSlug: profileData?.share_slug || null,
  };

  const approachabilityMeta: ApproachabilityMeta = {
    approachable: profileData?.approachable || false,
    scope: (profileData?.approachable_scope as ApproachableScope) || "paused",
    intents: (profileData?.approachable_intents as ApproachIntent[] | null) || null,
    anonLabel: snapshotData?.anon_label || null,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile and sharing preferences
        </p>
      </div>

      <div className="space-y-6">
        <AccountSettingsForm userId={user.id} initialMeta={profileMeta} userEmail={user.email || ""} userAvatar={user.user_metadata?.avatar_url} />
        <ApproachabilitySettingsForm initialMeta={approachabilityMeta} />
      </div>
    </div>
  );
}
