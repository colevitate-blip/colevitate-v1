"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { mbtiResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testA/SurveyShell";
import ScaleQuestion from "@/components/experiments/testA/ScaleQuestion";
import ResultScreen from "@/components/experiments/testA/ResultScreen";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { scoreMbti } from "@/components/personality/mbti/scoring";

export default function MbtiQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-a.mbti",
    MBTI_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  if (!hydrated) return null;

  if (finished) {
    const view = mbtiResultView(scoreMbti(answers));
    return (
      <ResultScreen
        view={view}
        scriptLabel="mbti-result.sh"
        backHref="/experiments/test-a"
        onRetake={() => {
          reset();
          setFinished(false);
        }}
      />
    );
  }

  const question = MBTI_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const isLastStep = step === MBTI_QUESTIONS.length - 1;

  function handleNext() {
    if (value === undefined) return;
    if (isLastStep) {
      setFinished(true);
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <SurveyShell
      scriptLabel="mbti.sh"
      title="16 Personalities · MBTI"
      step={step}
      totalSteps={MBTI_QUESTIONS.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={isLastStep ? "see results >" : "next >"}
    >
      <ScaleQuestion
        prompt={question.prompt}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
      />
    </SurveyShell>
  );
}
