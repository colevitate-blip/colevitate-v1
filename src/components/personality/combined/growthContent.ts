import type { AxisScore } from "./scoringMatrix";
import type { Translator } from "./scoringMatrix";
import { getArchetypeKey } from "./archetypeMatrix";

// One concrete, actionable growth prompt per axis, keyed by that axis's own
// stable tierIndex (0-4, the same bucketing scoringMatrix.ts already
// computes — no separate bucketing logic to keep in sync here).
export function getAxisGrowthPrompt(axis: AxisScore, t: Translator): string | null {
  return t(`growth.axisPrompts.${axis.id}.${axis.tierIndex}`);
}

// Career/role-fit suggestions, keyed by the same 16 archetype buckets
// archetypeMatrix.ts computes — tied to the archetype for specificity
// rather than derived from raw axis scores directly.
export function getCareerSuggestions(axes: AxisScore[], t: Translator): string[] {
  const key = getArchetypeKey(axes);
  if (!key) return [];
  return [0, 1, 2, 3].map((i) => t(`growth.careerSuggestions.${key}.${i}`));
}
