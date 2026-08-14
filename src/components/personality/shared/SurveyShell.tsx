"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

interface SurveyShellProps {
  title: string;
  accent: AccentTheme;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

export function SurveyShell({
  title,
  accent,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  canAdvance,
  isLastStep,
  children,
}: SurveyShellProps) {
  const percent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-4 py-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/personality"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Overview
        </Link>
        <span className="text-sm font-medium text-muted-foreground">
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <div className="mb-10 space-y-3">
        <h1
          className={cn(
            "bg-gradient-to-r bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl",
            accent.gradient
          )}
        >
          {title}
        </h1>
        <Progress value={percent} className="h-1.5" />
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={stepIndex === 0}
          className="rounded-full"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canAdvance}
          className={cn(
            "rounded-full bg-gradient-to-r text-white hover:opacity-90",
            accent.gradient
          )}
        >
          {isLastStep ? "See my results" : "Next"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
