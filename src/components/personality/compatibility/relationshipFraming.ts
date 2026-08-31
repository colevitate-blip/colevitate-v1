import type { AxisId } from "@/lib/personality/types";
import type { Compatibility } from "@/components/personality/combined/computeCompatibility";

export type RelationshipType = "romantic" | "friend" | "coworker" | "manager";

export const RELATIONSHIP_TYPE_ORDER: RelationshipType[] = ["romantic", "friend", "coworker", "manager"];

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
  manager: {
    label: "Manager / Direct Report",
    reportTitle: "Manager ↔ Direct Report Compatibility Report",
    aboutClause: (nameA, nameB) => `how ${nameA} and ${nameB} are likely to work together as manager and direct report`,
    axisLabels: {
      energy: "Engagement Style",
      structure: "Structure & Autonomy Fit",
      people: "Feedback Style Fit",
      novelty: "Risk & Innovation Appetite",
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
 * more heavily. No manager entry: a manager/direct-report pairing isn't a
 * "match" you'd score 1-10 like a romantic, friend, or coworker pairing, so
 * that tab deliberately shows no gauge.
 */
const MATCH_GAUGE_WEIGHTS: Partial<Record<RelationshipType, Record<AxisId, number>>> = {
  romantic: { energy: 0.25, structure: 0.2, people: 0.35, novelty: 0.2 },
  friend: { energy: 0.3, structure: 0.15, people: 0.3, novelty: 0.25 },
  coworker: { energy: 0.15, structure: 0.35, people: 0.3, novelty: 0.2 },
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

/** `null` for a relationship type with no configured weights (currently just "manager") — callers should hide the gauge entirely rather than fall back to an unweighted score. */
export function computeMatchGauge(compatibility: Compatibility, type: RelationshipType): MatchGauge | null {
  const weights = MATCH_GAUGE_WEIGHTS[type];
  if (!weights) return null;

  const weighted = compatibility.axes.reduce((sum, axis) => sum + (weights[axis.id] ?? 0) * axis.similarity, 0);
  const value = Math.max(1, Math.min(10, Math.round(1 + (weighted / 100) * 9)));

  return { value, band: bandForValue(value), label: BAND_LABELS[bandForValue(value)] };
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
