"use client";

import { useState } from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { mbtiResultView, type ResultView } from "@/components/experiments/resultView";
import ScaleQuestion from "@/components/experiments/testD/ScaleQuestion";
import SurveyShell from "@/components/experiments/testD/SurveyShell";
import ResultScreen from "@/components/experiments/testD/ResultScreen";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { scoreMbti } from "@/components/personality/mbti/scoring";

export default function MbtiQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-d.mbti",
    MBTI_QUESTIONS.length
  );
  const [result, setResult] = useState<ResultView | null>(null);

  if (!hydrated) return null;

  if (result) {
    return (
      <ResultScreen
        result={result}
        onRetake={() => {
          reset();
          setResult(null);
        }}
      />
    );
  }

  const question = MBTI_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const isLastStep = step === MBTI_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      setResult(mbtiResultView(scoreMbti(answers)));
      return;
    }
    setStep(step + 1);
  }

  return (
    <SurveyShell
      frameworkLabel="MBTI · 16 Personalities"
      stepIndex={step}
      totalSteps={MBTI_QUESTIONS.length}
      backLabel={step === 0 ? "Exit" : "Back"}
      nextLabel={isLastStep ? "See results" : "Next"}
      nextDisabled={value === undefined}
      onBack={() => {
        if (step === 0) {
          window.location.href = "/experiments/test-d";
        } else {
          setStep(step - 1);
        }
      }}
      onNext={handleNext}
    >
      <ScaleQuestion
        prompt={question.prompt}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={value}
        onChange={(v) => setAnswers({ ...answers, [question.id]: v })}
      />
    </SurveyShell>
  );
}
