"use client";

import * as React from "react";
import { usePersonality } from "@/lib/personality/context";
import type { AssessmentId } from "@/lib/personality/types";

export function useSurveyState(assessmentId: AssessmentId, totalSteps: number) {
  const { mounted, progress, saveProgress } = usePersonality();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number | string>>({});
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (!mounted || hydrated) return;
    const saved = progress[assessmentId];
    if (saved) {
      setStep(Math.min(saved.step, totalSteps - 1));
      setAnswers(saved.answers);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hydrated, assessmentId, totalSteps]);

  React.useEffect(() => {
    if (!hydrated) return;
    saveProgress(assessmentId, { step, answers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, step, answers, assessmentId]);

  return { step, setStep, answers, setAnswers, hydrated };
}
