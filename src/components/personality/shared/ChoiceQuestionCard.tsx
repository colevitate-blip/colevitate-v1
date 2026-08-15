"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

export interface ChoiceOption {
  id: string;
  label: string;
}

interface ChoiceQuestionCardProps {
  prompt: string;
  helper?: string;
  options: ChoiceOption[];
  value?: string;
  onChange: (id: string) => void;
  accent: AccentTheme;
}

export function ChoiceQuestionCard({
  prompt,
  helper,
  options,
  value,
  onChange,
  accent,
}: ChoiceQuestionCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] sm:p-8">
      <p className="text-lg font-medium leading-snug sm:text-xl">{prompt}</p>
      {helper ? (
        <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      ) : null}

      <div className="mt-6 space-y-3">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all sm:text-base",
                selected
                  ? cn("border-transparent bg-gradient-to-r text-white shadow-md", accent.gradient)
                  : "border-border bg-background hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-accent/40"
              )}
            >
              <span>{option.label}</span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected ? "border-white/70 bg-white/20" : "border-border"
                )}
              >
                {selected ? <Check className="size-3.5" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
