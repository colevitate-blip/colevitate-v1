"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface DiscoverPersonalDetailsValues {
  age: number | null;
  ageHiddenByViewer: boolean;
  locationCountry: string | null;
  locationRegion: string | null;
  locationHiddenByViewer: boolean;
}

/**
 * One line per field (age, location) — shared between the discover card and
 * the settings "what a stranger would see" preview, same reasoning as
 * FrameworkBadges/SlimProfileCard. Three states per field, not two: shared
 * (show the value), not shared by this person ("not known yet"), or hidden
 * specifically because the viewer hasn't shared their own yet — reciprocity
 * (see 0014_discover_age_location.sql) needs a distinct, actionable nudge
 * rather than reading as if the other person just never filled it in.
 */
export function DiscoverPersonalDetails({
  age,
  ageHiddenByViewer,
  locationCountry,
  locationRegion,
  locationHiddenByViewer,
}: DiscoverPersonalDetailsValues) {
  const t = useTranslations("discovery.browse");

  const ageText = ageHiddenByViewer
    ? t("shareAgeToSeeTheirs")
    : age !== null
      ? t("ageValue", { age })
      : t("ageNotShared");

  const locationText = locationHiddenByViewer
    ? t("shareLocationToSeeTheirs")
    : locationCountry
      ? locationRegion
        ? `${locationRegion}, ${locationCountry}`
        : locationCountry
      : t("locationNotShared");

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span>
        {ageHiddenByViewer ? (
          <Link href="/settings" className="underline hover:text-foreground">
            {ageText}
          </Link>
        ) : (
          ageText
        )}
      </span>
      <span aria-hidden>·</span>
      <span>
        {locationHiddenByViewer ? (
          <Link href="/settings" className="underline hover:text-foreground">
            {locationText}
          </Link>
        ) : (
          locationText
        )}
      </span>
    </div>
  );
}
