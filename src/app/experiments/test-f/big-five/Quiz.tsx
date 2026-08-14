"use client";

import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { scoreBigFive } from "@/components/personality/bigfive/scoring";
import { bigFiveResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testF/SurveyShell";
import ScaleQuestion from "@/components/experiments/testF/ScaleQuestion";
import ResultScreen from "@/components/experiments/testF/ResultScreen";

const STORAGE_KEY = "experiments.test-f.bigfive";
const TOTAL_QUESTIONS = BIG_FIVE_QUESTIONS.length;

export default function BigFiveQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_QUESTIONS + 1
  );

  if (!hydrated) return null;

  if (step >= TOTAL_QUESTIONS) {
    const result = scoreBigFive(answers);
    const view = bigFiveResultView(result);
    return <ResultScreen view={view} onRetake={reset} backHref="/experiments/test-f" />;
  }

  const question = BIG_FIVE_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;

  return (
    <SurveyShell
      frameworkLabel="Big Five"
      stepIndex={step}
      totalSteps={TOTAL_QUESTIONS}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(step + 1)}
      nextDisabled={value === undefined}
      isLastStep={step === TOTAL_QUESTIONS - 1}
    >
      <ScaleQuestion
        index={step + 1}
        total={TOTAL_QUESTIONS}
        prompt={question.statement}
        leftLabel="Strongly disagree"
        rightLabel="Strongly agree"
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
      />
    </SurveyShell>
  );
}
