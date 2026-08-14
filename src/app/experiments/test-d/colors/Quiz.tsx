"use client";

import { useState } from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { colorResultView, type ResultView } from "@/components/experiments/resultView";
import ChoiceQuestion from "@/components/experiments/testD/ChoiceQuestion";
import SurveyShell from "@/components/experiments/testD/SurveyShell";
import ResultScreen from "@/components/experiments/testD/ResultScreen";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";
import { scoreColors } from "@/components/personality/colors/scoring";

export default function ColorsQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-d.colors",
    COLOR_QUESTIONS.length
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

  const question = COLOR_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const isLastStep = step === COLOR_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      setResult(colorResultView(scoreColors(answers)));
      return;
    }
    setStep(step + 1);
  }

  return (
    <SurveyShell
      frameworkLabel="4 Color Types"
      stepIndex={step}
      totalSteps={COLOR_QUESTIONS.length}
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
      <ChoiceQuestion
        prompt={question.prompt}
        options={question.options}
        value={value}
        onChange={(id) => setAnswers({ ...answers, [question.id]: id })}
      />
    </SurveyShell>
  );
}
