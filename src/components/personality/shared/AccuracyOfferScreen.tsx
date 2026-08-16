"use client";

import { ArrowUpRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

interface AccuracyOfferScreenProps {
  accent: AccentTheme;
  remainingCount: number;
  estimatedMinutes: number;
  onFinishNow: () => void;
}

export function AccuracyOfferScreen({
  accent,
  remainingCount,
  estimatedMinutes,
  onFinishNow,
}: AccuracyOfferScreenProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 text-center shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] sm:p-8">
      <div className={cn("mx-auto flex size-11 items-center justify-center rounded-2xl", accent.softBg)}>
        <Zap className={cn("size-5", accent.text)} />
      </div>
      <h2 className="mt-4 text-lg font-semibold sm:text-xl">You&apos;ve got a usable result already</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Want higher accuracy? {remainingCount} more question{remainingCount === 1 ? "" : "s"} (~
        {estimatedMinutes} min) will sharpen the close calls. Or finish now with what you&apos;ve
        already answered.
      </p>
      <button
        type="button"
        onClick={onFinishNow}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        Finish now instead
        <ArrowUpRight className="size-3.5" />
      </button>
    </div>
  );
}
