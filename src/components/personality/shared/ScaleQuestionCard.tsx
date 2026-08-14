"use client";

import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

interface ScaleQuestionCardProps {
  prompt: string;
  helper?: string;
  leftLabel: string;
  rightLabel: string;
  value?: number;
  onChange: (value: number) => void;
  accent: AccentTheme;
}

const STEPS = [1, 2, 3, 4, 5];

export function ScaleQuestionCard({
  prompt,
  helper,
  leftLabel,
  rightLabel,
  value,
  onChange,
  accent,
}: ScaleQuestionCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-lg font-medium leading-snug sm:text-xl">{prompt}</p>
      {helper ? (
        <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      ) : null}

      <div className="mt-8">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step) => {
            const selected = value === step;
            return (
              <button
                key={step}
                type="button"
                aria-label={`${step} of 5`}
                onClick={() => onChange(step)}
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all sm:size-12",
                  selected
                    ? cn("border-transparent bg-gradient-to-br text-white shadow-md scale-110", accent.gradient)
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {step}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4 text-sm text-muted-foreground">
          <span className="max-w-[45%] leading-snug">{leftLabel}</span>
          <span className="max-w-[45%] text-right leading-snug">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}
