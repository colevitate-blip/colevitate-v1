import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";
import { SkippedList, type SkippedRow } from "@/components/discovery/SkippedList";

export default async function SkippedPage() {
  const t = await getTranslations("discovery.skipped");
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect(await loginRedirectTarget("/discover/skipped"));
  }

  const { data: skipRows } = await supabase
    .from("discovery_skips")
    .select("skipped_user_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const skipped = (skipRows as { skipped_user_id: string; created_at: string }[] | null) || [];

  // A skipped user may have since paused/turned off approachability
  // entirely, in which case their snapshot row no longer exists (see
  // set_approachable() in 0007/0008) — this list falls back to a generic
  // label in that case rather than treating it as an error.
  let snapshotById = new Map<string, { anon_label: string; archetype_name: string | null }>();
  if (skipped.length > 0) {
    const { data: snapshotRows } = await supabase
      .from("approachable_snapshots")
      .select("user_id, anon_label, archetype_name")
      .in(
        "user_id",
        skipped.map((s) => s.skipped_user_id)
      );
    snapshotById = new Map(
      ((snapshotRows as { user_id: string; anon_label: string; archetype_name: string | null }[] | null) || []).map((s) => [
        s.user_id,
        { anon_label: s.anon_label, archetype_name: s.archetype_name },
      ])
    );
  }

  const rows: SkippedRow[] = skipped.map((s) => {
    const snapshot = snapshotById.get(s.skipped_user_id);
    return {
      userId: s.skipped_user_id,
      displayName: snapshot?.anon_label || null,
      archetypeName: snapshot?.archetype_name ?? null,
      skippedAt: s.created_at,
    };
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <SkippedList initialRows={rows} />
    </div>
  );
}
