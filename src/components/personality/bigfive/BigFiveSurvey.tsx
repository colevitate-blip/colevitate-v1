"use client";

import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ScaleQuestionCard } from "@/components/personality/shared/ScaleQuestionCard";
import { SliderQuestionCard } from "@/components/personality/shared/SliderQuestionCard";
import { GuidanceScreen } from "@/components/personality/shared/GuidanceScreen";
import { AccuracyOfferScreen } from "@/components/personality/shared/AccuracyOfferScreen";
import { ReflectionPrompt } from "@/components/personality/shared/ReflectionPrompt";
import { buildFlowSteps } from "@/components/personality/shared/flow";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { BIG_FIVE_QUESTIONS, type BigFiveQuestion } from "./questions";
import { scoreBigFive } from "./scoring";

export function BigFiveSurvey() {
  const { saveResult, finishAssessment, guidanceSeen, markGuidanceSeen } = usePersonality();
  const { step, setStep, answers, setAnswers, meta, setAnswerMeta, hydrated } = useSurveyState(
    "bigfive",
    BIG_FIVE_QUESTIONS.length
  );

  if (!hydrated) return null;

  const accent = ASSESSMENT_THEME.bigfive;

  if (!guidanceSeen.bigfive) {
    return (
      <GuidanceScreen
        title="Big Five (OCEAN)"
        accent={accent}
        frameworkNote="Each statement describes a concrete situation — answer how you'd actually react, not how you'd like to react."
        onContinue={() => markGuidanceSeen("bigfive")}
      />
    );
  }

  // A trait already resolved by a clearly-picked (non-middle) core answer doesn't need its
  // extended-tier follow-up — skipping it is the flow's lightweight adaptivity.
  const flowSteps = buildFlowSteps(BIG_FIVE_QUESTIONS, (q) => {
    const coreForTrait = BIG_FIVE_QUESTIONS.find((c) => c.tier === "core" && c.trait === q.trait);
    if (!coreForTrait) return true;
    const coreAnswer = answers[coreForTrait.id];
    if (typeof coreAnswer !== "number") return true;
    return Math.abs(coreAnswer - 3) < 0.5;
  });
  const clampedStep = Math.min(step, flowSteps.length - 1);
  const current = flowSteps[clampedStep];
  const isLastStep = clampedStep === flowSteps.length - 1;
  const coreCount = BIG_FIVE_QUESTIONS.filter((q) => q.tier === "core").length;
  const remainingExtended = flowSteps.length - 1 - coreCount;

  function finishWith(finalAnswers: typeof answers) {
    finishAssessment("bigfive", scoreBigFive(finalAnswers, meta));
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
    const filled: Record<string, number> = {};
    for (const q of BIG_FIVE_QUESTIONS) {
      filled[q.id] = Math.ceil(Math.random() * 5);
    }
    saveResult("bigfive", scoreBigFive(filled));
  }

  if (current.kind === "offer") {
    return (
      <SurveyShell
        title="Big Five (OCEAN)"
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

  const question: BigFiveQuestion = current.question;
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const showReflection = meta[question.id]?.skipped || (value !== undefined && Math.abs(value - 3) < 0.3);

  return (
    <SurveyShell
      title="Big Five (OCEAN)"
      accent={accent}
      stepIndex={clampedStep}
      totalSteps={flowSteps.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={value !== undefined}
      isLastStep={isLastStep}
      onAutofill={handleAutofill}
    >
      {question.format === "slider" ? (
        <SliderQuestionCard
          prompt={question.statement}
          example={question.example}
          leftLabel="Strongly disagree"
          rightLabel="Strongly agree"
          value={value}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
          onSkip={() => handleSkip(question.id)}
          accent={accent}
        />
      ) : (
        <ScaleQuestionCard
          prompt={question.statement}
          example={question.example}
          leftLabel="Strongly disagree"
          rightLabel="Strongly agree"
          value={value}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
          onSkip={() => handleSkip(question.id)}
          accent={accent}
        />
      )}
      {showReflection ? <ReflectionPrompt key={question.id} assessmentId="bigfive" questionId={question.id} /> : null}
    </SurveyShell>
  );
}
