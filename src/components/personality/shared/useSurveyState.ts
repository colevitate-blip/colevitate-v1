"use client";

import * as React from "react";
import { usePersonality } from "@/lib/personality/context";
import type { AnswerValue, AssessmentId, QuestionMeta } from "@/lib/personality/types";

export function useSurveyState(assessmentId: AssessmentId, totalSteps: number) {
  const { mounted, progress, saveProgress } = usePersonality();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, AnswerValue>>({});
  const [meta, setMeta] = React.useState<Record<string, QuestionMeta>>({});
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (!mounted || hydrated) return;
    const saved = progress[assessmentId];
    if (saved) {
      // One-time hydration of in-flight progress from localStorage — can't run during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(Math.min(saved.step, totalSteps - 1));
      setAnswers(saved.answers);
      setMeta(saved.meta ?? {});
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hydrated, assessmentId, totalSteps]);

  React.useEffect(() => {
    if (!hydrated) return;
    saveProgress(assessmentId, { step, answers, meta });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, step, answers, meta, assessmentId]);

  const setAnswerMeta = React.useCallback((questionId: string, patch: QuestionMeta) => {
    setMeta((prev) => ({ ...prev, [questionId]: { ...prev[questionId], ...patch } }));
  }, []);

  return { step, setStep, answers, setAnswers, meta, setAnswerMeta, hydrated };
}
