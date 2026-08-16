import { Check, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentForFramework } from "@/lib/personality/theme";
import { ASSESSMENT_META } from "@/lib/personality/types";
import type { PersonalityResults } from "@/lib/personality/types";
import type { AxisScore } from "@/components/personality/combined/scoringMatrix";

function positionOf(signal: number) {
  const clamped = Math.max(-100, Math.min(100, signal));
  return 50 + clamped / 2;
}

export function AxisAgreement({
  axis,
  results,
}: {
  axis: AxisScore;
  results: PersonalityResults;
}) {
  const clamped = Math.max(-100, Math.min(100, axis.score));
  const fillLeft = clamped < 0 ? 50 + clamped / 2 : 50;
  const fillWidth = Math.abs(clamped) / 2;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{axis.label}</span>
        <span className="text-xs text-muted-foreground">{axis.tierLabel}</span>
      </div>

      <div className="relative h-2 rounded-full bg-muted">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
        <div
          className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#7c8cff] to-[#37e0c4]"
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
        />
        {axis.contributions.map((c) => {
          const accent = accentForFramework(c.framework, results);
          return (
            <div
              key={c.framework}
              title={`${ASSESSMENT_META[c.framework].shortLabel}: ${Math.round(c.signal)}`}
              className={cn(
                "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                accent.solid
              )}
              style={{ left: `${positionOf(c.signal)}%` }}
            />
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{axis.leftPole}</span>
        <span>{axis.rightPole}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {axis.contributions.map((c) => {
          const accent = accentForFramework(c.framework, results);
          return (
            <div key={c.framework} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2 shrink-0 rounded-full", accent.solid)} />
              <span>{ASSESSMENT_META[c.framework].shortLabel}</span>
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-1.5 text-xs font-medium",
          axis.agreement === "agree" && "text-emerald-600 dark:text-emerald-400",
          axis.agreement === "mixed" && "text-amber-600 dark:text-amber-400",
          axis.agreement === "disagree" && "text-rose-600 dark:text-rose-400"
        )}
      >
        {axis.agreement === "agree" ? (
          <Check className="size-3.5" />
        ) : (
          <GitCompareArrows className="size-3.5" />
        )}
        <span>{axis.agreementLabel}</span>
      </div>
    </div>
  );
}
