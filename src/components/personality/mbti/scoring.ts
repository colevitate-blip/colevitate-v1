import type { AnswerValue, Dichotomy, MbtiResult, QuestionMeta } from "@/lib/personality/types";
import { MBTI_QUESTIONS } from "./questions";

const DICHOTOMIES: Dichotomy[] = ["EI", "SN", "TF", "JP"];

export function scoreMbti(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
): MbtiResult {
  const scores = {} as MbtiResult["scores"];
  let typeCode = "";
  const skippedQuestionIds: string[] = [];

  for (const dichotomy of DICHOTOMIES) {
    const questions = MBTI_QUESTIONS.filter((q) => q.dichotomy === dichotomy);
    let sum = 0;
    for (const q of questions) {
      const raw = answers[q.id];
      // A skipped question (or one never reached, e.g. the user finished from the core set only)
      // contributes a neutral midpoint rather than nudging the score toward either pole.
      if (meta[q.id]?.skipped || typeof raw !== "number") {
        if (meta[q.id]?.skipped) skippedQuestionIds.push(q.id);
        continue;
      }
      sum += raw - 3;
    }
    const maxSum = questions.length * 2;
    const pole = sum <= 0 ? questions[0].poleA : questions[0].poleB;
    const confidence = Math.round(50 + (Math.abs(sum) / maxSum) * 50);
    scores[dichotomy] = { pole, confidence };
    typeCode += pole;
  }

  return {
    type: typeCode,
    scores,
    completedAt: new Date().toISOString(),
    skippedQuestionIds: skippedQuestionIds.length ? skippedQuestionIds : undefined,
  };
}

export function isMbtiComplete(answers: Record<string, AnswerValue>) {
  return MBTI_QUESTIONS.every((q) => typeof answers[q.id] === "number");
}

export function isMbtiCoreComplete(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
) {
  return MBTI_QUESTIONS.filter((q) => q.tier === "core").every(
    (q) => typeof answers[q.id] === "number" || meta[q.id]?.skipped
  );
}
