"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AssessmentCard } from "@/components/personality/landing/AssessmentCard";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { AssessmentId } from "@/lib/personality/types";
import { summarizeBigFive } from "@/components/personality/bigfive/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";

function useResultSummaryFor() {
  const tMbti = useTranslations("mbti");
  return (id: AssessmentId, results: ReturnType<typeof usePersonality>["results"]) => {
    if (id === "mbti" && results.mbti) {
      return `${results.mbti.type} · ${tMbti(`types.${results.mbti.type}.name`)}`;
    }
    if (id === "bigfive" && results.bigfive) {
      return summarizeBigFive(results.bigfive).name;
    }
    if (id === "humandesign" && results.humandesign) {
      return HD_CONTENT[results.humandesign.type].name;
    }
    if (id === "colors" && results.colors) {
      return COLOR_CONTENT[results.colors.dominant].name;
    }
    return undefined;
  };
}

export default function PersonalityLandingPage() {
  const { mounted, results, progress, completedIds } = usePersonality();
  const t = useTranslations("landing");
  const tAssessments = useTranslations("assessments");
  const resultSummaryFor = useResultSummaryFor();

  const canCombine = completedIds.length >= 1;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:pt-20">
      <section className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          <Sparkles className="size-3.5" />
          {t("eyebrow")}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("titleLead")}{" "}
          <span className="text-primary">
            {t("titleAccent")}
          </span>
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>
      </section>

      <section className="mt-14 grid gap-5 sm:grid-cols-2">
        {ASSESSMENT_ORDER.map((id) => {
          const meta = ASSESSMENT_CATALOG[id];
          const status = mounted && results[id] ? "completed" : mounted && progress[id] ? "in-progress" : "not-started";
          return (
            <AssessmentCard
              key={id}
              href={`/${meta.slug}`}
              label={tAssessments(`${id}.label`)}
              tagline={tAssessments(`${id}.tagline`)}
              description={tAssessments(`${id}.description`)}
              icon={meta.icon}
              questionCount={meta.questionCount}
              accent={ASSESSMENT_THEME[id]}
              status={status}
              resultSummary={mounted ? resultSummaryFor(id, results) : undefined}
            />
          );
        })}
      </section>

      <section className="mt-14 overflow-hidden rounded-[2.5rem] border bg-gradient-to-br from-[var(--spatial-glow)]/[0.08] to-[var(--spatial-glow-2)]/[0.06] bg-card p-8 text-center shadow-[0_30px_70px_-20px_var(--elevation-shadow-lg)] sm:p-12">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("combined.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("combined.body", { count: mounted ? completedIds.length : 0 })}
          </p>

          <div className="mt-6 flex items-center justify-center gap-1.5">
            {ASSESSMENT_ORDER.map((id) => (
              <span
                key={id}
                className={`size-2.5 rounded-full transition-colors ${
                  mounted && results[id] ? "bg-gradient-to-br " + ASSESSMENT_THEME[id].gradient : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            asChild
            size="lg"
            disabled={!canCombine}
            className="mt-7 rounded-full bg-gradient-to-r from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] text-[#05070f] shadow-[0_16px_34px_-8px_var(--hero-glow-1)] hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <Link href={canCombine ? "/combined" : "#"}>
              {t("combined.cta", { count: completedIds.length })}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[2.5rem] border bg-card p-8 text-center sm:p-12">
        <div className="mx-auto max-w-xl">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Users className="size-5 text-primary" />
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{t("pairing.title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("pairing.body")}</p>

          <Button asChild size="lg" variant="outline" className="mt-7 rounded-full">
            <Link href="/combined">
              {t("pairing.cta")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
