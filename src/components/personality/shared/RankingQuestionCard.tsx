"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";
import { ExplainToggle } from "./ExplainToggle";
import { SkipControl } from "./SkipControl";

export interface RankingOption {
  id: string;
  label: string;
}

interface RankingQuestionCardProps {
  prompt: string;
  example?: string;
  helper?: string;
  options: RankingOption[];
  value?: string[];
  onChange: (order: string[]) => void;
  onSkip?: () => void;
  accent: AccentTheme;
}

export function RankingQuestionCard({
  prompt,
  example,
  helper,
  options,
  value,
  onChange,
  onSkip,
  accent,
}: RankingQuestionCardProps) {
  const order = value ?? options.map((o) => o.id);
  const byId = React.useMemo(() => new Map(options.map((o) => [o.id, o.label])), [options]);

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-[0_24px_50px_-16px_var(--elevation-shadow-sm)] sm:p-8">
      <p className="text-lg font-medium leading-snug sm:text-xl">{prompt}</p>
      {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
      {example ? <ExplainToggle example={example} /> : null}

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Drag with the arrows — most like you at the top
      </p>
      <ol className="mt-2 space-y-2">
        {order.map((id, index) => (
          <li
            key={id}
            className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-background px-4 py-3"
          >
            <span className="flex items-center gap-3 text-sm font-medium">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
                  accent.gradient
                )}
              >
                {index + 1}
              </span>
              {byId.get(id)}
            </span>
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                aria-label={`Move "${byId.get(id)}" up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Move "${byId.get(id)}" down`}
                disabled={index === order.length - 1}
                onClick={() => move(index, 1)}
                className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronDown className="size-4" />
              </button>
            </span>
          </li>
        ))}
      </ol>

      {onSkip ? <SkipControl onSkip={onSkip} /> : null}
    </div>
  );
}
