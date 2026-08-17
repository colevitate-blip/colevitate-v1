"use client";

import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { AssessmentId, PersonalityResults } from "@/lib/personality/types";
import { MBTI_CONTENT } from "@/components/personality/mbti/content";
import { summarizeBigFive } from "@/components/personality/bigfive/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";

interface OneResultSummary {
  name: string;
  tagline: string;
  description: string;
}

function summarizeOne(id: AssessmentId, results: PersonalityResults): OneResultSummary | null {
  if (id === "mbti" && results.mbti) {
    const c = MBTI_CONTENT[results.mbti.type];
    return { name: `${results.mbti.type} · ${c.name}`, tagline: c.tagline, description: c.description };
  }
  if (id === "bigfive" && results.bigfive) {
    const s = summarizeBigFive(results.bigfive);
    return { name: s.name, tagline: s.tagline, description: s.description };
  }
  if (id === "humandesign" && results.humandesign) {
    const c = HD_CONTENT[results.humandesign.type];
    return { name: c.name, tagline: c.tagline, description: c.description };
  }
  if (id === "colors" && results.colors) {
    const c = COLOR_CONTENT[results.colors.dominant];
    return { name: c.name, tagline: c.tagline, description: c.description };
  }
  return null;
}

/** Shown after the very first completed assessment — a taste of the payoff before asking for 3 more. */
export function PartialProfilePreview({
  completedId,
  results,
}: {
  completedId: AssessmentId;
  results: PersonalityResults;
}) {
  const meta = ASSESSMENT_CATALOG[completedId];
  const accent = ASSESSMENT_THEME[completedId];
  const summary = summarizeOne(completedId, results);
  const remaining = ASSESSMENT_ORDER.filter((id) => id !== completedId);
  const nextId = remaining[0];
  const nextMeta = ASSESSMENT_CATALOG[nextId];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Overview
      </Link>

      <div className="text-center">
        <Badge variant="outline" className="rounded-full">
          1 of 4 complete
        </Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Here&apos;s what we already know about you
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          The full combined profile weaves all four frameworks together — but your{" "}
          {meta.label} result already tells part of the story.
        </p>
      </div>

      {summary ? (
        <div
          className={cn(
            "mt-8 overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_50px_-16px_var(--elevation-shadow-sm)] sm:p-8",
            accent.softBg
          )}
        >
          <Badge variant="outline" className={cn("mb-2 rounded-full", accent.border, accent.text)}>
            {meta.label}
          </Badge>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{summary.name}</h2>
          <p className={cn("mt-1 text-sm font-medium sm:text-base", accent.text)}>{summary.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90">{summary.description}</p>
        </div>
      ) : null}

      <div className="mt-8 rounded-3xl border bg-card p-6 text-center shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)] sm:p-8">
        <Sparkles className="mx-auto size-6 text-muted-foreground" />
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Complete {nextMeta.label} next to start seeing how your frameworks agree — and where
          they diverge.
        </p>
        <Button
          asChild
          size="lg"
          className={cn("mt-5 rounded-full bg-gradient-to-r text-white hover:opacity-90", accent.gradient)}
        >
          <Link href={`/${nextMeta.slug}`}>
            Continue with {nextMeta.label}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
