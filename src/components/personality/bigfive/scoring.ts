import type { AnswerValue, BigFiveResult, QuestionMeta } from "@/lib/personality/types";
import { BIG_FIVE_QUESTIONS, type BigFiveTrait } from "./questions";

const TRAITS: BigFiveTrait[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

export function scoreBigFive(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
): BigFiveResult {
  const scores = {} as BigFiveResult["scores"];
  const skippedQuestionIds: string[] = [];

  for (const trait of TRAITS) {
    const questions = BIG_FIVE_QUESTIONS.filter((q) => q.trait === trait);
    let total = 0;
    for (const q of questions) {
      if (meta[q.id]?.skipped) skippedQuestionIds.push(q.id);
      // A skipped or unanswered (e.g. extended-tier, never reached) question defaults to the
      // scale midpoint (3) so it doesn't pull the trait average toward either extreme.
      const raw = typeof answers[q.id] === "number" ? (answers[q.id] as number) : 3;
      total += q.reverse ? 6 - raw : raw;
    }
    const avg = total / questions.length;
    scores[trait] = Math.round(((avg - 1) / 4) * 100);
  }

  return {
    scores,
    completedAt: new Date().toISOString(),
    skippedQuestionIds: skippedQuestionIds.length ? skippedQuestionIds : undefined,
  };
}

export function isBigFiveComplete(answers: Record<string, AnswerValue>) {
  return BIG_FIVE_QUESTIONS.every((q) => typeof answers[q.id] === "number");
}

export function isBigFiveCoreComplete(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
) {
  return BIG_FIVE_QUESTIONS.filter((q) => q.tier === "core").every(
    (q) => typeof answers[q.id] === "number" || meta[q.id]?.skipped
  );
}
