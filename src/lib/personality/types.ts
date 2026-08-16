export type AssessmentId = "mbti" | "bigfive" | "humandesign" | "colors";

export type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type Dichotomy = "EI" | "SN" | "TF" | "JP";

export interface MbtiResult {
  type: string;
  scores: Record<Dichotomy, { pole: MbtiLetter; confidence: number }>;
  completedAt: string;
  /** Question ids the user skipped; those dimensions were scored with a neutral default. */
  skippedQuestionIds?: string[];
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
  skippedQuestionIds?: string[];
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
  skippedQuestionIds?: string[];
}

export type ColorId = "red" | "blue" | "green" | "yellow";

export interface ColorResult {
  scores: Record<ColorId, number>;
  dominant: ColorId;
  secondary: ColorId;
  completedAt: string;
  skippedQuestionIds?: string[];
}

export interface PersonalityResults {
  mbti?: MbtiResult;
  bigfive?: BigFiveResult;
  humandesign?: HumanDesignResult;
  colors?: ColorResult;
}

/** A question's answer: a scale/choice value, or an ordered list of option ids for ranking questions. */
export type AnswerValue = number | string | string[];

/** Per-question metadata that isn't the answer value itself. */
export interface QuestionMeta {
  skipped?: boolean;
}

export interface SurveyProgress {
  step: number;
  answers: Record<string, AnswerValue>;
  meta?: Record<string, QuestionMeta>;
}

export type ProgressMap = Partial<Record<AssessmentId, SurveyProgress>>;

/** A private, local-only note captured from the optional "was that hard to answer?" prompt. */
export interface FeedbackNote {
  assessmentId: AssessmentId;
  questionId: string;
  note: string;
  createdAt: string;
}

export type GuidanceSeenMap = Partial<Record<AssessmentId, boolean>>;

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

export const ASSESSMENT_META: Record<
  AssessmentId,
  { label: string; shortLabel: string; slug: string }
> = {
  mbti: { label: "16 Personalities", shortLabel: "MBTI", slug: "mbti" },
  bigfive: { label: "Big Five (OCEAN)", shortLabel: "Big Five", slug: "big-five" },
  humandesign: { label: "Human Design", shortLabel: "Human Design", slug: "human-design" },
  colors: { label: "4 Color Types", shortLabel: "Color Type", slug: "colors" },
};
