import type { AnswerValue, HumanDesignResult, HumanDesignType, QuestionMeta } from "@/lib/personality/types";
import { HD_QUESTIONS } from "./questions";

const TYPE_ORDER: HumanDesignType[] = [
  "generator",
  "manifesting-generator",
  "projector",
  "manifestor",
  "reflector",
];

export function scoreHumanDesign(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
): HumanDesignResult {
  const scores: Record<HumanDesignType, number> = {
    generator: 0,
    "manifesting-generator": 0,
    manifestor: 0,
    projector: 0,
    reflector: 0,
  };
  const skippedQuestionIds: string[] = [];

  for (const question of HD_QUESTIONS) {
    if (meta[question.id]?.skipped) {
      skippedQuestionIds.push(question.id);
      continue;
    }
    const chosenId = answers[question.id];
    const option = question.options.find((o) => o.id === chosenId);
    if (!option) continue;
    for (const [type, weight] of Object.entries(option.weights)) {
      scores[type as HumanDesignType] += weight ?? 0;
    }
  }

  let winner: HumanDesignType = TYPE_ORDER[0];
  let best = -1;
  for (const type of TYPE_ORDER) {
    if (scores[type] > best) {
      best = scores[type];
      winner = type;
    }
  }

  return {
    type: winner,
    scores,
    completedAt: new Date().toISOString(),
    skippedQuestionIds: skippedQuestionIds.length ? skippedQuestionIds : undefined,
  };
}

export function isHumanDesignComplete(answers: Record<string, AnswerValue>) {
  return HD_QUESTIONS.every((q) => typeof answers[q.id] === "string");
}

export function isHumanDesignCoreComplete(
  answers: Record<string, AnswerValue>,
  meta: Record<string, QuestionMeta> = {}
) {
  return HD_QUESTIONS.filter((q) => q.tier === "core").every(
    (q) => typeof answers[q.id] === "string" || meta[q.id]?.skipped
  );
}
