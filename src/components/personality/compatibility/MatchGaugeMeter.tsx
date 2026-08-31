import { cn } from "@/lib/utils";
import type { MatchGauge } from "./relationshipFraming";

const BAND_FILL: Record<MatchGauge["band"], string> = {
  poor: "bg-rose-500",
  rocky: "bg-orange-500",
  mixed: "bg-amber-400",
  strong: "bg-lime-500",
  great: "bg-emerald-500",
};

const BAND_TEXT: Record<MatchGauge["band"], string> = {
  poor: "text-rose-600 dark:text-rose-400",
  rocky: "text-orange-600 dark:text-orange-400",
  mixed: "text-amber-600 dark:text-amber-400",
  strong: "text-lime-600 dark:text-lime-400",
  great: "text-emerald-600 dark:text-emerald-400",
};

export function MatchGaugeMeter({ gauge }: { gauge: MatchGauge }) {
  return (
    <div className="relative mx-auto mt-6 max-w-xs">
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-bold tracking-tight">{gauge.value}</span>
        <span className="text-lg font-medium text-muted-foreground">/10</span>
      </div>
      <p className={cn("mt-0.5 text-center text-sm font-semibold", BAND_TEXT[gauge.band])}>{gauge.label}</p>

      <div className="mt-3 flex gap-1" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={cn("h-2 flex-1 rounded-full", i < gauge.value ? BAND_FILL[gauge.band] : "bg-muted")}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <span>Not good</span>
        <span>Great</span>
      </div>
    </div>
  );
}
