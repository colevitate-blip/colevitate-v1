import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import type { ProfileMeta } from "@/lib/personality/storage";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(`/login?next=/settings`);
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, is_public, share_slug")
    .eq("id", user.id)
    .maybeSingle();

  const profileMeta: ProfileMeta = {
    displayName: profileData?.display_name || null,
    avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url || null,
    isPublic: profileData?.is_public || false,
    shareSlug: profileData?.share_slug || null,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile and sharing preferences
        </p>
      </div>

      <AccountSettingsForm userId={user.id} initialMeta={profileMeta} userEmail={user.email || ""} userAvatar={user.user_metadata?.avatar_url} />
    </div>
  );
}
