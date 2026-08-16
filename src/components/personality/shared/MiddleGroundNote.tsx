import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

interface MiddleGroundNoteProps {
  label: string;
  accent: AccentTheme;
  className?: string;
}

/** Honest "this could go either way" framing for a near-midpoint or low-confidence result dimension. */
export function MiddleGroundNote({ label, accent, className }: MiddleGroundNoteProps) {
  return (
    <div className={cn("mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground", className)}>
      <Scale className={cn("mt-0.5 size-3.5 shrink-0", accent.text)} />
      <span>You&apos;re close to the middle on {label} — this can feel different depending on context.</span>
    </div>
  );
}
