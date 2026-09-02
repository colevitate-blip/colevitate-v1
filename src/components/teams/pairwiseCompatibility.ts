import { AXES } from "@/components/personality/combined/scoringMatrix";
import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import type { SharedMemberAxes } from "./teamInsights";

export interface PairwiseCompatibilityResult {
  /** Symmetric N×N matrix of overallScore (0..100); diagonal is 100 (self). */
  matrix: number[][];
  /** Member with the highest average compatibility against everyone else. null below 3 members — "highest average" isn't a meaningful distinction with only one other person to compare against. */
  anchorIndex: number | null;
  /** Member whose compatibility swings the most from person to person (max - min pairwise score). Same 3-member floor as anchorIndex. */
  wildcardIndex: number | null;
}

// computeCompatibility expects each axis to carry its label/poles (it builds
// per-axis sentences from them), but SharedMemberAxes only stores id/score —
// so re-attach the metadata from AXES before scoring each pair.
function toComparableAxes(member: SharedMemberAxes) {
  return AXES.map((axis) => ({
    id: axis.id,
    label: axis.label,
    leftPole: axis.leftPole,
    rightPole: axis.rightPole,
    score: member.axes.find((a) => a.id === axis.id)?.score ?? 0,
  }));
}

export function computePairwiseCompatibility(members: SharedMemberAxes[]): PairwiseCompatibilityResult {
  const n = members.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(100));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const { overallScore } = computeCompatibility(
        toComparableAxes(members[i]),
        toComparableAxes(members[j]),
        members[i].displayName,
        members[j].displayName
      );
      matrix[i][j] = overallScore;
      matrix[j][i] = overallScore;
    }
  }

  if (n < 3) return { matrix, anchorIndex: null, wildcardIndex: null };

  let anchorIndex = 0;
  let anchorAvg = -Infinity;
  let wildcardIndex = 0;
  let wildcardSpread = -Infinity;

  for (let i = 0; i < n; i++) {
    const others = matrix[i].filter((_, j) => j !== i);
    const avg = others.reduce((sum, v) => sum + v, 0) / others.length;
    const spread = Math.max(...others) - Math.min(...others);
    if (avg > anchorAvg) {
      anchorAvg = avg;
      anchorIndex = i;
    }
    if (spread > wildcardSpread) {
      wildcardSpread = spread;
      wildcardIndex = i;
    }
  }

  return { matrix, anchorIndex, wildcardIndex };
}
