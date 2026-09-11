import type {
  AssessmentId,
  AxisId,
  ColorId,
  Dichotomy,
  HumanDesignType,
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

/** Minimal shape of a next-intl translator — satisfied by both useTranslations() and the resolved value of getTranslations(). */
export type Translator = (key: string, values?: Record<string, string | number>) => string;

export interface AxisDefinition {
  id: AxisId;
  /** Static English fallback — untranslated consumers (team insights, discovery snapshot hydration) still read these directly. AxisScore.label/leftPole/rightPole (below) carry the translated versions instead; prefer those wherever a translator is available. */
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

function signalPhrase(signal: number, axis: AxisDefinition, t: Translator): string {
  const rounded = Math.round(Math.abs(signal));
  const pole = t(`scoring.axes.${axis.id}.${signal >= 0 ? "rightPole" : "leftPole"}`);
  return t("scoring.signalPhrase", { amount: rounded, pole });
}

const AXIS_DICHOTOMY: Record<AxisId, Dichotomy> = {
  energy: "EI",
  structure: "JP",
  people: "TF",
  novelty: "SN",
};

function explainMbti(axis: AxisDefinition, result: NonNullable<PersonalityResults["mbti"]>, t: Translator): string {
  const dichotomy = AXIS_DICHOTOMY[axis.id];
  const { pole, confidence } = result.scores[dichotomy];
  const signal = mbtiSignal(axis.id, result);
  return t("scoring.explain.mbti", {
    dichotomy: t(`scoring.labels.dichotomies.${dichotomy}`),
    pole: t(`scoring.labels.mbtiPoles.${pole}`),
    confidence,
    signal: signalPhrase(signal, axis, t),
  });
}

const AXIS_BIG_FIVE_TRAIT: Record<AxisId, { key: keyof NonNullable<PersonalityResults["bigfive"]>["scores"] }> = {
  energy: { key: "extraversion" },
  structure: { key: "conscientiousness" },
  people: { key: "agreeableness" },
  novelty: { key: "openness" },
};

function explainBigFive(axis: AxisDefinition, result: NonNullable<PersonalityResults["bigfive"]>, t: Translator): string {
  const trait = AXIS_BIG_FIVE_TRAIT[axis.id];
  const score = result.scores[trait.key];
  const signal = bigFiveSignal(axis.id, result);
  return t("scoring.explain.bigfive", {
    trait: t(`scoring.labels.bigFiveTraits.${trait.key}`),
    score: Math.round(score),
    signal: signalPhrase(signal, axis, t),
  });
}

function explainHumanDesign(
  axis: AxisDefinition,
  result: NonNullable<PersonalityResults["humandesign"]>,
  t: Translator
): string {
  const signal = humanDesignSignal(axis.id, result);
  return t("scoring.explain.humandesign", {
    hdType: t(`scoring.labels.hdTypes.${result.type}`),
    signal: signalPhrase(signal, axis, t),
  });
}

function explainColors(axis: AxisDefinition, result: NonNullable<PersonalityResults["colors"]>, t: Translator): string {
  const signal = colorSignal(axis.id, result);
  return t("scoring.explain.colors", {
    dominant: t(`scoring.labels.colors.${result.dominant}`),
    secondary: t(`scoring.labels.colors.${result.secondary}`),
    signal: signalPhrase(signal, axis, t),
  });
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
  tierIndex: number; // stable 0-4 key — use this to look up tier content, never tierLabel
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
function computeAxisContributions(axis: AxisDefinition, results: PersonalityResults, t: Translator): AxisContribution[] {
  const contributions: AxisContribution[] = [];
  if (results.mbti) {
    contributions.push({
      framework: "mbti",
      signal: mbtiSignal(axis.id, results.mbti),
      detail: explainMbti(axis, results.mbti, t),
    });
  }
  if (results.bigfive) {
    contributions.push({
      framework: "bigfive",
      signal: bigFiveSignal(axis.id, results.bigfive),
      detail: explainBigFive(axis, results.bigfive, t),
    });
  }
  if (results.humandesign) {
    contributions.push({
      framework: "humandesign",
      signal: humanDesignSignal(axis.id, results.humandesign),
      detail: explainHumanDesign(axis, results.humandesign, t),
    });
  }
  if (results.colors) {
    contributions.push({
      framework: "colors",
      signal: colorSignal(axis.id, results.colors),
      detail: explainColors(axis, results.colors, t),
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
// Exported so documentation (the Methodology page) can quote the exact
// cutoffs instead of a hand-typed, driftable copy of them.
export const AGREEMENT_SPREAD_THRESHOLDS = { agree: 40, mixed: 90 };

function computeAgreement(contributions: AxisContribution[], t: Translator): { agreement: AxisAgreement; agreementLabel: string } {
  if (contributions.length < 2) {
    return { agreement: "agree", agreementLabel: t("scoring.agreement.onlyOne") };
  }
  const signals = contributions.map((c) => c.signal);
  const spread = Math.max(...signals) - Math.min(...signals);
  if (spread < AGREEMENT_SPREAD_THRESHOLDS.agree) {
    return { agreement: "agree", agreementLabel: t("scoring.agreement.agree") };
  }
  if (spread < AGREEMENT_SPREAD_THRESHOLDS.mixed) {
    return { agreement: "mixed", agreementLabel: t("scoring.agreement.mixed") };
  }
  return { agreement: "disagree", agreementLabel: t("scoring.agreement.disagree") };
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

// Upper bound (inclusive) of each of the 4 axes' 5 tiers, Infinity for the
// last — index into this array is the stable key for scoring.tiers.<axisId>
// content (tierLabel/sentence/sentenceThird), since the label text itself
// can no longer be used as a lookup key once it's translated.
const TIER_MAX: Record<AxisId, number[]> = {
  energy: [-60, -25, 25, 60, Infinity],
  structure: [-60, -25, 25, 60, Infinity],
  people: [-60, -25, 25, 60, Infinity],
  novelty: [-60, -25, 25, 60, Infinity],
};

function tierIndexFor(axisId: AxisId, score: number): number {
  const maxes = TIER_MAX[axisId];
  const index = maxes.findIndex((max) => score <= max);
  return index === -1 ? maxes.length - 1 : index;
}

/**
 * The tier sentence for one axis, addressed to whichever `subject` the
 * caller needs — "you" just returns the axis's own canonical sentence
 * (already computed by computeScoringMatrix), while "he"/"she" looks up the
 * matching tier's third-person copy by its stable index. Only the
 * personality graph calls this with a non-"you" subject (see
 * PersonalityGraphCard); every other consumer of AxisScore.sentence is
 * unaffected.
 */
export function axisSentenceFor(axisId: AxisId, tierIndex: number, subject: Subject, selfSentence: string, t: Translator): string {
  if (subject === "you") return selfSentence;
  return t(`scoring.tiers.${axisId}.${tierIndex}.sentenceThird.${subject}`);
}

// Computes the full axis matrix for whichever frameworks are completed.
// Returns only axes that had at least one contributing framework (always
// all four in practice, since the combined profile requires 2+ completed
// assessments and every framework contributes to every axis).
export function computeScoringMatrix(results: PersonalityResults, t: Translator): AxisScore[] {
  const out: AxisScore[] = [];
  for (const axis of AXES) {
    const score = computeAxisScore(axis, results);
    if (score === null) continue;
    const tierIndex = tierIndexFor(axis.id, score);
    const contributions = computeAxisContributions(axis, results, t);
    const { agreement, agreementLabel } = computeAgreement(contributions, t);
    out.push({
      id: axis.id,
      label: t(`scoring.axes.${axis.id}.label`),
      leftPole: t(`scoring.axes.${axis.id}.leftPole`),
      rightPole: t(`scoring.axes.${axis.id}.rightPole`),
      score,
      tierIndex,
      tierLabel: t(`scoring.tiers.${axis.id}.${tierIndex}.tierLabel`),
      sentence: t(`scoring.tiers.${axis.id}.${tierIndex}.sentence`),
      contributions,
      agreement,
      agreementLabel,
    });
  }
  return out;
}
