export type AssessmentId = "mbti" | "bigfive" | "humandesign" | "colors";

export type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type Dichotomy = "EI" | "SN" | "TF" | "JP";

export interface MbtiResult {
  type: string;
  scores: Record<Dichotomy, { pole: MbtiLetter; confidence: number }>;
  completedAt: string;
}

export interface BigFiveResult {
  scores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  completedAt: string;
}

export type HumanDesignType =
  | "generator"
  | "manifesting-generator"
  | "manifestor"
  | "projector"
  | "reflector";

export interface HumanDesignResult {
  type: HumanDesignType;
  scores: Record<HumanDesignType, number>;
  completedAt: string;
}

export type ColorId = "red" | "blue" | "green" | "yellow";

export interface ColorResult {
  scores: Record<ColorId, number>;
  dominant: ColorId;
  secondary: ColorId;
  completedAt: string;
}

export interface PersonalityResults {
  mbti?: MbtiResult;
  bigfive?: BigFiveResult;
  humandesign?: HumanDesignResult;
  colors?: ColorResult;
}

export interface SurveyProgress {
  step: number;
  answers: Record<string, number | string>;
}

export type ProgressMap = Partial<Record<AssessmentId, SurveyProgress>>;

export const ASSESSMENT_META: Record<
  AssessmentId,
  { label: string; shortLabel: string; slug: string }
> = {
  mbti: { label: "16 Personalities", shortLabel: "MBTI", slug: "mbti" },
  bigfive: { label: "Big Five (OCEAN)", shortLabel: "Big Five", slug: "big-five" },
  humandesign: { label: "Human Design", shortLabel: "Human Design", slug: "human-design" },
  colors: { label: "4 Color Types", shortLabel: "Color Type", slug: "colors" },
};

/** The four continuous axes the combined profile scores across. */
export type AxisId = "energy" | "structure" | "people" | "novelty";

/** One axis's score at the moment a combined profile was completed. */
export interface AxisSnapshotValue {
  id: AxisId;
  score: number;
}

/** A timestamped combined-profile result, appended (never overwritten) so trends over retakes are visible. */
export interface CombinedSnapshot {
  completedAt: string;
  axes: AxisSnapshotValue[];
  archetypeName?: string;
}
