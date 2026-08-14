import type {
  ColorId,
  HumanDesignType,
  PersonalityResults,
} from "@/lib/personality/types";

// A weighted lookup matrix that combines values across all four frameworks
// into a small set of continuous, psychologically meaningful axes. Each
// framework contributes a signal (-100..100) per axis; axes are combined
// as a weighted average using only the frameworks the user actually
// completed, with weights renormalized so partial completion still
// produces a valid composite.

export type AxisId = "energy" | "structure" | "people" | "novelty";

export interface AxisDefinition {
  id: AxisId;
  label: string;
  leftPole: string;
  rightPole: string;
  weights: { mbti: number; bigfive: number; humandesign: number; colors: number };
}

export const AXES: AxisDefinition[] = [
  {
    id: "energy",
    label: "Energy Direction",
    leftPole: "Inward",
    rightPole: "Outward",
    weights: { mbti: 0.35, bigfive: 0.35, humandesign: 0.1, colors: 0.2 },
  },
  {
    id: "structure",
    label: "Structure & Pace",
    leftPole: "Emergent",
    rightPole: "Planned",
    weights: { mbti: 0.35, bigfive: 0.3, humandesign: 0.15, colors: 0.2 },
  },
  {
    id: "people",
    label: "People Orientation",
    leftPole: "Task-focused",
    rightPole: "People-focused",
    weights: { mbti: 0.35, bigfive: 0.3, humandesign: 0.1, colors: 0.25 },
  },
  {
    id: "novelty",
    label: "Openness to Novelty",
    leftPole: "Grounded",
    rightPole: "Exploratory",
    weights: { mbti: 0.3, bigfive: 0.35, humandesign: 0.15, colors: 0.2 },
  },
];

function mbtiSignal(axis: AxisId, result: NonNullable<PersonalityResults["mbti"]>): number {
  const { scores } = result;
  switch (axis) {
    case "energy":
      return (scores.EI.pole === "E" ? 1 : -1) * scores.EI.confidence;
    case "structure":
      return (scores.JP.pole === "J" ? 1 : -1) * scores.JP.confidence;
    case "people":
      return (scores.TF.pole === "F" ? 1 : -1) * scores.TF.confidence;
    case "novelty":
      return (scores.SN.pole === "N" ? 1 : -1) * scores.SN.confidence;
  }
}

function bigFiveSignal(axis: AxisId, result: NonNullable<PersonalityResults["bigfive"]>): number {
  const { scores } = result;
  switch (axis) {
    case "energy":
      return (scores.extraversion - 50) * 2;
    case "structure":
      return (scores.conscientiousness - 50) * 2;
    case "people":
      return (scores.agreeableness - 50) * 2;
    case "novelty":
      return (scores.openness - 50) * 2;
  }
}

const HD_AXIS_SIGNAL: Record<HumanDesignType, Record<AxisId, number>> = {
  generator: { energy: 0, structure: 30, people: 0, novelty: -20 },
  "manifesting-generator": { energy: 20, structure: -20, people: 0, novelty: 50 },
  manifestor: { energy: 40, structure: -50, people: -10, novelty: 30 },
  projector: { energy: -30, structure: 40, people: 20, novelty: 0 },
  reflector: { energy: -20, structure: 60, people: 30, novelty: 10 },
};

function humanDesignSignal(
  axis: AxisId,
  result: NonNullable<PersonalityResults["humandesign"]>
): number {
  return HD_AXIS_SIGNAL[result.type][axis];
}

const COLOR_AXIS_SIGNAL: Record<ColorId, Record<AxisId, number>> = {
  red: { energy: 70, structure: -30, people: -40, novelty: 10 },
  blue: { energy: -60, structure: 60, people: -30, novelty: -40 },
  green: { energy: -40, structure: 40, people: 60, novelty: -20 },
  yellow: { energy: 70, structure: -60, people: 40, novelty: 70 },
};

function colorSignal(axis: AxisId, result: NonNullable<PersonalityResults["colors"]>): number {
  const primary = COLOR_AXIS_SIGNAL[result.dominant][axis];
  const secondary = COLOR_AXIS_SIGNAL[result.secondary][axis];
  return primary * 0.75 + secondary * 0.25;
}

export interface AxisScore {
  id: AxisId;
  label: string;
  leftPole: string;
  rightPole: string;
  score: number; // -100 (leftPole) .. 100 (rightPole)
  tierLabel: string;
  sentence: string;
}

function computeAxisScore(axis: AxisDefinition, results: PersonalityResults): number | null {
  let weightedSum = 0;
  let weightTotal = 0;

  if (results.mbti) {
    weightedSum += axis.weights.mbti * mbtiSignal(axis.id, results.mbti);
    weightTotal += axis.weights.mbti;
  }
  if (results.bigfive) {
    weightedSum += axis.weights.bigfive * bigFiveSignal(axis.id, results.bigfive);
    weightTotal += axis.weights.bigfive;
  }
  if (results.humandesign) {
    weightedSum += axis.weights.humandesign * humanDesignSignal(axis.id, results.humandesign);
    weightTotal += axis.weights.humandesign;
  }
  if (results.colors) {
    weightedSum += axis.weights.colors * colorSignal(axis.id, results.colors);
    weightTotal += axis.weights.colors;
  }

  if (weightTotal === 0) return null;
  return Math.round(weightedSum / weightTotal);
}

