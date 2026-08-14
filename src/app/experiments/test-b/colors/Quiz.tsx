"use client";

import * as React from "react";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";
import { scoreColors, isColorsComplete } from "@/components/personality/colors/scoring";
import { colorResultView } from "@/components/experiments/resultView";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import ChoiceQuestion from "@/components/experiments/testB/ChoiceQuestion";
import SurveyShell from "@/components/experiments/testB/SurveyShell";
import ResultScreen from "@/components/experiments/testB/ResultScreen";

const STORAGE_KEY = "experiments.test-b.colors";

export default function ColorsQuiz() {
  const totalSteps = COLOR_QUESTIONS.length;
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(STORAGE_KEY, totalSteps);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && isColorsComplete(answers)) {
      setSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (submitted) {
    const result = scoreColors(answers);
    const view = colorResultView(result);
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

  const question = COLOR_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;

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
      title="4 Color Types"
      stepIndex={step}
      totalSteps={totalSteps}
      onBack={handleBack}
      onNext={handleNext}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === totalSteps - 1 ? "See my results" : "Next"}
    >
      <ChoiceQuestion
        prompt={question.prompt}
        options={question.options.map((o) => ({ id: o.id, label: o.label }))}
        value={value}
        onChange={(id) => setAnswers({ ...answers, [question.id]: id })}
      />
    </SurveyShell>
  );
}
