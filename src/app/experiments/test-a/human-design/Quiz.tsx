"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { humanDesignResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testA/SurveyShell";
import ChoiceQuestion from "@/components/experiments/testA/ChoiceQuestion";
import ResultScreen from "@/components/experiments/testA/ResultScreen";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { scoreHumanDesign } from "@/components/personality/humandesign/scoring";

export default function HumanDesignQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    "experiments.test-a.humandesign",
    HD_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  if (!hydrated) return null;

  if (finished) {
    const view = humanDesignResultView(scoreHumanDesign(answers));
    return (
      <ResultScreen
        view={view}
        scriptLabel="humandesign-result.sh"
        backHref="/experiments/test-a"
        onRetake={() => {
          reset();
          setFinished(false);
        }}
      />
    );
  }

  const question = HD_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const isLastStep = step === HD_QUESTIONS.length - 1;

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
      scriptLabel="humandesign.sh"
      title="Human Design"
      step={step}
      totalSteps={HD_QUESTIONS.length}
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
