"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { SurveyShell } from "@/components/experiments/testE/SurveyShell";
import { ChoiceQuestion } from "@/components/experiments/testE/ChoiceQuestion";
import { ResultScreen } from "@/components/experiments/testE/ResultScreen";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";
import { scoreColors } from "@/components/personality/colors/scoring";
import { colorResultView } from "@/components/experiments/resultView";
import { ASSESSMENT_META } from "@/lib/personality/types";

const STORAGE_KEY = "experiments.test-e.colors";

export default function ColorsQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    COLOR_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && COLOR_QUESTIONS.every((q) => typeof answers[q.id] === "string")) {
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (finished) {
    const result = scoreColors(answers);
    const view = colorResultView(result);
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

  const question = COLOR_QUESTIONS[step];
  const currentValue = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const canProceed = currentValue !== undefined;

  return (
    <SurveyShell
      title={ASSESSMENT_META.colors.label}
      stepIndex={step}
      totalSteps={COLOR_QUESTIONS.length}
      backDisabled={step === 0}
      nextDisabled={!canProceed}
      nextLabel={step === COLOR_QUESTIONS.length - 1 ? "See Results" : "Next"}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => {
        if (!canProceed) return;
        if (step < COLOR_QUESTIONS.length - 1) {
          setStep(step + 1);
        } else {
          setFinished(true);
        }
      }}
    >
      <ChoiceQuestion
        prompt={question.prompt}
        options={question.options.map((o) => ({ id: o.id, label: o.label }))}
        value={currentValue}
        onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
      />
    </SurveyShell>
  );
}
