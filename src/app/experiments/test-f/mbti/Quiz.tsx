"use client";

import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { scoreMbti } from "@/components/personality/mbti/scoring";
import { mbtiResultView } from "@/components/experiments/resultView";
import SurveyShell from "@/components/experiments/testF/SurveyShell";
import ScaleQuestion from "@/components/experiments/testF/ScaleQuestion";
import ResultScreen from "@/components/experiments/testF/ResultScreen";

const STORAGE_KEY = "experiments.test-f.mbti";
const TOTAL_QUESTIONS = MBTI_QUESTIONS.length;

export default function MbtiQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_QUESTIONS + 1
  );

  if (!hydrated) return null;

  if (step >= TOTAL_QUESTIONS) {
    const result = scoreMbti(answers);
    const view = mbtiResultView(result);
    return <ResultScreen view={view} onRetake={reset} backHref="/experiments/test-f" />;
  }

  const question = MBTI_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;

  return (
    <SurveyShell
      frameworkLabel="MBTI"
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
        prompt={question.prompt}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
      />
    </SurveyShell>
  );
}
