"use client";

import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ChoiceQuestionCard } from "@/components/personality/shared/ChoiceQuestionCard";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { HD_QUESTIONS } from "./questions";
import { scoreHumanDesign } from "./scoring";

export function HumanDesignSurvey() {
  const { saveResult } = usePersonality();
  const { step, setStep, answers, setAnswers, hydrated } = useSurveyState(
    "humandesign",
    HD_QUESTIONS.length
  );

  if (!hydrated) return null;

  const question = HD_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const accent = ASSESSMENT_THEME.humandesign;
  const isLastStep = step === HD_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      saveResult("humandesign", scoreHumanDesign(answers));
      return;
    }
    setStep((s) => s + 1);
  }

  function handleAutofill() {
    const filled: Record<string, number | string> = {};
    for (const q of HD_QUESTIONS) {
      const opt = q.options[Math.floor(Math.random() * q.options.length)];
      filled[q.id] = opt.id;
    }
    saveResult("humandesign", scoreHumanDesign(filled));
  }

  return (
    <SurveyShell
      title="Human Design"
      accent={accent}
      stepIndex={step}
      totalSteps={HD_QUESTIONS.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={value !== undefined}
      isLastStep={isLastStep}
      onAutofill={handleAutofill}
    >
      <ChoiceQuestionCard
        prompt={question.prompt}
        options={question.options}
        value={value}
        onChange={(id) => setAnswers((prev) => ({ ...prev, [question.id]: id }))}
        accent={accent}
      />
    </SurveyShell>
  );
}
