"use client";

import * as React from "react";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { SurveyShell } from "@/components/experiments/testE/SurveyShell";
import { ChoiceQuestion } from "@/components/experiments/testE/ChoiceQuestion";
import { ResultScreen } from "@/components/experiments/testE/ResultScreen";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { scoreHumanDesign } from "@/components/personality/humandesign/scoring";
import { humanDesignResultView } from "@/components/experiments/resultView";
import { ASSESSMENT_META } from "@/lib/personality/types";

const STORAGE_KEY = "experiments.test-e.humandesign";

export default function HumanDesignQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    HD_QUESTIONS.length
  );
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && HD_QUESTIONS.every((q) => typeof answers[q.id] === "string")) {
      setFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  if (finished) {
    const result = scoreHumanDesign(answers);
    const view = humanDesignResultView(result);
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

  const question = HD_QUESTIONS[step];
  const currentValue = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const canProceed = currentValue !== undefined;

  return (
    <SurveyShell
      title={ASSESSMENT_META.humandesign.label}
      stepIndex={step}
      totalSteps={HD_QUESTIONS.length}
      backDisabled={step === 0}
      nextDisabled={!canProceed}
      nextLabel={step === HD_QUESTIONS.length - 1 ? "See Results" : "Next"}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => {
        if (!canProceed) return;
        if (step < HD_QUESTIONS.length - 1) {
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
