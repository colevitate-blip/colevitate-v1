import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import {
  APPROACH_INTENTS,
  hydrateAxisSnapshot,
  type ApproachIntent,
  type StoredAxisSnapshot,
} from "@/components/discovery/discoveryTypes";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";
import { DiscoverCard, type DiscoverCardData } from "@/components/discovery/DiscoverCard";
import type { PersonalityResults } from "@/lib/personality/types";
import { cn } from "@/lib/utils";

interface SnapshotRow {
  user_id: string;
  anon_label: string;
  axes: StoredAxisSnapshot[];
  archetype_name: string | null;
}

function isApproachIntent(value: string | undefined): value is ApproachIntent {
  return APPROACH_INTENTS.includes(value as ApproachIntent);
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const intentFilter = isApproachIntent(intent) ? intent : null;

  const t = await getTranslations("discovery");
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect(await loginRedirectTarget("/discover"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("results, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  const viewerAxes = combinedProfile ? computeScoringMatrix(results) : null;
  const viewerName = profile?.display_name || user.user_metadata?.full_name || "You";

  let query = supabase
    .from("approachable_snapshots")
    .select("user_id, anon_label, axes, archetype_name")
    .neq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(60);

  if (intentFilter) {
    query = query.or(`scope.eq.everyone,intents.cs.{${intentFilter}}`);
  }

  const { data: rows } = await query;
  const snapshots = (rows as SnapshotRow[] | null) || [];

  let alreadySent = new Set<string>();
  if (snapshots.length > 0) {
    const { data: sentRows } = await supabase
      .from("approach_requests")
      .select("recipient_id")
      .eq("sender_id", user.id)
      .eq("status", "pending")
      .in(
        "recipient_id",
        snapshots.map((s) => s.user_id)
      );
    alreadySent = new Set((sentRows || []).map((r: { recipient_id: string }) => r.recipient_id));
  }

  const cards: DiscoverCardData[] = snapshots.map((s) => {
    const candidateAxes = hydrateAxisSnapshot(s.axes);
    const commonGround = viewerAxes
      ? computeCompatibility(viewerAxes, candidateAxes, viewerName, s.anon_label || "them")
          .axes.filter((a) => a.bucket === "aligned")
          .map((a) => a.label)
      : [];
    return {
      userId: s.user_id,
      // Anon label only — never a real name/photo. Real identity is revealed
      // to the other party solely via a mutually accepted approach request
      // (see supabase/migrations/0008_anonymous_discovery.sql).
      displayName: s.anon_label || "Someone",
      avatarUrl: null,
      archetypeName: s.archetype_name,
      commonGround,
      alreadySent: alreadySent.has(s.user_id),
    };
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("browse.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("browse.subtitle")}</p>
      </div>

      {!combinedProfile && (
        <p className="mb-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">{t("browse.needOwnProfile")}</p>
      )}

      <div className="mb-6">
        <p className="mb-2 text-xs font-medium text-muted-foreground">{t("browse.intentFilterLabel")}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/discover"
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              !intentFilter ? "border-primary bg-primary/5 text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("browse.intentFilterAll")}
          </Link>
          {APPROACH_INTENTS.map((value) => (
            <Link
              key={value}
              href={`/discover?intent=${value}`}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                intentFilter === value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(`settings.intent${value.charAt(0).toUpperCase()}${value.slice(1)}` as "settings.intentFriend")}
            </Link>
          ))}
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <DiscoverCard key={card.userId} profile={card} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("browse.empty")}</p>
      )}
    </div>
  );
}
