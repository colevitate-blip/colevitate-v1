"use client";

import * as React from "react";
import { SurveyShell } from "@/components/personality/shared/SurveyShell";
import { ScaleQuestionCard } from "@/components/personality/shared/ScaleQuestionCard";
import { GuidanceScreen } from "@/components/personality/shared/GuidanceScreen";
import { AccuracyOfferScreen } from "@/components/personality/shared/AccuracyOfferScreen";
import { ReflectionPrompt } from "@/components/personality/shared/ReflectionPrompt";
import { buildFlowSteps } from "@/components/personality/shared/flow";
import { useSurveyState } from "@/components/personality/shared/useSurveyState";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { MBTI_QUESTIONS, type MbtiQuestion } from "./questions";
import { scoreMbti } from "./scoring";

export function MbtiSurvey() {
  const { saveResult, guidanceSeen, markGuidanceSeen } = usePersonality();
  const { step, setStep, answers, setAnswers, meta, setAnswerMeta, hydrated } = useSurveyState(
    "mbti",
    MBTI_QUESTIONS.length
  );

  if (!hydrated) return null;

  const accent = ASSESSMENT_THEME.mbti;

  if (!guidanceSeen.mbti) {
    return (
      <GuidanceScreen
        title="16 Personalities"
        accent={accent}
        frameworkNote="Some questions read as scenarios — go with your gut reaction, not the 'ideal' answer."
        onContinue={() => markGuidanceSeen("mbti")}
      />
    );
  }

  // A dichotomy already resolved by a clearly-picked (non-middle) core answer doesn't need its
  // extended-tier questions — skipping them is the flow's lightweight adaptivity.
  const flowSteps = buildFlowSteps(MBTI_QUESTIONS, (q) => {
    const coreForDichotomy = MBTI_QUESTIONS.find((c) => c.tier === "core" && c.dichotomy === q.dichotomy);
    if (!coreForDichotomy) return true;
    const coreAnswer = answers[coreForDichotomy.id];
    if (typeof coreAnswer !== "number") return true;
    return coreAnswer === 3; // only a dead-center core answer earns a follow-up question
  });
  const clampedStep = Math.min(step, flowSteps.length - 1);
  const current = flowSteps[clampedStep];
  const isLastStep = clampedStep === flowSteps.length - 1;
  const coreCount = MBTI_QUESTIONS.filter((q) => q.tier === "core").length;
  const remainingExtended = flowSteps.length - 1 - coreCount;

  function finishWith(finalAnswers: typeof answers) {
    saveResult("mbti", scoreMbti(finalAnswers, meta));
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
    for (const q of MBTI_QUESTIONS) {
      filled[q.id] = Math.ceil(Math.random() * 5);
    }
    saveResult("mbti", scoreMbti(filled));
  }

  if (current.kind === "offer") {
    return (
      <SurveyShell
        title="16 Personalities"
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

  const question: MbtiQuestion = current.question;
  const value = typeof answers[question.id] === "number" ? (answers[question.id] as number) : undefined;
  const showReflection = meta[question.id]?.skipped || value === 3;

  return (
    <SurveyShell
      title="16 Personalities"
      accent={accent}
      stepIndex={clampedStep}
      totalSteps={flowSteps.length}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      canAdvance={value !== undefined}
      isLastStep={isLastStep}
      onAutofill={handleAutofill}
    >
      <ScaleQuestionCard
        prompt={question.prompt}
        example={question.example}
        leftLabel={question.statementA}
        rightLabel={question.statementB}
        value={value}
        onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
        onSkip={() => handleSkip(question.id)}
        accent={accent}
      />
      {showReflection ? <ReflectionPrompt key={question.id} assessmentId="mbti" questionId={question.id} /> : null}
    </SurveyShell>
  );
}
