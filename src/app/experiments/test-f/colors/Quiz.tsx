"use client";

import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";
import { scoreColors } from "@/components/personality/colors/scoring";
import { colorResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testF/SurveyShell";
import ChoiceQuestion from "@/components/experiments/testF/ChoiceQuestion";
import ResultScreen from "@/components/experiments/testF/ResultScreen";

const STORAGE_KEY = "experiments.test-f.colors";
const TOTAL_QUESTIONS = COLOR_QUESTIONS.length;

export default function ColorsQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_QUESTIONS + 1
  );

  if (!hydrated) return null;

  if (step >= TOTAL_QUESTIONS) {
    const result = scoreColors(answers);
    const view = colorResultView(result);
    return <ResultScreen view={view} onRetake={reset} backHref="/experiments/test-f" />;
  }

  const question = COLOR_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;

  return (
    <SurveyShell
      frameworkLabel="4 Color Types"
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
