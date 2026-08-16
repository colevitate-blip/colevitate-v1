"use client";

import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";
import { ExplainToggle } from "./ExplainToggle";
import { SkipControl } from "./SkipControl";

interface ScaleQuestionCardProps {
  prompt: string;
  helper?: string;
  example?: string;
  leftLabel: string;
  rightLabel: string;
  value?: number;
  onChange: (value: number) => void;
  onSkip?: () => void;
  accent: AccentTheme;
}

const STEPS = [1, 2, 3, 4, 5];
// The soft-middle layer: a dichotomous question reads as a confidence gradient rather than a
// forced binary pick, so "close calls" aren't distorted into a false Clearly-A/Clearly-B answer.
const STEP_CAPTIONS = ["Clearly", "Lean", "Neither", "Lean", "Clearly"];

export function ScaleQuestionCard({
  prompt,
  helper,
  example,
  leftLabel,
  rightLabel,
  value,
  onChange,
  onSkip,
  accent,
}: ScaleQuestionCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] sm:p-8">
      <p className="text-lg font-medium leading-snug sm:text-xl">{prompt}</p>
      {helper ? (
        <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      ) : null}
      {example ? <ExplainToggle example={example} /> : null}

      <div className="mt-8">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          {STEPS.map((step, i) => {
            const selected = value === step;
            return (
              <span key={step} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`${STEP_CAPTIONS[i]} ${step <= 2 ? leftLabel : step >= 4 ? rightLabel : ""}`.trim()}
                  onClick={() => onChange(step)}
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all sm:size-12",
                    selected
                      ? cn("border-transparent bg-gradient-to-br text-white shadow-md scale-110", accent.gradient)
                      : "border-border bg-background text-muted-foreground hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  {step}
                </button>
                <span className="hidden text-[0.65rem] text-muted-foreground sm:block">
                  {STEP_CAPTIONS[i]}
                </span>
              </span>
            );
          })}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4 text-sm text-muted-foreground">
          <span className="max-w-[45%] leading-snug">{leftLabel}</span>
          <span className="max-w-[45%] text-right leading-snug">{rightLabel}</span>
        </div>
      </div>

      {onSkip ? <SkipControl onSkip={onSkip} /> : null}
    </div>
  );
}
