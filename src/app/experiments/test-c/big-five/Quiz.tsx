"use client";

import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { scoreBigFive } from "@/components/personality/bigfive/scoring";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { bigFiveResultView } from "@/components/experiments/resultView";
import ScaleQuestion from "@/components/experiments/testC/ScaleQuestion";
import SurveyShell from "@/components/experiments/testC/SurveyShell";
import ResultScreen from "@/components/experiments/testC/ResultScreen";

const STORAGE_KEY = "experiments.test-c.bigfive";
const TOTAL_STEPS = BIG_FIVE_QUESTIONS.length + 1;
const SECTION_LABEL = "Big Five — The OCEAN Model";

export default function BigFiveQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_STEPS
  );

  if (!hydrated) return null;

  if (step >= BIG_FIVE_QUESTIONS.length) {
    const result = scoreBigFive(answers);
    const view = bigFiveResultView(result);
    return <ResultScreen view={view} assessmentLabel={SECTION_LABEL} onRetake={reset} />;
  }

  const question = BIG_FIVE_QUESTIONS[step];
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;

  return (
    <SurveyShell
      sectionLabel={SECTION_LABEL}
      questionIndex={step}
      totalQuestions={BIG_FIVE_QUESTIONS.length}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(step + 1)}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === BIG_FIVE_QUESTIONS.length - 1 ? "See Result" : "Next"}
    >
      <ScaleQuestion
        index={step + 1}
        prompt={question.statement}
        leftLabel="Strongly disagree"
        rightLabel="Strongly agree"
        value={value}
        onChange={(v) => setAnswers({ ...answers, [question.id]: v })}
      />
    </SurveyShell>
  );
}
