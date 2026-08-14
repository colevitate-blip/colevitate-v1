"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { SurveyShell } from "@/components/experiments/testE/SurveyShell";
import { ScaleQuestion } from "@/components/experiments/testE/ScaleQuestion";
import { ResultScreen } from "@/components/experiments/testE/ResultScreen";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { scoreMbti } from "@/components/personality/mbti/scoring";
import { mbtiResultView } from "@/components/experiments/resultView";
import { ASSESSMENT_META } from "@/lib/personality/types";

const STORAGE_KEY = "experiments.test-e.mbti";

export default function MbtiQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    MBTI_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && MBTI_QUESTIONS.every((q) => typeof answers[q.id] === "number")) {
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (finished) {
    const result = scoreMbti(answers);
    const view = mbtiResultView(result);
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

  const question = MBTI_QUESTIONS[step];
  const currentValue = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const canProceed = currentValue !== undefined;

  return (
    <SurveyShell
      title={ASSESSMENT_META.mbti.label}
      stepIndex={step}
      totalSteps={MBTI_QUESTIONS.length}
      backDisabled={step === 0}
      nextDisabled={!canProceed}
      nextLabel={step === MBTI_QUESTIONS.length - 1 ? "See Results" : "Next"}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => {
        if (!canProceed) return;
        if (step < MBTI_QUESTIONS.length - 1) {
          setStep(step + 1);
        } else {
          setFinished(true);
        }
      }}
    >
      <ScaleQuestion
        prompt={question.prompt}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={currentValue}
        onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
      />
    </SurveyShell>
  );
}
