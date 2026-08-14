"use client";

import { useState } from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { bigFiveResultView, type ResultView } from "@/components/experiments/resultView";
import ScaleQuestion from "@/components/experiments/testD/ScaleQuestion";
import SurveyShell from "@/components/experiments/testD/SurveyShell";
import ResultScreen from "@/components/experiments/testD/ResultScreen";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { scoreBigFive } from "@/components/personality/bigfive/scoring";

export default function BigFiveQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-d.bigfive",
    BIG_FIVE_QUESTIONS.length
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

  const question = BIG_FIVE_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const isLastStep = step === BIG_FIVE_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      setResult(bigFiveResultView(scoreBigFive(answers)));
      return;
    }
    setStep(step + 1);
  }

  return (
    <SurveyShell
      frameworkLabel="Big Five · OCEAN"
      stepIndex={step}
      totalSteps={BIG_FIVE_QUESTIONS.length}
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
        prompt={question.statement}
        leftLabel="Strongly disagree"
        rightLabel="Strongly agree"
        value={value}
        onChange={(v) => setAnswers({ ...answers, [question.id]: v })}
      />
    </SurveyShell>
  );
}
