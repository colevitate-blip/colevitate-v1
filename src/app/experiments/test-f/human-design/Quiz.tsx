"use client";

import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { scoreHumanDesign } from "@/components/personality/humandesign/scoring";
import { humanDesignResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testF/SurveyShell";
import ChoiceQuestion from "@/components/experiments/testF/ChoiceQuestion";
import ResultScreen from "@/components/experiments/testF/ResultScreen";

const STORAGE_KEY = "experiments.test-f.humandesign";
const TOTAL_QUESTIONS = HD_QUESTIONS.length;

export default function HumanDesignQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_QUESTIONS + 1
  );

  if (!hydrated) return null;

  if (step >= TOTAL_QUESTIONS) {
    const result = scoreHumanDesign(answers);
    const view = humanDesignResultView(result);
    return <ResultScreen view={view} onRetake={reset} backHref="/experiments/test-f" />;
  }

  const question = HD_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;

  return (
    <SurveyShell
      frameworkLabel="Human Design"
      stepIndex={step}
      totalSteps={TOTAL_QUESTIONS}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(step + 1)}
      nextDisabled={value === undefined}
      isLastStep={step === TOTAL_QUESTIONS - 1}
    >
      <ChoiceQuestion
        index={step + 1}
        total={TOTAL_QUESTIONS}
        prompt={question.prompt}
        options={question.options.map((o) => ({ id: o.id, label: o.label }))}
        value={value}
        onChange={(id) => setAnswers((prev) => ({ ...prev, [question.id]: id }))}
      />
    </SurveyShell>
  );
}
