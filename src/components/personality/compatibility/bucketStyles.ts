import type { AxisCompatibility } from "@/components/personality/combined/computeCompatibility";

export const BUCKET_STYLES: Record<AxisCompatibility["bucket"], string> = {
  aligned: "text-emerald-600 dark:text-emerald-400",
  different: "text-amber-600 dark:text-amber-400",
  opposite: "text-rose-600 dark:text-rose-400",
};

export const BUCKET_LABELS: Record<AxisCompatibility["bucket"], string> = {
  aligned: "Aligned",
  different: "Different",
  opposite: "Opposite ends",
};
