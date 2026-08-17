import { cn } from "@/lib/utils";
import { positionOf, fillRect } from "@/lib/personality/axisBar";
import type { AxisCompatibility } from "@/components/personality/combined/computeCompatibility";

const BUCKET_STYLES: Record<AxisCompatibility["bucket"], string> = {
  aligned: "text-emerald-600 dark:text-emerald-400",
  different: "text-amber-600 dark:text-amber-400",
  opposite: "text-rose-600 dark:text-rose-400",
};

const BUCKET_LABELS: Record<AxisCompatibility["bucket"], string> = {
  aligned: "Aligned",
  different: "Different",
  opposite: "Opposite ends",
};

export function CompatibilityAxisBar({
  axis,
  nameA,
  nameB,
}: {
  axis: AxisCompatibility;
  nameA: string;
  nameB: string;
}) {
  const { left: fillLeft, width: fillWidth } = fillRect(axis.scoreA);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{axis.label}</span>
        <span className={cn("text-xs font-medium", BUCKET_STYLES[axis.bucket])}>
          {BUCKET_LABELS[axis.bucket]}
        </span>
      </div>

      <div className="relative h-2 rounded-full bg-muted">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
        <div
          className="absolute inset-y-0 rounded-full bg-primary/25"
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
        />
        <div
          title={`${nameA}: ${Math.round(axis.scoreA)}`}
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card"
          style={{ left: `${positionOf(axis.scoreA)}%` }}
        />
        <div
          title={`${nameB}: ${Math.round(axis.scoreB)}`}
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 ring-2 ring-card"
          style={{ left: `${positionOf(axis.scoreB)}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{axis.leftPole}</span>
        <span>{axis.rightPole}</span>
      </div>

      <div className="mt-3 flex items-center gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 shrink-0 rounded-full bg-primary" />
          <span>{nameA}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 shrink-0 rounded-full bg-amber-500" />
          <span>{nameB}</span>
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{axis.sentence}</p>
    </div>
  );
}
