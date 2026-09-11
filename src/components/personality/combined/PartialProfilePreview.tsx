"use client";

import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { AssessmentId, PersonalityResults } from "@/lib/personality/types";
import { summarizeBigFiveTranslated } from "@/components/personality/bigfive/content";
import type { Translator } from "@/components/personality/combined/scoringMatrix";

interface OneResultSummary {
  name: string;
  tagline: string;
  description: string;
}

function summarizeOne(id: AssessmentId, results: PersonalityResults, t: Translator): OneResultSummary | null {
  if (id === "mbti" && results.mbti) {
    const type = results.mbti.type;
    return {
      name: `${type} · ${t(`mbti.types.${type}.name`)}`,
      tagline: t(`mbti.types.${type}.tagline`),
      description: t(`mbti.types.${type}.description`),
    };
  }
  if (id === "bigfive" && results.bigfive) {
    const s = summarizeBigFiveTranslated(results.bigfive, t);
    return { name: s.name, tagline: s.tagline, description: s.description };
  }
  if (id === "humandesign" && results.humandesign) {
    const type = results.humandesign.type;
    return {
      name: t(`humandesign.types.${type}.name`),
      tagline: t(`humandesign.types.${type}.tagline`),
      description: t(`humandesign.types.${type}.description`),
    };
  }
  if (id === "colors" && results.colors) {
    const dominant = results.colors.dominant;
    return {
      name: t(`colors.types.${dominant}.name`),
      tagline: t(`colors.types.${dominant}.tagline`),
      description: t(`colors.types.${dominant}.description`),
    };
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
  const t = useTranslations();
  const meta = ASSESSMENT_CATALOG[completedId];
  const accent = ASSESSMENT_THEME[completedId];
  const summary = summarizeOne(completedId, results, t);
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
        {t("combined.ui.overview")}
      </Link>

      <div className="text-center">
        <Badge variant="outline" className="rounded-full">
          {t("combined.ui.partial.oneOfFourComplete")}
        </Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("combined.ui.partial.alreadyKnowTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("combined.ui.partial.alreadyKnowBody", { label: meta.label })}
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
          {t("combined.ui.partial.completeNext", { label: nextMeta.label })}
        </p>
        <Button
          asChild
          size="lg"
          className={cn("mt-5 rounded-full bg-gradient-to-r text-white hover:opacity-90", accent.gradient)}
        >
          <Link href={`/${nextMeta.slug}`}>
            {t("combined.ui.partial.continueWith", { label: nextMeta.label })}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
