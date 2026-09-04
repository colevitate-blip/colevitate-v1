import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { fetchDiscoverPage } from "@/app/[locale]/(personality)/discover/discoveryQuery";
import { APPROACH_INTENTS, type ApproachIntent } from "@/components/discovery/discoveryTypes";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";
import { DiscoverFeed } from "@/components/discovery/DiscoverFeed";
import type { PersonalityResults } from "@/lib/personality/types";
import { cn } from "@/lib/utils";

function isApproachIntent(value: string | undefined): value is ApproachIntent {
  return APPROACH_INTENTS.includes(value as ApproachIntent);
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const intentFilter: ApproachIntent = isApproachIntent(intent) ? intent : "friend";

  const t = await getTranslations("discovery");
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect(await loginRedirectTarget("/discover"));
  }

  const { data: profile } = await supabase.from("profiles").select("results").eq("id", user.id).maybeSingle();

  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);
  const viewerAxes = combinedProfile ? computeScoringMatrix(results) : null;

  const { cards, nextCursor } = await fetchDiscoverPage(supabase, {
    viewerId: user.id,
    viewerAxes,
    // Discovery is anonymous in both directions — the compatibility sentence
    // reads "You lean..." rather than the viewer's real display name, unlike
    // the pair/actions.ts usage of this same helper for a known connection.
    viewerName: "You",
    intentFilter,
    cursor: null,
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

      {/* Keyed by intent so switching filters (a Link navigation, not a
          client-side state change) remounts the feed instead of keeping the
          previous filter's already-seeded card list/cursor. */}
      <DiscoverFeed key={intentFilter} initialCards={cards} initialNextCursor={nextCursor} intentFilter={intentFilter} />
    </div>
  );
}
