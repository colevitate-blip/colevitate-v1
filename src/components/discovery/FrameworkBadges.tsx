import { Badge } from "@/components/ui/badge";

export interface FrameworkBadgeValues {
  mbtiBadge: string | null;
  humandesignBadge: string | null;
  colorsBadge: string | null;
  bigfiveBadge: string | null;
}

/**
 * Renders whichever per-framework badges are present — shared between the
 * discover card and the settings "what a stranger would see" preview so the
 * two surfaces can never show different things (same reasoning as
 * SlimProfileCard itself).
 */
export function FrameworkBadges({ mbtiBadge, humandesignBadge, colorsBadge, bigfiveBadge }: FrameworkBadgeValues) {
  const values = [mbtiBadge, humandesignBadge, colorsBadge, bigfiveBadge].filter((v): v is string => Boolean(v));
  if (values.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <Badge key={value} variant="secondary">
          {value}
        </Badge>
      ))}
    </div>
  );
}
