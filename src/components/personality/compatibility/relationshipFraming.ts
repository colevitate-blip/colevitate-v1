import type { AxisId } from "@/lib/personality/types";
import type { AxisCompatibility, Compatibility } from "@/components/personality/combined/computeCompatibility";

export type RelationshipType = "romantic" | "friend" | "coworker";

export const RELATIONSHIP_TYPE_ORDER: RelationshipType[] = ["romantic", "friend", "coworker"];

interface RelationshipFraming {
  label: string;
  reportTitle: string;
  /** One clause describing what this report is for, used in the report's intro line. */
  aboutClause: (nameA: string, nameB: string) => string;
  /** Same axis, relationship-specific label — the underlying math never changes. */
  axisLabels: Record<AxisId, string>;
}

const RELATIONSHIP_FRAMING: Record<RelationshipType, RelationshipFraming> = {
  romantic: {
    label: "Romantic Partner",
    reportTitle: "Romantic Compatibility Report",
    aboutClause: (nameA, nameB) => `how ${nameA} and ${nameB} pair up as partners — closeness, conflict, and everyday rhythm`,
    axisLabels: {
      energy: "Social Energy Fit",
      structure: "Planning & Spontaneity",
      people: "Conflict Style Fit",
      novelty: "Shared Adventure",
    },
  },
  friend: {
    label: "Friend",
    reportTitle: "Friendship Compatibility Report",
    aboutClause: (nameA, nameB) => `how ${nameA} and ${nameB} click day-to-day as friends`,
    axisLabels: {
      energy: "Social Energy Fit",
      structure: "Planning Style",
      people: "Communication Style Fit",
      novelty: "Novelty Seeking",
    },
  },
  coworker: {
    label: "Coworker",
    reportTitle: "Coworker Compatibility Report",
    aboutClause: (nameA, nameB) => `how ${nameA} and ${nameB} are likely to collaborate day-to-day`,
    axisLabels: {
      energy: "Collaboration Energy",
      structure: "Work Pace Fit",
      people: "Communication Style Fit",
      novelty: "Approach to New Ideas",
    },
  },
};

export function relationshipFramingFor(type: RelationshipType): RelationshipFraming {
  return RELATIONSHIP_FRAMING[type];
}

export type MatchGaugeBand = "poor" | "rocky" | "mixed" | "strong" | "great";

export interface MatchGauge {
  value: number; // 1..10, "not good" to "great"
  band: MatchGaugeBand;
  label: string;
}

/**
 * Per-relationship-type axis weights for the 1-10 match gauge. Unlike
 * computeCompatibility's overallScore (a flat average, meant to be a
 * framework-agnostic read of "how similar are these two people"), the gauge
 * is meant to answer "how good a match is this *for this relationship*" —
 * so it weights the axis most predictive of that relationship working out
 * more heavily.
 */
const MATCH_GAUGE_WEIGHTS: Record<RelationshipType, Record<AxisId, number>> = {
  romantic: { energy: 0.2, structure: 0.15, people: 0.45, novelty: 0.2 },
  friend: { energy: 0.35, structure: 0.15, people: 0.2, novelty: 0.3 },
  coworker: { energy: 0.15, structure: 0.55, people: 0.2, novelty: 0.1 },
};

const BAND_LABELS: Record<MatchGaugeBand, string> = {
  poor: "Not a Match",
  rocky: "Rocky Fit",
  mixed: "Mixed Bag",
  strong: "Strong Match",
  great: "Great Match",
};

function bandForValue(value: number): MatchGaugeBand {
  if (value <= 2) return "poor";
  if (value <= 4) return "rocky";
  if (value <= 6) return "mixed";
  if (value <= 8) return "strong";
  return "great";
}

/**
 * Gauge for every relationship type at once, for the *same* pair — never one
 * type in isolation. Two axis weight vectors can legitimately round to the
 * same 1-10 value for a given pair (they're different weighted averages of
 * the same four axes, so collisions happen), but showing "8/10" on both the
 * Romantic and Coworker tabs for one couple reads as a bug, not a
 * coincidence. So the three raw (unrounded) scores are ranked and nudged
 * apart just enough to stay distinct, preserving their relative order —
 * always possible since there are only 3 relationship types across a 1-10
 * range.
 */
export function computeMatchGauges(compatibility: Compatibility): Record<RelationshipType, MatchGauge> {
  const raw = RELATIONSHIP_TYPE_ORDER.map((type) => {
    const weights = MATCH_GAUGE_WEIGHTS[type];
    const weighted = compatibility.axes.reduce((sum, axis) => sum + (weights[axis.id] ?? 0) * axis.similarity, 0);
    return { type, scaled: 1 + (weighted / 100) * 9 };
  }).sort((x, y) => x.scaled - y.scaled);

  const values = raw.map(({ scaled }) => Math.max(1, Math.min(10, Math.round(scaled))));
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) values[i] = values[i - 1] + 1;
  }
  if (values[values.length - 1] > 10) {
    values[values.length - 1] = 10;
    for (let i = values.length - 2; i >= 0; i--) {
      if (values[i] >= values[i + 1]) values[i] = values[i + 1] - 1;
    }
  }

  const gauges = {} as Record<RelationshipType, MatchGauge>;
  raw.forEach(({ type }, i) => {
    const value = values[i];
    const band = bandForValue(value);
    gauges[type] = { value, band, label: BAND_LABELS[band] };
  });
  return gauges;
}

/**
 * One-line "why" under the gauge, naming the axis that's dragging the score
 * down (or, when nothing is, saying so). Uses the already relationship-framed
 * axis labels so it reads as "conflict style fit" for a romantic pairing vs.
 * "communication style fit" for a coworker pairing, even though it's the same
 * underlying axis. Deliberately picks by raw similarity (not gauge weight) —
 * the point is to surface the single most concrete friction point, not
 * re-derive the weighted score in prose.
 */
export function verdictFor(gauge: MatchGauge, axes: AxisCompatibility[]): string {
  const weakest = axes.reduce((worst, axis) => (axis.similarity < worst.similarity ? axis : worst));
  const axisLabel = weakest.label.toLowerCase();

  switch (gauge.band) {
    case "great":
      return weakest.bucket === "aligned"
        ? "Aligned across the board, with little friction to speak of."
        : `Aligned on most fronts, with occasional friction around ${axisLabel}.`;
    case "strong":
      return `Works well overall — the most likely friction point is ${axisLabel}.`;
    case "mixed":
      return `A mixed fit, with real friction likely around ${axisLabel}.`;
    case "rocky":
      return `Likely to take real effort, especially around ${axisLabel}.`;
    case "poor":
      return `Friction across several axes, most notably ${axisLabel}.`;
  }
}

/**
 * Applies relationship-specific axis labels/report copy on top of an
 * already-computed Compatibility. Deliberately never touches
 * scoreA/scoreB/similarity/bucket/sentence — those come from
 * computeCompatibility's framework-agnostic math and stay identical
 * regardless of relationship type; only the framing changes.
 */
export function frameCompatibility(compatibility: Compatibility, type: RelationshipType): Compatibility {
  const framing = RELATIONSHIP_FRAMING[type];
  return {
    ...compatibility,
    axes: compatibility.axes.map((axis) => ({
      ...axis,
      label: framing.axisLabels[axis.id] ?? axis.label,
    })),
  };
}
