"use client";

import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ScaleQuestionCard } from "@/components/personality/shared/ScaleQuestionCard";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { MBTI_QUESTIONS } from "./questions";
import { scoreMbti } from "./scoring";

export function MbtiSurvey() {
  const { saveResult } = usePersonality();
  const { step, setStep, answers, setAnswers, hydrated } = useSurveyState(
    "mbti",
    MBTI_QUESTIONS.length
  );

  if (!hydrated) return null;

  const question = MBTI_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const accent = ASSESSMENT_THEME.mbti;
  const isLastStep = step === MBTI_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      saveResult("mbti", scoreMbti(answers));
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <SurveyShell
      title="16 Personalities"
      accent={accent}
      stepIndex={step}
      totalSteps={MBTI_QUESTIONS.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={value !== undefined}
      isLastStep={isLastStep}
    >
      <ScaleQuestionCard
        prompt={question.prompt}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
        accent={accent}
      />
    </SurveyShell>
  );
}
