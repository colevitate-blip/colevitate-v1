import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";
import type { LucideIcon } from "lucide-react";

interface AssessmentCardProps {
  href: string;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  questionCount: number;
  accent: AccentTheme;
  status: "not-started" | "in-progress" | "completed";
  resultSummary?: string;
}

export function AssessmentCard({
  href,
  label,
  tagline,
  description,
  icon: Icon,
  questionCount,
  accent,
  status,
  resultSummary,
}: AssessmentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)] transition-all duration-300 [transform-style:preserve-3d] hover:-translate-y-1 hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.6)] hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateY(-4px)] sm:p-7"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          accent.gradient
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className={cn("flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm", accent.gradient)}>
          <Icon className="size-6" />
        </div>
        {status === "completed" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Complete
          </span>
        ) : status === "in-progress" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <CircleDot className="size-3.5" />
            In progress
          </span>
        ) : null}
      </div>

      <h3 className="relative mt-5 text-lg font-semibold tracking-tight">{label}</h3>
      <p className={cn("relative text-sm font-medium", accent.text)}>{tagline}</p>
      <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="relative mt-6 flex items-center justify-between border-t pt-4 text-sm">
        {status === "completed" && resultSummary ? (
          <span className="font-semibold">{resultSummary}</span>
        ) : (
          <span className="text-muted-foreground">{questionCount} questions · ~3 min</span>
        )}
        <span className={cn("inline-flex items-center gap-1 font-medium transition-transform group-hover:translate-x-0.5", accent.text)}>
          {status === "completed" ? "View result" : status === "in-progress" ? "Continue" : "Start"}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
