import type { Dichotomy, MbtiResult } from "@/lib/personality/types";
import { MBTI_QUESTIONS } from "./questions";

const DICHOTOMIES: Dichotomy[] = ["EI", "SN", "TF", "JP"];

export function scoreMbti(answers: Record<string, number | string>): MbtiResult {
  const scores = {} as MbtiResult["scores"];
  let typeCode = "";

  for (const dichotomy of DICHOTOMIES) {
    const questions = MBTI_QUESTIONS.filter((q) => q.dichotomy === dichotomy);
    let sum = 0;
    for (const q of questions) {
      const raw = answers[q.id];
      const value = typeof raw === "number" ? raw : 3;
      sum += value - 3;
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
  };
}

export function isMbtiComplete(answers: Record<string, number | string>) {
  return MBTI_QUESTIONS.every((q) => typeof answers[q.id] === "number");
}