interface Tier {
  max: number; // upper bound of this tier (inclusive), Infinity for the last
  tierLabel: string;
  sentence: (axis: AxisDefinition) => string;
}

const TIERS: Record<AxisId, Tier[]> = {
  energy: [
    {
      max: -60,
      tierLabel: "Strongly inward",
      sentence: () =>
        "Across your results, energy consistently runs inward — you do your best thinking alone or in very small groups, and recover by stepping out of the noise, not into it.",
    },
    {
      max: -25,
      tierLabel: "Leans inward",
      sentence: () =>
        "Your energy leans inward more often than not — you can perform outwardly when needed, but quiet, low-stimulation time is where you actually recharge.",
    },
    {
      max: 25,
      tierLabel: "Situational",
      sentence: () =>
        "Your energy reads as genuinely situational — outward and engaged in the right context, inward and conserving in others, rather than fixed either way.",
    },
    {
      max: 60,
      tierLabel: "Leans outward",
      sentence: () =>
        "Your energy leans outward more often than not — people and momentum tend to add to your tank rather than drain it.",
    },
    {
      max: Infinity,
      tierLabel: "Strongly outward",
      sentence: () =>
        "Across your results, energy consistently runs outward — you're genuinely recharged by people and momentum, not just tolerant of them.",
    },
  ],
  structure: [
    {
      max: -60,
      tierLabel: "Strongly emergent",
      sentence: () =>
        "You operate almost entirely in the moment — plans are loose scaffolding at best, and you do your best work responding to what's actually in front of you.",
    },
    {
      max: -25,
      tierLabel: "Leans emergent",
      sentence: () =>
        "You lean toward staying flexible and responsive, following the moment more often than a plan drawn up in advance.",
    },
    {
      max: 25,
      tierLabel: "Balanced",
      sentence: () =>
        "You move between planning ahead and staying open to the moment, picking whichever the situation actually calls for.",
    },
    {
      max: 60,
      tierLabel: "Leans planned",
      sentence: () =>
        "You lean toward planning things out — you're capable of improvising, but you do your best work with some structure already in place.",
    },
    {
      max: Infinity,
      tierLabel: "Strongly planned",
      sentence: () =>
        "Structure is a consistent thread across your results — you plan ahead, follow through, and feel most capable when the shape of things is already clear.",
    },
  ],
  people: [
    {
      max: -60,
      tierLabel: "Strongly task-focused",
      sentence: () =>
        "Across your results, you consistently prioritize the work itself over managing how people feel about it — clarity and results come first.",
    },
    {
      max: -25,
      tierLabel: "Leans task-focused",
      sentence: () =>
        "You lean toward prioritizing the task at hand, though you're not indifferent to the people involved — just not led by it.",
    },
    {
      max: 25,
      tierLabel: "Balanced",
      sentence: () =>
        "You balance people and task fairly evenly — neither consistently overrides the other in how you operate.",
    },
    {
      max: 60,
      tierLabel: "Leans people-focused",
      sentence: () =>
        "You lean toward prioritizing the people in the room — decisions tend to get filtered through how they'll land on others.",
    },
    {
      max: Infinity,
      tierLabel: "Strongly people-focused",
      sentence: () =>
        "Across your results, people consistently come first — you read the room, protect relationships, and let that shape almost every call you make.",
    },
  ],
  novelty: [
    {
      max: -60,
      tierLabel: "Strongly grounded",
      sentence: () =>
        "You consistently favor the proven and concrete over the untested — new ideas earn trust by demonstrating they work, not by being new.",
    },
    {
      max: -25,
      tierLabel: "Leans grounded",
      sentence: () =>
        "You lean toward the practical and familiar, though you're not closed to new ideas once they've shown some substance.",
    },
    {
      max: 25,
      tierLabel: "Balanced",
      sentence: () =>
        "You move between the familiar and the experimental depending on the stakes, rather than defaulting to either.",
    },
    {
      max: 60,
      tierLabel: "Leans exploratory",
      sentence: () =>
        "You lean toward the new and untested — novelty tends to pull your attention more than routine does.",
    },
    {
      max: Infinity,
      tierLabel: "Strongly exploratory",
      sentence: () =>
        "Across your results, you're consistently drawn to the unfamiliar — new ideas, new angles, and new possibilities are where your energy naturally goes.",
    },
  ],
};

function tierFor(axis: AxisDefinition, score: number): Tier {
  const tiers = TIERS[axis.id];
  return tiers.find((t) => score <= t.max) ?? tiers[tiers.length - 1];
}

// Computes the full axis matrix for whichever frameworks are completed.
// Returns only axes that had at least one contributing framework (always
// all four in practice, since the combined profile requires 2+ completed
// assessments and every framework contributes to every axis).
export function computeScoringMatrix(results: PersonalityResults): AxisScore[] {
  const out: AxisScore[] = [];
  for (const axis of AXES) {
    const score = computeAxisScore(axis, results);
    if (score === null) continue;
    const tier = tierFor(axis, score);
    out.push({
      id: axis.id,
      label: axis.label,
      leftPole: axis.leftPole,
      rightPole: axis.rightPole,
      score,
      tierLabel: tier.tierLabel,
      sentence: tier.sentence(axis),
    });
  }
  return out;
}
