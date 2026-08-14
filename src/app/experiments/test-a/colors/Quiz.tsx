"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { colorResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testA/SurveyShell";
import ChoiceQuestion from "@/components/experiments/testA/ChoiceQuestion";
import ResultScreen from "@/components/experiments/testA/ResultScreen";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";
import { scoreColors } from "@/components/personality/colors/scoring";

export default function ColorsQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-a.colors",
    COLOR_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  if (!hydrated) return null;

  if (finished) {
    const view = colorResultView(scoreColors(answers));
    return (
      <ResultScreen
        view={view}
        scriptLabel="colors-result.sh"
        backHref="/experiments/test-a"
        onRetake={() => {
          reset();
          setFinished(false);
        }}
      />
    );
  }

  const question = COLOR_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const isLastStep = step === COLOR_QUESTIONS.length - 1;

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
      scriptLabel="colors.sh"
      title="4 Color Types"
      step={step}
      totalSteps={COLOR_QUESTIONS.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={isLastStep ? "see results >" : "next >"}
    >
      <ChoiceQuestion
        prompt={question.prompt}
        options={question.options}
        value={value}
        onChange={(id) => setAnswers((prev) => ({ ...prev, [question.id]: id }))}
      />
    </SurveyShell>
  );
}
