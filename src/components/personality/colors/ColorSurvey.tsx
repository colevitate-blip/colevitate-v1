"use client";

import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ChoiceQuestionCard } from "@/components/personality/shared/ChoiceQuestionCard";
import { RankingQuestionCard } from "@/components/personality/shared/RankingQuestionCard";
import { GuidanceScreen } from "@/components/personality/shared/GuidanceScreen";
import { AccuracyOfferScreen } from "@/components/personality/shared/AccuracyOfferScreen";
import { ReflectionPrompt } from "@/components/personality/shared/ReflectionPrompt";
import { buildFlowSteps } from "@/components/personality/shared/flow";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { COLOR_QUESTIONS, type ColorQuestion } from "./questions";
import { scoreColors } from "./scoring";

export function ColorSurvey() {
  const { saveResult, guidanceSeen, markGuidanceSeen } = usePersonality();
  const { step, setStep, answers, setAnswers, meta, setAnswerMeta, hydrated } = useSurveyState(
    "colors",
    COLOR_QUESTIONS.length
  );

  if (!hydrated) return null;

  const accent = ASSESSMENT_THEME.colors;

  if (!guidanceSeen.colors) {
    return (
      <GuidanceScreen
        title="4 Color Types"
        accent={accent}
        frameworkNote="Pick what you'd actually do in the moment, not what you'd do on your best behavior."
        onContinue={() => markGuidanceSeen("colors")}
      />
    );
  }

  const flowSteps = buildFlowSteps(COLOR_QUESTIONS);
  const clampedStep = Math.min(step, flowSteps.length - 1);
  const current = flowSteps[clampedStep];
  const isLastStep = clampedStep === flowSteps.length - 1;
  const coreCount = COLOR_QUESTIONS.filter((q) => q.tier === "core").length;
  const remainingExtended = flowSteps.length - 1 - coreCount;

  function finishWith(finalAnswers: typeof answers) {
    saveResult("colors", scoreColors(finalAnswers, meta));
  }

  function handleNext() {
    if (isLastStep) {
      finishWith(answers);
      return;
    }
    setStep((s) => Math.min(s + 1, flowSteps.length - 1));
  }

  function handleFinishNow() {
    finishWith(answers);
  }

  function handleSkip(questionId: string) {
    setAnswerMeta(questionId, { skipped: true });
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    handleNext();
  }

  function handleAutofill() {
    const filled: Record<string, string> = {};
    for (const q of COLOR_QUESTIONS) {
      const opt = q.options[Math.floor(Math.random() * q.options.length)];
      filled[q.id] = opt.id;
    }
    saveResult("colors", scoreColors(filled));
  }

  if (current.kind === "offer") {
    return (
      <SurveyShell
        title="4 Color Types"
        accent={accent}
        stepIndex={clampedStep}
        totalSteps={flowSteps.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={handleNext}
        canAdvance
        isLastStep={isLastStep}
        nextLabel="Continue for higher accuracy"
        onAutofill={handleAutofill}
      >
        <AccuracyOfferScreen
          accent={accent}
          remainingCount={remainingExtended}
          estimatedMinutes={Math.max(1, Math.round((remainingExtended * 12) / 60))}
          onFinishNow={handleFinishNow}
        />
      </SurveyShell>
    );
  }

  const question: ColorQuestion = current.question;
  const isRanking = question.format === "ranking";
  const rankValue = Array.isArray(answers[question.id]) ? (answers[question.id] as string[]) : undefined;
  const choiceValue = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const hasAnswer = isRanking ? rankValue !== undefined : choiceValue !== undefined;
  const showReflection = meta[question.id]?.skipped;

  return (
    <SurveyShell
      title="4 Color Types"
      accent={accent}
      stepIndex={clampedStep}
      totalSteps={flowSteps.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={hasAnswer}
      isLastStep={isLastStep}
      onAutofill={handleAutofill}
    >
      {isRanking ? (
        <RankingQuestionCard
          prompt={question.prompt}
          example={question.example}
          options={question.options}
          value={rankValue}
          onChange={(order) => setAnswers((prev) => ({ ...prev, [question.id]: order }))}
          onSkip={() => handleSkip(question.id)}
          accent={accent}
        />
      ) : (
        <ChoiceQuestionCard
          prompt={question.prompt}
          example={question.example}
          options={question.options}
          value={choiceValue}
          onChange={(id) => setAnswers((prev) => ({ ...prev, [question.id]: id }))}
          onSkip={() => handleSkip(question.id)}
          accent={accent}
        />
      )}
      {showReflection ? <ReflectionPrompt key={question.id} assessmentId="colors" questionId={question.id} /> : null}
    </SurveyShell>
  );
}
