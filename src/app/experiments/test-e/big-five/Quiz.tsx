"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { SurveyShell } from "@/components/experiments/testE/SurveyShell";
import { ScaleQuestion } from "@/components/experiments/testE/ScaleQuestion";
import { ResultScreen } from "@/components/experiments/testE/ResultScreen";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { scoreBigFive } from "@/components/personality/bigfive/scoring";
import { bigFiveResultView } from "@/components/experiments/resultView";
import { ASSESSMENT_META } from "@/lib/personality/types";

const STORAGE_KEY = "experiments.test-e.bigfive";

export default function BigFiveQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    BIG_FIVE_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && BIG_FIVE_QUESTIONS.every((q) => typeof answers[q.id] === "number")) {
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (finished) {
    const result = scoreBigFive(answers);
    const view = bigFiveResultView(result);
    return (
      <ResultScreen
        view={view}
        onRetake={() => {
          reset();
          setFinished(false);
        }}
      />
    );
  }

  const question = BIG_FIVE_QUESTIONS[step];
  const currentValue = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const canProceed = currentValue !== undefined;

  return (
    <SurveyShell
      title={ASSESSMENT_META.bigfive.label}
      stepIndex={step}
      totalSteps={BIG_FIVE_QUESTIONS.length}
      backDisabled={step === 0}
      nextDisabled={!canProceed}
      nextLabel={step === BIG_FIVE_QUESTIONS.length - 1 ? "See Results" : "Next"}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => {
        if (!canProceed) return;
        if (step < BIG_FIVE_QUESTIONS.length - 1) {
          setStep(step + 1);
        } else {
          setFinished(true);
        }
      }}
    >
      <ScaleQuestion
        prompt={question.statement}
        leftLabel="Strongly disagree"
        rightLabel="Strongly agree"
        value={currentValue}
        onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
      />
    </SurveyShell>
  );
}
