"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SlimProfileCard } from "@/components/discovery/SlimProfileCard";
import { ApproachComposeDialog } from "@/components/discovery/ApproachComposeDialog";
import { SafetyActions, SkipAction } from "@/components/discovery/SafetyActions";
import { FrameworkBadges } from "@/components/discovery/FrameworkBadges";

export interface DiscoverCardData {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  archetypeName: string | null;
  commonGround: string[];
  /** 0-100, or null when the viewer has no combined profile yet to compare against (see needOwnProfile). */
  compatibilityScore: number | null;
  /** One sentence naming the widest-gap axis where the two of you differ, or null alongside compatibilityScore. */
  contrast: string | null;
  /** One display label per completed framework (e.g. "INFJ", "The Generator"), null for any framework this person hasn't completed. */
  mbtiBadge: string | null;
  humandesignBadge: string | null;
  colorsBadge: string | null;
  bigfiveBadge: string | null;
  alreadySent: boolean;
}

export function DiscoverCard({
  profile,
  onBlocked,
  onSkipped,
  onApproached,
}: {
  profile: DiscoverCardData;
  onBlocked?: () => void;
  onSkipped?: () => void;
  onApproached?: () => void;
}) {
  const t = useTranslations("discovery");

  return (
    <SlimProfileCard
      displayName={profile.displayName}
      avatarUrl={profile.avatarUrl}
      archetypeName={profile.archetypeName}
      cornerAction={<SafetyActions variant="menu" userId={profile.userId} onBlocked={onBlocked} />}
    >
      {profile.compatibilityScore !== null && (
        <p className="text-sm font-semibold text-primary">
          {t("browse.compatibilityLabel", { percent: profile.compatibilityScore })}
        </p>
      )}

      <FrameworkBadges
        mbtiBadge={profile.mbtiBadge}
        humandesignBadge={profile.humandesignBadge}
        colorsBadge={profile.colorsBadge}
        bigfiveBadge={profile.bigfiveBadge}
      />

      {profile.commonGround.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("browse.commonGround")}</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.commonGround.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {profile.contrast && <p className="text-xs text-muted-foreground">{profile.contrast}</p>}

      {/* Approach/Skip are the two primary, equally-weighted decisions on
          this card — Report/Block moved into the corner kebab above since
          they're safety actions, not browsing decisions. Both data-discover-action
          hooks let DiscoverFeed's keyboard shortcuts (arrow keys) target
          whichever card is currently on top without prop-drilling refs. */}
      <div className="flex items-center gap-2 border-t pt-3">
        <SkipAction userId={profile.userId} onSkipped={onSkipped} size="lg" className="flex-1" />
        {profile.alreadySent ? (
          <span className="flex-1 py-1.5 text-center text-xs text-muted-foreground">{t("compose.sent")}</span>
        ) : (
          <ApproachComposeDialog recipientId={profile.userId} recipientName={profile.displayName} onSent={onApproached} />
        )}
      </div>
    </SlimProfileCard>
  );
}
