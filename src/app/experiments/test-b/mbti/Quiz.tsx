"use client";

import * as React from "react";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { scoreMbti, isMbtiComplete } from "@/components/personality/mbti/scoring";
import { mbtiResultView } from "@/components/experiments/resultView";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import ScaleQuestion from "@/components/experiments/testB/ScaleQuestion";
import SurveyShell from "@/components/experiments/testB/SurveyShell";
import ResultScreen from "@/components/experiments/testB/ResultScreen";

const STORAGE_KEY = "experiments.test-b.mbti";

export default function MbtiQuiz() {
  const totalSteps = MBTI_QUESTIONS.length;
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(STORAGE_KEY, totalSteps);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && isMbtiComplete(answers)) {
      setSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (submitted) {
    const result = scoreMbti(answers);
    const view = mbtiResultView(result);
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

  const question = MBTI_QUESTIONS[step];
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
      title="16 Personalities"
      stepIndex={step}
      totalSteps={totalSteps}
      onBack={handleBack}
      onNext={handleNext}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === totalSteps - 1 ? "See my results" : "Next"}
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
