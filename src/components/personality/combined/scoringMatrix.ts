import type {
  AssessmentId,
  AxisId,
  ColorId,
  Dichotomy,
  HumanDesignType,
  MbtiLetter,
  PersonalityResults,
} from "@/lib/personality/types";

// A weighted lookup matrix that combines values across all four frameworks
// into a small set of continuous, psychologically meaningful axes. Each
// framework contributes a signal (-100..100) per axis; axes are combined
// as a weighted average using only the frameworks the user actually
// completed, with weights renormalized so partial completion still
// produces a valid composite.

// AxisId lives in lib/personality/types.ts (storage.ts needs it too, and
// lib/ shouldn't import from components/) — re-exported here so existing
// imports from this module keep working unchanged.
export type { AxisId };

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
    label: "Inward / Outward Focus",
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

// "Why this score" copy — one sentence per framework explaining which of
// its own computed trait/pole/type values produced its signal for this
// axis. Raw per-question answers aren't available here (progress is
// discarded once an assessment completes), so these trace back to the
// same computed units the signal functions above consume.

function signalPhrase(signal: number, axis: AxisDefinition): string {
  const rounded = Math.round(Math.abs(signal));
  return `${rounded} toward ${signal >= 0 ? axis.rightPole : axis.leftPole}`;
}

const DICHOTOMY_NAMES: Record<Dichotomy, string> = {
  EI: "Extraversion/Introversion",
  SN: "Sensing/Intuition",
  TF: "Thinking/Feeling",
  JP: "Judging/Perceiving",
};

const POLE_NAMES: Record<MbtiLetter, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
};

const AXIS_DICHOTOMY: Record<AxisId, Dichotomy> = {
  energy: "EI",
  structure: "JP",
  people: "TF",
  novelty: "SN",
};

function explainMbti(axis: AxisDefinition, result: NonNullable<PersonalityResults["mbti"]>): string {
  const dichotomy = AXIS_DICHOTOMY[axis.id];
  const { pole, confidence } = result.scores[dichotomy];
  const signal = mbtiSignal(axis.id, result);
  return `Your ${DICHOTOMY_NAMES[dichotomy]} score leans ${POLE_NAMES[pole]} (${confidence}% confidence) — that's ${signalPhrase(signal, axis)}.`;
}

const AXIS_BIG_FIVE_TRAIT: Record<AxisId, { key: keyof NonNullable<PersonalityResults["bigfive"]>["scores"]; label: string }> = {
  energy: { key: "extraversion", label: "Extraversion" },
  structure: { key: "conscientiousness", label: "Conscientiousness" },
  people: { key: "agreeableness", label: "Agreeableness" },
  novelty: { key: "openness", label: "Openness" },
};

function explainBigFive(axis: AxisDefinition, result: NonNullable<PersonalityResults["bigfive"]>): string {
  const trait = AXIS_BIG_FIVE_TRAIT[axis.id];
  const score = result.scores[trait.key];
  const signal = bigFiveSignal(axis.id, result);
  return `Your ${trait.label} score is ${Math.round(score)}/100 — that's ${signalPhrase(signal, axis)}.`;
}

const HD_TYPE_NAMES: Record<HumanDesignType, string> = {
  generator: "Generator",
  "manifesting-generator": "Manifesting Generator",
  manifestor: "Manifestor",
  projector: "Projector",
  reflector: "Reflector",
};

function explainHumanDesign(
  axis: AxisDefinition,
  result: NonNullable<PersonalityResults["humandesign"]>
): string {
  const signal = humanDesignSignal(axis.id, result);
  return `As a ${HD_TYPE_NAMES[result.type]}, Human Design's energy-type mapping contributes ${signalPhrase(signal, axis)} — that comes from the type itself, not a specific trait score.`;
}

const COLOR_NAMES: Record<ColorId, string> = {
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
};

function explainColors(axis: AxisDefinition, result: NonNullable<PersonalityResults["colors"]>): string {
  const signal = colorSignal(axis.id, result);
  return `Your dominant color is ${COLOR_NAMES[result.dominant]} (75% weight) and secondary is ${COLOR_NAMES[result.secondary]} (25% weight) — blended, that's ${signalPhrase(signal, axis)}.`;
}

export interface AxisContribution {
  framework: AssessmentId;
  signal: number; // that framework's individual, unweighted read of this axis, -100..100
  detail: string; // one-sentence "why" trace back to that framework's own computed trait/pole/type
}

