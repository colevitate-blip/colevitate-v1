"use client";

import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";
import { ExplainToggle } from "./ExplainToggle";
import { SkipControl } from "./SkipControl";

export interface EmojiOption {
  id: string;
  emoji: string;
  label: string;
}

interface EmojiChoiceQuestionCardProps {
  prompt: string;
  example?: string;
  options: EmojiOption[];
  value?: string;
  onChange: (id: string) => void;
  onSkip?: () => void;
  accent: AccentTheme;
}

export function EmojiChoiceQuestionCard({
  prompt,
  example,
  options,
  value,
  onChange,
  onSkip,
  accent,
}: EmojiChoiceQuestionCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-[0_24px_50px_-16px_var(--elevation-shadow-sm)] sm:p-8">
      <p className="text-lg font-medium leading-snug sm:text-xl">{prompt}</p>
      {example ? <ExplainToggle example={example} /> : null}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all",
                selected
                  ? cn("border-transparent bg-gradient-to-br text-white shadow-md", accent.gradient)
                  : "border-border bg-background hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-accent/40"
              )}
            >
              <span className="text-3xl" aria-hidden>
                {option.emoji}
              </span>
              <span className="text-xs font-medium leading-snug sm:text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>

      {onSkip ? <SkipControl onSkip={onSkip} /> : null}
    </div>
  );
}
