"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { bigFiveResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testA/SurveyShell";
import ScaleQuestion from "@/components/experiments/testA/ScaleQuestion";
import ResultScreen from "@/components/experiments/testA/ResultScreen";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { scoreBigFive } from "@/components/personality/bigfive/scoring";

export default function BigFiveQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-a.bigfive",
    BIG_FIVE_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  if (!hydrated) return null;

  if (finished) {
    const view = bigFiveResultView(scoreBigFive(answers));
    return (
      <ResultScreen
        view={view}
        scriptLabel="bigfive-result.sh"
        backHref="/experiments/test-a"
        onRetake={() => {
          reset();
          setFinished(false);
        }}
      />
    );
  }

  const question = BIG_FIVE_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const isLastStep = step === BIG_FIVE_QUESTIONS.length - 1;

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
      scriptLabel="bigfive.sh"
      title="Big Five · OCEAN"
      step={step}
      totalSteps={BIG_FIVE_QUESTIONS.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={isLastStep ? "see results >" : "next >"}
    >
      <ScaleQuestion
        prompt={question.statement}
        leftLabel="Strongly disagree"
        rightLabel="Strongly agree"
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
      />
    </SurveyShell>
  );
}
