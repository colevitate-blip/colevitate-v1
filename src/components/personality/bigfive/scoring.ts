import type { BigFiveResult } from "@/lib/personality/types";
import { BIG_FIVE_QUESTIONS, type BigFiveTrait } from "./questions";

const TRAITS: BigFiveTrait[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

export function scoreBigFive(answers: Record<string, number | string>): BigFiveResult {
  const scores = {} as BigFiveResult["scores"];

  for (const trait of TRAITS) {
    const questions = BIG_FIVE_QUESTIONS.filter((q) => q.trait === trait);
    let total = 0;
    for (const q of questions) {
      const raw = typeof answers[q.id] === "number" ? (answers[q.id] as number) : 3;
      total += q.reverse ? 6 - raw : raw;
    }
    const avg = total / questions.length;
    scores[trait] = Math.round(((avg - 1) / 4) * 100);
  }

  return { scores, completedAt: new Date().toISOString() };
}

export function isBigFiveComplete(answers: Record<string, number | string>) {
  return BIG_FIVE_QUESTIONS.every((q) => typeof answers[q.id] === "number");
}
