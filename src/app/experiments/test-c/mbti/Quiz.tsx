"use client";

import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { scoreMbti } from "@/components/personality/mbti/scoring";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { mbtiResultView } from "@/components/experiments/resultView";
import ScaleQuestion from "@/components/experiments/testC/ScaleQuestion";
import SurveyShell from "@/components/experiments/testC/SurveyShell";
import ResultScreen from "@/components/experiments/testC/ResultScreen";

const STORAGE_KEY = "experiments.test-c.mbti";
const TOTAL_STEPS = MBTI_QUESTIONS.length + 1;
const SECTION_LABEL = "16 Personalities — MBTI";

export default function MbtiQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_STEPS
  );

  if (!hydrated) return null;

  if (step >= MBTI_QUESTIONS.length) {
    const result = scoreMbti(answers);
    const view = mbtiResultView(result);
    return <ResultScreen view={view} assessmentLabel={SECTION_LABEL} onRetake={reset} />;
  }

  const question = MBTI_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;

  return (
    <SurveyShell
      sectionLabel={SECTION_LABEL}
      questionIndex={step}
      totalQuestions={MBTI_QUESTIONS.length}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(step + 1)}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === MBTI_QUESTIONS.length - 1 ? "See Result" : "Next"}
    >
      <ScaleQuestion
        index={step + 1}
        prompt={question.prompt}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={value}
        onChange={(v) => setAnswers({ ...answers, [question.id]: v })}
      />
    </SurveyShell>
  );
}
