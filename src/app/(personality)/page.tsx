"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssessmentCard } from "@/components/personality/landing/AssessmentCard";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { AssessmentId } from "@/lib/personality/types";
import { MBTI_CONTENT } from "@/components/personality/mbti/content";
import { summarizeBigFive } from "@/components/personality/bigfive/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";

function resultSummaryFor(id: AssessmentId, results: ReturnType<typeof usePersonality>["results"]) {
  if (id === "mbti" && results.mbti) {
    return `${results.mbti.type} · ${MBTI_CONTENT[results.mbti.type]?.name ?? ""}`;
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
}

export default function PersonalityLandingPage() {
  const { mounted, results, progress, completedIds } = usePersonality();

  const canCombine = completedIds.length >= 2;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:pt-20">
      <section className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#9fa8ff]">
          <Sparkles className="size-3.5" />
          Four frameworks, one profile
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Know yourself,{" "}
          <span className="bg-gradient-to-r from-[#7c8cff] to-[#37e0c4] bg-clip-text text-transparent">
            from every angle
          </span>
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          Take any combination of four well-known personality frameworks — each just a few
          minutes — and weave the results into one combined profile of who you are.
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
              label={meta.label}
              tagline={meta.tagline}
              description={meta.description}
              icon={meta.icon}
              questionCount={meta.questionCount}
              accent={ASSESSMENT_THEME[id]}
              status={status}
              resultSummary={mounted ? resultSummaryFor(id, results) : undefined}
            />
          );
        })}
      </section>

      <section className="mt-14 overflow-hidden rounded-[2.5rem] border bg-gradient-to-br from-[#7c8cff]/[0.08] to-[#37e0c4]/[0.06] bg-card p-8 text-center shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)] sm:p-12">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your Combined Profile
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {mounted
              ? canCombine
                ? `You've completed ${completedIds.length} of 4 assessments. Generate a single, cohesive profile that weaves your results together.`
                : `Complete at least 2 assessments to unlock a combined profile. You've finished ${completedIds.length} so far.`
              : "Complete at least 2 assessments to unlock a combined profile."}
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
            className="mt-7 rounded-full bg-gradient-to-r from-[#7c8cff] to-[#37e0c4] text-[#05070f] shadow-[0_16px_34px_-8px_rgba(124,140,255,0.5)] hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <Link href={canCombine ? "/combined" : "#"}>
              Generate Combined Profile
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
