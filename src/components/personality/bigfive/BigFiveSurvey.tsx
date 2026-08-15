"use client";

import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ScaleQuestionCard } from "@/components/personality/shared/ScaleQuestionCard";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { BIG_FIVE_QUESTIONS } from "./questions";
import { scoreBigFive } from "./scoring";

export function BigFiveSurvey() {
  const { saveResult } = usePersonality();
  const { step, setStep, answers, setAnswers, hydrated } = useSurveyState(
    "bigfive",
    BIG_FIVE_QUESTIONS.length
  );

  if (!hydrated) return null;

  const question = BIG_FIVE_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const accent = ASSESSMENT_THEME.bigfive;
  const isLastStep = step === BIG_FIVE_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      saveResult("bigfive", scoreBigFive(answers));
      return;
    }
    setStep((s) => s + 1);
  }

  function handleAutofill() {
    const filled: Record<string, number | string> = {};
    for (const q of BIG_FIVE_QUESTIONS) {
      filled[q.id] = Math.ceil(Math.random() * 5);
    }
    saveResult("bigfive", scoreBigFive(filled));
  }

  return (
    <SurveyShell
      title="Big Five (OCEAN)"
      accent={accent}
      stepIndex={step}
      totalSteps={BIG_FIVE_QUESTIONS.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={value !== undefined}
      isLastStep={isLastStep}
      onAutofill={handleAutofill}
    >
      <ScaleQuestionCard
        prompt={question.statement}
        leftLabel="Strongly disagree"
        rightLabel="Strongly agree"
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
        accent={accent}
      />
    </SurveyShell>
  );
}
