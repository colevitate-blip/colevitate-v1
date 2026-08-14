"use client";

import * as React from "react";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { scoreBigFive, isBigFiveComplete } from "@/components/personality/bigfive/scoring";
import { bigFiveResultView } from "@/components/experiments/resultView";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import ScaleQuestion from "@/components/experiments/testB/ScaleQuestion";
import SurveyShell from "@/components/experiments/testB/SurveyShell";
import ResultScreen from "@/components/experiments/testB/ResultScreen";

const STORAGE_KEY = "experiments.test-b.bigfive";

export default function BigFiveQuiz() {
  const totalSteps = BIG_FIVE_QUESTIONS.length;
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(STORAGE_KEY, totalSteps);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && isBigFiveComplete(answers)) {
      setSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (submitted) {
    const result = scoreBigFive(answers);
    const view = bigFiveResultView(result);
    return (
      <ResultScreen
        view={view}
        onRetake={() => {
          reset();
          setSubmitted(false);
        }}
      />
    );
  }

  const question = BIG_FIVE_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;

  const handleNext = () => {
    if (value === undefined) return;
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <SurveyShell
      title="Big Five"
      stepIndex={step}
      totalSteps={totalSteps}
      onBack={handleBack}
      onNext={handleNext}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === totalSteps - 1 ? "See my results" : "Next"}
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
