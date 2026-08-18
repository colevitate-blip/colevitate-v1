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
