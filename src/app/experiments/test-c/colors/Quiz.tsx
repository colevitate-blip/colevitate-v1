"use client";

import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";
import { scoreColors } from "@/components/personality/colors/scoring";
import { useExperimentSurvey } from "@/components/experiments/useExperimentSurvey";
import { colorResultView } from "@/components/experiments/resultView";
import ChoiceQuestion from "@/components/experiments/testC/ChoiceQuestion";
import SurveyShell from "@/components/experiments/testC/SurveyShell";
import ResultScreen from "@/components/experiments/testC/ResultScreen";

const STORAGE_KEY = "experiments.test-c.colors";
const TOTAL_STEPS = COLOR_QUESTIONS.length + 1;
const SECTION_LABEL = "4 Color Types — Red · Blue · Green · Yellow";

export default function ColorsQuiz() {
  const { step, setStep, answers, setAnswers, hydrated, reset } = useExperimentSurvey(
    STORAGE_KEY,
    TOTAL_STEPS
  );

  if (!hydrated) return null;

  if (step >= COLOR_QUESTIONS.length) {
    const result = scoreColors(answers);
    const view = colorResultView(result);
    return <ResultScreen view={view} assessmentLabel={SECTION_LABEL} onRetake={reset} />;
  }

  const question = COLOR_QUESTIONS[step];
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;

  return (
    <SurveyShell
      sectionLabel={SECTION_LABEL}
      questionIndex={step}
      totalQuestions={COLOR_QUESTIONS.length}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(step + 1)}
      backDisabled={step === 0}
      nextDisabled={value === undefined}
      nextLabel={step === COLOR_QUESTIONS.length - 1 ? "See Result" : "Next"}
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
