import type { PersonalityResults } from "@/lib/personality/types";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";
import { summarizeBigFive } from "@/components/personality/bigfive/content";

export interface FrameworkBadges {
  mbti: string | null;
  humandesign: string | null;
  colors: string | null;
  bigfive: string | null;
}

/**
 * One display label per completed framework — MBTI's own type code, and each
 * other framework's existing "name" (Human Design's HD_CONTENT, Big Five's
 * summarizeBigFive) exactly as already shown on that framework's own result
 * screen, so a discover-card badge never invents a new label that could
 * drift from what the assessment itself calls it. Null for any framework
 * the user hasn't completed — approachable_snapshots stores these the same
 * way it already stores archetype_name (a computed display string, never
 * the raw per-question results).
 */
export function computeFrameworkBadges(results: PersonalityResults): FrameworkBadges {
  return {
    mbti: results.mbti?.type ?? null,
    humandesign: results.humandesign ? HD_CONTENT[results.humandesign.type].name : null,
    colors: results.colors ? COLOR_CONTENT[results.colors.dominant].name : null,
    bigfive: results.bigfive ? summarizeBigFive(results.bigfive).name : null,
  };
}
