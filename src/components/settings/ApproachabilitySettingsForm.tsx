"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePersonality } from "@/lib/personality/context";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { setApproachable } from "@/app/[locale]/(personality)/settings/actions";
import { SlimProfileCard } from "@/components/discovery/SlimProfileCard";
import { APPROACH_INTENTS, type ApproachIntent, type ApproachableScope } from "@/components/discovery/discoveryTypes";

export interface ApproachabilityMeta {
  approachable: boolean;
  scope: ApproachableScope;
  intents: ApproachIntent[] | null;
  displayName: string | null;
}

export function ApproachabilitySettingsForm({ initialMeta }: { initialMeta: ApproachabilityMeta }) {
  const t = useTranslations("discovery.settings");
  const { results } = usePersonality();

  const [on, setOn] = useState(initialMeta.approachable);
  const [scope, setScope] = useState<ApproachableScope>(
    initialMeta.scope === "paused" ? "everyone" : initialMeta.scope
  );
  const [intents, setIntents] = useState<Set<ApproachIntent>>(new Set(initialMeta.intents || []));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const combinedProfile = useMemo(() => generateCombinedProfile(results), [results]);
  const hasEnoughAssessments = combinedProfile !== null;

  const toggleIntent = useCallback((intent: ApproachIntent) => {
    setIntents((prev) => {
      const next = new Set(prev);
      if (next.has(intent)) next.delete(intent);
      else next.add(intent);
      return next;
    });
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const effectiveScope: ApproachableScope = on ? scope : "paused";
      await setApproachable(on, effectiveScope, effectiveScope === "intents" ? Array.from(intents) : null);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setSaving(false);
    }
  }, [on, scope, intents, t]);

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-6">
      <div>
        <h2 className="font-semibold">{t("title")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("explainer")}</p>
      </div>

      {!hasEnoughAssessments && (
        <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">{t("needAssessments")}</p>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{t("toggleLabel")}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{on ? t("toggleOn") : t("toggleOff")}</span>
          <Switch
            checked={on}
            disabled={!hasEnoughAssessments || saving}
            onCheckedChange={(checked) => {
              setOn(checked);
              setSaved(false);
            }}
          />
        </div>
      </div>

      {on && (
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium">{t("scopeLabel")}</p>
          <div className="flex flex-col gap-2">
            {(["everyone", "intents"] as const).map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="approachable-scope"
                  checked={scope === value}
                  onChange={() => {
                    setScope(value);
                    setSaved(false);
                  }}
                />
                {value === "everyone" ? t("scopeEveryone") : t("scopeIntents")}
              </label>
            ))}
          </div>

          {scope === "intents" && (
            <div className="flex flex-wrap gap-2 pl-1">
              {APPROACH_INTENTS.map((intent) => (
                <label
                  key={intent}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
                >
                  <input type="checkbox" checked={intents.has(intent)} onChange={() => toggleIntent(intent)} />
                  {t(`intent${intent.charAt(0).toUpperCase()}${intent.slice(1)}` as "intentFriend")}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {on && hasEnoughAssessments && combinedProfile && (
        <div className="border-t pt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t("previewTitle")}</p>
          <SlimProfileCard
            displayName={initialMeta.displayName || "You"}
            avatarUrl={null}
            archetypeName={combinedProfile.archetype?.name ?? null}
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 border-t pt-4">
        <Button onClick={handleSave} disabled={saving || (on && !hasEnoughAssessments)}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : t("saveButton")}
        </Button>
        {saved && <span className="text-xs text-muted-foreground">{t("saved")}</span>}
        <Button asChild variant="ghost" size="sm" className="ml-auto">
          <Link href="/discover/requests">{t("manageRequests")}</Link>
        </Button>
      </div>
    </div>
  );
}
