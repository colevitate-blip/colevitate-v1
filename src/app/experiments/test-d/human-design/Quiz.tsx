"use client";

import { useState } from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { humanDesignResultView, type ResultView } from "@/components/experiments/resultView";
import ChoiceQuestion from "@/components/experiments/testD/ChoiceQuestion";
import SurveyShell from "@/components/experiments/testD/SurveyShell";
import ResultScreen from "@/components/experiments/testD/ResultScreen";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { scoreHumanDesign } from "@/components/personality/humandesign/scoring";

export default function HumanDesignQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-d.humandesign",
    HD_QUESTIONS.length
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

  const question = HD_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const isLastStep = step === HD_QUESTIONS.length - 1;

  function handleNext() {
    if (isLastStep) {
      setResult(humanDesignResultView(scoreHumanDesign(answers)));
      return;
    }
    setStep(step + 1);
  }

  return (
    <SurveyShell
      frameworkLabel="Human Design"
      stepIndex={step}
      totalSteps={HD_QUESTIONS.length}
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
