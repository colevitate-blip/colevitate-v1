import type { AnswerValue, ColorId, ColorResult, QuestionMeta } from "@/lib/personality/types";
import { COLOR_QUESTIONS } from "./questions";

const COLOR_ORDER: ColorId[] = ["red", "blue", "green", "yellow"];
// Ranking questions award points by position (most-like-you first) instead of a flat +1,
// so they carry more signal per question than a single pick.
const RANK_WEIGHTS = [3, 2, 1, 0];

export function scoreColors(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
): ColorResult {
  const scores: Record<ColorId, number> = { red: 0, blue: 0, green: 0, yellow: 0 };
  const skippedQuestionIds: string[] = [];

  for (const question of COLOR_QUESTIONS) {
    if (meta[question.id]?.skipped) {
      skippedQuestionIds.push(question.id);
      continue;
    }
    const chosen = answers[question.id];
    if (question.format === "ranking" && Array.isArray(chosen)) {
      chosen.forEach((id, index) => {
        if (id in scores) scores[id as ColorId] += RANK_WEIGHTS[index] ?? 0;
      });
    } else if (typeof chosen === "string" && chosen in scores) {
      scores[chosen as ColorId] += 1;
    }
  }

  const ranked = [...COLOR_ORDER].sort((a, b) => scores[b] - scores[a]);

  return {
    scores,
    dominant: ranked[0],
    secondary: ranked[1],
    completedAt: new Date().toISOString(),
    skippedQuestionIds: skippedQuestionIds.length ? skippedQuestionIds : undefined,
  };
}

export function isColorsComplete(answers: Record<string, AnswerValue>) {
  return COLOR_QUESTIONS.every((q) => typeof answers[q.id] === "string" || Array.isArray(answers[q.id]));
}

export function isColorsCoreComplete(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
) {
  return COLOR_QUESTIONS.filter((q) => q.tier === "core").every(
    (q) => typeof answers[q.id] === "string" || Array.isArray(answers[q.id]) || meta[q.id]?.skipped
  );
}
