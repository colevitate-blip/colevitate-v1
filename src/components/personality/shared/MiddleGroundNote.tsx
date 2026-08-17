"use client";

import { useTranslations } from "next-intl";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

type MiddleGroundNoteProps = { accent: AccentTheme; className?: string } & (
  | { poleA: string; poleB: string; label?: never }
  // Legacy shape used by frameworks not yet translated (Big Five, Human Design, Colors) —
  // renders a fixed English sentence around a pre-joined "A / B" string.
  | { label: string; poleA?: never; poleB?: never }
);

/** Honest "this could go either way" framing for a near-midpoint or low-confidence result dimension. */
export function MiddleGroundNote({ accent, className, ...props }: MiddleGroundNoteProps) {
  const t = useTranslations("middleGroundNote");
  const body =
    "poleA" in props && props.poleA !== undefined
      ? t("body", { poleA: props.poleA, poleB: props.poleB })
      : `You're close to the middle on ${"label" in props ? props.label : ""} — this can feel different depending on context.`;
  return (
    <div className={cn("mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground", className)}>
      <Scale className={cn("mt-0.5 size-3.5 shrink-0", accent.text)} />
      <span>{body}</span>
    </div>
  );
}
