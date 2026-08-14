"use client";

import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { scoreHumanDesign } from "@/components/personality/humandesign/scoring";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { humanDesignResultView } from "@/components/experiments/resultView";
import ChoiceQuestion from "@/components/experiments/testC/ChoiceQuestion";
import SurveyShell from "@/components/experiments/testC/SurveyShell";
import ResultScreen from "@/components/experiments/testC/ResultScreen";

const STORAGE_KEY = "experiments.test-c.humandesign";
const TOTAL_STEPS = HD_QUESTIONS.length + 1;
const SECTION_LABEL = "Human Design — Energy Type & Strategy";

export default function HumanDesignQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_STEPS
  );

  if (!hydrated) return null;

  if (step >= HD_QUESTIONS.length) {
    const result = scoreHumanDesign(answers);
    const view = humanDesignResultView(result);
    return <ResultScreen view={view} assessmentLabel={SECTION_LABEL} onRetake={reset} />;
  }

  const question = HD_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;

  return (
    <SurveyShell
      sectionLabel={SECTION_LABEL}
      questionIndex={step}
      totalQuestions={HD_QUESTIONS.length}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(step + 1)}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === HD_QUESTIONS.length - 1 ? "See Result" : "Next"}
    >
      <ChoiceQuestion
        index={step + 1}
        prompt={question.prompt}
        options={question.options}
        value={value}
        onChange={(id) => setAnswers({ ...answers, [question.id]: id })}
      />
    </SurveyShell>
  );
}
