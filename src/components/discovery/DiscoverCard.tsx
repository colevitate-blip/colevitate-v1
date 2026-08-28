"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SlimProfileCard } from "@/components/discovery/SlimProfileCard";
import { ApproachComposeDialog } from "@/components/discovery/ApproachComposeDialog";
import { SafetyActions } from "@/components/discovery/SafetyActions";

export interface DiscoverCardData {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  archetypeName: string | null;
  commonGround: string[];
  alreadySent: boolean;
}

export function DiscoverCard({ profile }: { profile: DiscoverCardData }) {
  const t = useTranslations("discovery");

  return (
    <SlimProfileCard
      displayName={profile.displayName}
      avatarUrl={profile.avatarUrl}
      archetypeName={profile.archetypeName}
    >
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

      <div className="flex items-center justify-between gap-2 border-t pt-3">
        {profile.alreadySent ? (
          <span className="text-xs text-muted-foreground">{t("compose.sent")}</span>
        ) : (
          <ApproachComposeDialog recipientId={profile.userId} recipientName={profile.displayName} />
        )}
        <SafetyActions userId={profile.userId} />
      </div>
    </SlimProfileCard>
  );
}
