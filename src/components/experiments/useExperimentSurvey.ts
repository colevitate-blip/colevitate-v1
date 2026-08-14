"use client";

import * as React from "react";

interface StoredState {
  step: number;
  answers: Record<string, number | string>;
}

// Generic step/answer state for a quiz rendered inside a design-concept
// experiment. Persists to its own localStorage key so it never collides
// with the real /personality app's saved progress or with other concepts.
export function useExperimentSurvey(storageKey: string, totalSteps: number) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number | string>>({});
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredState>;
        if (typeof parsed.step === "number") {
          setStep(Math.min(parsed.step, Math.max(0, totalSteps - 1)));
        }
        if (parsed.answers && typeof parsed.answers === "object") {
          setAnswers(parsed.answers);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ step, answers }));
  }, [hydrated, storageKey, step, answers]);

  const reset = React.useCallback(() => {
    setStep(0);
    setAnswers({});
    window.localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { step, setStep, answers, setAnswers, hydrated, reset };
}
