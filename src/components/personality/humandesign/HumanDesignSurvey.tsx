"use client";

import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ChoiceQuestionCard } from "@/components/personality/shared/ChoiceQuestionCard";
import { EmojiChoiceQuestionCard } from "@/components/personality/shared/EmojiChoiceQuestionCard";
import { GuidanceScreen } from "@/components/personality/shared/GuidanceScreen";
import { AccuracyOfferScreen } from "@/components/personality/shared/AccuracyOfferScreen";
import { ReflectionPrompt } from "@/components/personality/shared/ReflectionPrompt";
import { buildFlowSteps } from "@/components/personality/shared/flow";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { HD_QUESTIONS, type HdQuestion } from "./questions";
import { scoreHumanDesign } from "./scoring";

export function HumanDesignSurvey() {
  const { saveResult, guidanceSeen, markGuidanceSeen } = usePersonality();
  const { step, setStep, answers, setAnswers, meta, setAnswerMeta, hydrated } = useSurveyState(
    "humandesign",
    HD_QUESTIONS.length
  );

  if (!hydrated) return null;

  const accent = ASSESSMENT_THEME.humandesign;

  if (!guidanceSeen.humandesign) {
    return (
      <GuidanceScreen
        title="Human Design"
        accent={accent}
        frameworkNote="No birth date, time, or location needed — this is a pure self-reflection path based on how you actually operate."
        onContinue={() => markGuidanceSeen("humandesign")}
      />
    );
  }

  const flowSteps = buildFlowSteps(HD_QUESTIONS);
  const clampedStep = Math.min(step, flowSteps.length - 1);
  const current = flowSteps[clampedStep];
  const isLastStep = clampedStep === flowSteps.length - 1;
  const coreCount = HD_QUESTIONS.filter((q) => q.tier === "core").length;
  const remainingExtended = flowSteps.length - 1 - coreCount;

  function finishWith(finalAnswers: typeof answers) {
    saveResult("humandesign", scoreHumanDesign(finalAnswers, meta));
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
    for (const q of HD_QUESTIONS) {
      const opt = q.options[Math.floor(Math.random() * q.options.length)];
      filled[q.id] = opt.id;
    }
    saveResult("humandesign", scoreHumanDesign(filled));
  }

  if (current.kind === "offer") {
    return (
      <SurveyShell
        title="Human Design"
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

  const question: HdQuestion = current.question;
  const value = typeof answers[question.id] === "string" ? (answers[question.id] as string) : undefined;
  const showReflection = meta[question.id]?.skipped;

  return (
    <SurveyShell
      title="Human Design"
      accent={accent}
      stepIndex={clampedStep}
      totalSteps={flowSteps.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={value !== undefined}
      isLastStep={isLastStep}
      onAutofill={handleAutofill}
    >
      {question.format === "emoji" ? (
        <EmojiChoiceQuestionCard
          prompt={question.prompt}
          example={question.example}
          options={question.options.map((o) => ({ id: o.id, emoji: o.emoji ?? "✨", label: o.label }))}
          value={value}
          onChange={(id) => setAnswers((prev) => ({ ...prev, [question.id]: id }))}
          onSkip={() => handleSkip(question.id)}
          accent={accent}
        />
      ) : (
        <ChoiceQuestionCard
          prompt={question.prompt}
          example={question.example}
          options={question.options}
          value={value}
          onChange={(id) => setAnswers((prev) => ({ ...prev, [question.id]: id }))}
          onSkip={() => handleSkip(question.id)}
          accent={accent}
        />
      )}
      {showReflection ? (
        <ReflectionPrompt key={question.id} assessmentId="humandesign" questionId={question.id} />
      ) : null}
    </SurveyShell>
  );
}