export type AxisAgreement = "agree" | "mixed" | "disagree";

export interface AxisScore {
  id: AxisId;
  label: string;
  leftPole: string;
  rightPole: string;
  score: number; // -100 (leftPole) .. 100 (rightPole)
  tierLabel: string;
  sentence: string;
  contributions: AxisContribution[];
  agreement: AxisAgreement;
  agreementLabel: string;
}

// Each framework's raw, unweighted signal for this axis (before the
// weighted-average blend) — the same inputs computeAxisScore combines,
// surfaced individually so the UI can show where frameworks agree or
// disagree with each other.
function computeAxisContributions(axis: AxisDefinition, results: PersonalityResults): AxisContribution[] {
  const contributions: AxisContribution[] = [];
  if (results.mbti) {
    contributions.push({
      framework: "mbti",
      signal: mbtiSignal(axis.id, results.mbti),
      detail: explainMbti(axis, results.mbti),
    });
  }
  if (results.bigfive) {
    contributions.push({
      framework: "bigfive",
      signal: bigFiveSignal(axis.id, results.bigfive),
      detail: explainBigFive(axis, results.bigfive),
    });
  }
  if (results.humandesign) {
    contributions.push({
      framework: "humandesign",
      signal: humanDesignSignal(axis.id, results.humandesign),
      detail: explainHumanDesign(axis, results.humandesign),
    });
  }
  if (results.colors) {
    contributions.push({
      framework: "colors",
      signal: colorSignal(axis.id, results.colors),
      detail: explainColors(axis, results.colors),
    });
  }
  return contributions;
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

// Spread of raw framework signals (max - min, out of a possible 200)
// determines whether the frameworks are reading this axis the same way.
function computeAgreement(contributions: AxisContribution[]): { agreement: AxisAgreement; agreementLabel: string } {
  if (contributions.length < 2) {
    return { agreement: "agree", agreementLabel: "Only one framework weighs in here." };
  }
  const signals = contributions.map((c) => c.signal);
  const spread = Math.max(...signals) - Math.min(...signals);
  if (spread < 40) {
    return { agreement: "agree", agreementLabel: "Your frameworks agree here." };
  }
  if (spread < 90) {
    return { agreement: "mixed", agreementLabel: "Your frameworks mostly agree, with some nuance." };
  }
  return { agreement: "disagree", agreementLabel: "Your frameworks disagree here." };
}

// Who a tier's sentence (and the other hand-written explanation copy in
// graphAppearance.ts) is written to: the profile owner reading their own
// results ("You lean toward...") vs. a visitor reading about a third party
// — a famous person's editorial profile — phrased as "He"/"She" per that
// person's documented gender. Every existing caller of this file omits the
// subject and gets "you" by default, so the self combined-profile page,
// PDF export, compatibility bars, and discovery all read exactly as before;
// only the personality graph threads a real subject through, for famous
// people (see PersonalityGraphCard's `subject` prop).
export type Subject = "you" | "he" | "she";

export interface PronounSet {
  subj: string; // he / she / you
  Subj: string; // He / She / You
  poss: string; // his / her / your
  Poss: string; // His / Her / Your
  obj: string; // him / her / you
  isAre: string; // is / is / are
  contractIs: string; // he's / she's / you're
  ContractIs: string; // He's / She's / You're
  Would: string; // He'd / She'd / You'd
}

const PRONOUNS: Record<Subject, PronounSet> = {
  you: { subj: "you", Subj: "You", poss: "your", Poss: "Your", obj: "you", isAre: "are", contractIs: "you're", ContractIs: "You're", Would: "You'd" },
  he: { subj: "he", Subj: "He", poss: "his", Poss: "His", obj: "him", isAre: "is", contractIs: "he's", ContractIs: "He's", Would: "He'd" },
  she: { subj: "she", Subj: "She", poss: "her", Poss: "Her", obj: "her", isAre: "is", contractIs: "she's", ContractIs: "She's", Would: "She'd" },
};

export function pronounsFor(subject: Subject): PronounSet {
  return PRONOUNS[subject];
}

interface Tier {
  max: number; // upper bound of this tier (inclusive), Infinity for the last
  tierLabel: string;
  /** Always the "you" copy — every existing caller of tier.sentence()/computeScoringMatrix keeps reading this, unchanged. */
  sentence: (axis: AxisDefinition) => string;
  /** Same sentence, addressed to a third party — only used by axisSentenceFor below, for the personality graph's famous-person view. */
  sentenceThird: (p: PronounSet) => string;
}

const TIERS: Record<AxisId, Tier[]> = {
  energy: [
    {
      max: -60,
      tierLabel: "Strongly inward",
      sentence: () =>
        "Across your results, energy consistently runs inward — you do your best thinking alone or in very small groups, and recover by stepping out of the noise, not into it.",
      sentenceThird: (p) =>
        `Across ${p.poss} results, energy consistently runs inward — ${p.subj} does ${p.poss} best thinking alone or in very small groups, and recovers by stepping out of the noise, not into it.`,
    },
    {
      max: -25,
      tierLabel: "Leans inward",
      sentence: () =>
        "Your energy leans inward more often than not — you can perform outwardly when needed, but quiet, low-stimulation time is where you actually recharge.",
      sentenceThird: (p) =>
        `${p.Poss} energy leans inward more often than not — ${p.subj} can perform outwardly when needed, but quiet, low-stimulation time is where ${p.subj} actually recharges.`,
    },
    {
      max: 25,
      tierLabel: "Situational",
      sentence: () =>
        "Your energy reads as genuinely situational — outward and engaged in the right context, inward and conserving in others, rather than fixed either way.",
      sentenceThird: (p) =>
        `${p.Poss} energy reads as genuinely situational — outward and engaged in the right context, inward and conserving in others, rather than fixed either way.`,
    },
    {
      max: 60,
      tierLabel: "Leans outward",
      sentence: () =>
        "Your energy leans outward more often than not — people and momentum tend to add to your tank rather than drain it.",
      sentenceThird: (p) =>
        `${p.Poss} energy leans outward more often than not — people and momentum tend to add to ${p.poss} tank rather than drain it.`,
    },
    {
      max: Infinity,
      tierLabel: "Strongly outward",
      sentence: () =>
        "Across your results, energy consistently runs outward — you're genuinely recharged by people and momentum, not just tolerant of them.",
      sentenceThird: (p) =>
        `Across ${p.poss} results, energy consistently runs outward — ${p.contractIs} genuinely recharged by people and momentum, not just tolerant of them.`,
    },
  ],
  structure: [
    {
      max: -60,
      tierLabel: "Strongly emergent",
      sentence: () =>
        "You operate almost entirely in the moment — plans are loose scaffolding at best, and you do your best work responding to what's actually in front of you.",
      sentenceThird: (p) =>
        `${p.Subj} operates almost entirely in the moment — plans are loose scaffolding at best, and ${p.subj} does ${p.poss} best work responding to what's actually in front of ${p.obj}.`,
    },
    {
      max: -25,
      tierLabel: "Leans emergent",
      sentence: () =>
        "You lean toward staying flexible and responsive, following the moment more often than a plan drawn up in advance.",
      sentenceThird: (p) =>
        `${p.Subj} leans toward staying flexible and responsive, following the moment more often than a plan drawn up in advance.`,
    },
    {
      max: 25,
      tierLabel: "Balanced",
      sentence: () =>
        "You move between planning ahead and staying open to the moment, picking whichever the situation actually calls for.",
      sentenceThird: (p) =>
        `${p.Subj} moves between planning ahead and staying open to the moment, picking whichever the situation actually calls for.`,
    },
    {
      max: 60,
      tierLabel: "Leans planned",
      sentence: () =>
        "You lean toward planning things out — you're capable of improvising, but you do your best work with some structure already in place.",
      sentenceThird: (p) =>
        `${p.Subj} leans toward planning things out — ${p.contractIs} capable of improvising, but ${p.subj} does ${p.poss} best work with some structure already in place.`,
    },
    {
      max: Infinity,
      tierLabel: "Strongly planned",
      sentence: () =>
        "Structure is a consistent thread across your results — you plan ahead, follow through, and feel most capable when the shape of things is already clear.",
      sentenceThird: (p) =>
        `Structure is a consistent thread across ${p.poss} results — ${p.subj} plans ahead, follows through, and feels most capable when the shape of things is already clear.`,
    },
  ],
  people: [
    {
      max: -60,
      tierLabel: "Strongly task-focused",
      sentence: () =>
        "Across your results, you consistently prioritize the work itself over managing how people feel about it — clarity and results come first.",
      sentenceThird: (p) =>
        `Across ${p.poss} results, ${p.subj} consistently prioritizes the work itself over managing how people feel about it — clarity and results come first.`,
    },
    {
      max: -25,
      tierLabel: "Leans task-focused",
      sentence: () =>
        "You lean toward prioritizing the task at hand, though you're not indifferent to the people involved — just not led by it.",
      sentenceThird: (p) =>
        `${p.Subj} leans toward prioritizing the task at hand, though ${p.contractIs} not indifferent to the people involved — just not led by it.`,
    },
    {
      max: 25,
      tierLabel: "Balanced",
      sentence: () =>
        "You balance people and task fairly evenly — neither consistently overrides the other in how you operate.",
      sentenceThird: (p) =>
        `${p.Subj} balances people and task fairly evenly — neither consistently overrides the other in how ${p.subj} operates.`,
    },
    {
      max: 60,
      tierLabel: "Leans people-focused",
      sentence: () =>
        "You lean toward prioritizing the people in the room — decisions tend to get filtered through how they'll land on others.",
      sentenceThird: (p) =>
        `${p.Subj} leans toward prioritizing the people in the room — decisions tend to get filtered through how they'll land on others.`,
    },
    {
      max: Infinity,
      tierLabel: "Strongly people-focused",
      sentence: () =>
        "Across your results, people consistently come first — you read the room, protect relationships, and let that shape almost every call you make.",
      sentenceThird: (p) =>
        `Across ${p.poss} results, people consistently come first — ${p.subj} reads the room, protects relationships, and lets that shape almost every call ${p.subj} makes.`,
    },
  ],
  novelty: [
    {
      max: -60,
      tierLabel: "Strongly grounded",
      sentence: () =>
        "You consistently favor the proven and concrete over the untested — new ideas earn trust by demonstrating they work, not by being new.",
      sentenceThird: (p) =>
        `${p.Subj} consistently favors the proven and concrete over the untested — new ideas earn trust by demonstrating they work, not by being new.`,
    },
    {
      max: -25,
      tierLabel: "Leans grounded",
      sentence: () =>
        "You lean toward the practical and familiar, though you're not closed to new ideas once they've shown some substance.",
      sentenceThird: (p) =>
        `${p.Subj} leans toward the practical and familiar, though ${p.contractIs} not closed to new ideas once they've shown some substance.`,
    },
    {
      max: 25,
      tierLabel: "Balanced",
      sentence: () =>
        "You move between the familiar and the experimental depending on the stakes, rather than defaulting to either.",
      sentenceThird: (p) =>
        `${p.Subj} moves between the familiar and the experimental depending on the stakes, rather than defaulting to either.`,
    },
    {
      max: 60,
      tierLabel: "Leans exploratory",
      sentence: () =>
        "You lean toward the new and untested — novelty tends to pull your attention more than routine does.",
      sentenceThird: (p) =>
        `${p.Subj} leans toward the new and untested — novelty tends to pull ${p.poss} attention more than routine does.`,
    },
    {
      max: Infinity,
      tierLabel: "Strongly exploratory",
      sentence: () =>
        "Across your results, you're consistently drawn to the unfamiliar — new ideas, new angles, and new possibilities are where your energy naturally goes.",
      sentenceThird: (p) =>
        `Across ${p.poss} results, ${p.contractIs} consistently drawn to the unfamiliar — new ideas, new angles, and new possibilities are where ${p.poss} energy naturally goes.`,
    },
  ],
};

/**
 * The tier sentence for one axis, addressed to whichever `subject` the
 * caller needs — "you" just returns the axis's own canonical sentence
 * (already computed by computeScoringMatrix), while "he"/"she" re-derives
 * the matching tier by its label and renders the third-person copy above.
 * Only the personality graph calls this with a non-"you" subject (see
 * PersonalityGraphCard); every other consumer of AxisScore.sentence is
 * unaffected.
 */
export function axisSentenceFor(axisId: AxisId, tierLabel: string, subject: Subject, selfSentence: string): string {
  if (subject === "you") return selfSentence;
  const tier = TIERS[axisId]?.find((t) => t.tierLabel === tierLabel);
  return tier ? tier.sentenceThird(pronounsFor(subject)) : selfSentence;
}

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
    const contributions = computeAxisContributions(axis, results);
    const { agreement, agreementLabel } = computeAgreement(contributions);
    out.push({
      id: axis.id,
      label: axis.label,
      leftPole: axis.leftPole,
      rightPole: axis.rightPole,
      score,
      tierLabel: tier.tierLabel,
      sentence: tier.sentence(axis),
      contributions,
      agreement,
      agreementLabel,
    });
  }
  return out;
}
