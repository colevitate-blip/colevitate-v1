import type { ColorId, ColorResult } from "@/lib/personality/types";
import { COLOR_QUESTIONS } from "./questions";

const COLOR_ORDER: ColorId[] = ["red", "blue", "green", "yellow"];

export function scoreColors(answers: Record<string, number | string>): ColorResult {
  const scores: Record<ColorId, number> = { red: 0, blue: 0, green: 0, yellow: 0 };

  for (const question of COLOR_QUESTIONS) {
    const chosen = answers[question.id];
    if (typeof chosen === "string" && chosen in scores) {
      scores[chosen as ColorId] += 1;
    }
  }

  const ranked = [...COLOR_ORDER].sort((a, b) => scores[b] - scores[a]);

  return {
    scores,
    dominant: ranked[0],
    secondary: ranked[1],
    completedAt: new Date().toISOString(),
  };
}

export function isColorsComplete(answers: Record<string, number | string>) {
  return COLOR_QUESTIONS.every((q) => typeof answers[q.id] === "string");
}
