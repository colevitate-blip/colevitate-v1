import { cn } from "@/lib/utils";
import type { AxisCompatibility } from "@/components/personality/combined/computeCompatibility";
import { BUCKET_STYLES, BUCKET_LABELS } from "./bucketStyles";

/**
 * The "summary_only" consent-level counterpart to CompatibilityAxisBar —
 * renders the same descriptive sentence and bucket, but never the numeric
 * scoreA/scoreB dial, since the invitee chose not to share exact axis
 * positions back to the inviter.
 */
export function CompatibilityAxisSummary({ axis }: { axis: AxisCompatibility }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{axis.label}</span>
        <span className={cn("text-xs font-medium", BUCKET_STYLES[axis.bucket])}>
          {BUCKET_LABELS[axis.bucket]}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{axis.sentence}</p>
    </div>
  );
}
