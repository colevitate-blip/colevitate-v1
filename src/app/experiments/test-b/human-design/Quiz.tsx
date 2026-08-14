"use client";

import * as React from "react";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { scoreHumanDesign, isHumanDesignComplete } from "@/components/personality/humandesign/scoring";
import { humanDesignResultView } from "@/components/experiments/resultView";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import ChoiceQuestion from "@/components/experiments/testB/ChoiceQuestion";
import SurveyShell from "@/components/experiments/testB/SurveyShell";
import ResultScreen from "@/components/experiments/testB/ResultScreen";

const STORAGE_KEY = "experiments.test-b.humandesign";

export default function HumanDesignQuiz() {
  const totalSteps = HD_QUESTIONS.length;
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(STORAGE_KEY, totalSteps);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && isHumanDesignComplete(answers)) {
      setSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (submitted) {
    const result = scoreHumanDesign(answers);
    const view = humanDesignResultView(result);
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

  const question = HD_QUESTIONS[step];
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
      title="Human Design"
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
