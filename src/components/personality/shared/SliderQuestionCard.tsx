"use client";

import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";
import { ExplainToggle } from "./ExplainToggle";
import { SkipControl } from "./SkipControl";

interface SliderQuestionCardProps {
  prompt: string;
  example?: string;
  leftLabel: string;
  rightLabel: string;
  value?: number;
  onChange: (value: number) => void;
  onSkip?: () => void;
  accent: AccentTheme;
}

export function SliderQuestionCard({
  prompt,
  example,
  leftLabel,
  rightLabel,
  value,
  onChange,
  onSkip,
  accent,
}: SliderQuestionCardProps) {
  const position = value ?? 3;

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] sm:p-8">
      <p className="text-lg font-medium leading-snug sm:text-xl">{prompt}</p>
      {example ? <ExplainToggle example={example} /> : null}

      <div className="mt-8">
        <input
          type="range"
          min={1}
          max={5}
          step={0.1}
          value={position}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={prompt}
          className={cn("h-2 w-full cursor-pointer appearance-none rounded-full bg-muted", accent.text)}
          style={{ accentColor: "currentColor" }}
        />
        <div className="mt-3 flex items-start justify-between gap-4 text-sm text-muted-foreground">
          <span className="max-w-[45%] leading-snug">{leftLabel}</span>
          <span className="max-w-[45%] text-right leading-snug">{rightLabel}</span>
        </div>
      </div>

      {onSkip ? <SkipControl onSkip={onSkip} /> : null}
    </div>
  );
}
