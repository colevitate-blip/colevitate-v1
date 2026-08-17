import { GitCompareArrows } from "lucide-react";
import type { Compatibility } from "@/components/personality/combined/computeCompatibility";
import { CompatibilityAxisBar } from "./CompatibilityAxisBar";

export function CompatibilityView({
  compatibility,
  nameA,
  nameB,
}: {
  compatibility: Compatibility;
  nameA: string;
  nameB: string;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-6 text-center shadow-[0_30px_70px_-20px_var(--elevation-shadow-lg)] sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] opacity-15 blur-3xl" />
        <div className="relative mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] text-white">
          <GitCompareArrows className="size-5" />
        </div>
        <p className="relative text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {nameA} &amp; {nameB}
        </p>
        <h1 className="relative mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {compatibility.headline}
        </h1>
      </div>

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
        <div className="space-y-7">
          {compatibility.axes.map((axis) => (
            <CompatibilityAxisBar key={axis.id} axis={axis} nameA={nameA} nameB={nameB} />
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This comparison is a rule-based read of where two combined profiles land relative to each
        other — meant to surface interesting overlaps and contrasts for conversation, not a
        scientific compatibility score.
      </p>
    </div>
  );
}
