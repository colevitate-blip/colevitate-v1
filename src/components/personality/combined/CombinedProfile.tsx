"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles, TrendingUp, Leaf, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { ASSESSMENT_THEME, COLOR_THEME } from "@/lib/personality/theme";
import type { PersonalityResults } from "@/lib/personality/types";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

function accentFor(id: CombinedProfileData["threads"][number]["id"], results: PersonalityResults) {
  if (id === "colors" && results.colors) return COLOR_THEME[results.colors.dominant];
  return ASSESSMENT_THEME[id];
}

export function CombinedProfile({
  profile,
  results,
}: {
  profile: CombinedProfileData;
  results: PersonalityResults;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          href="/personality"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Overview
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-6 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 opacity-10 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid shrink-0 grid-cols-2 gap-2">
            {profile.threads.map((t) => {
              const accent = accentFor(t.id, results);
              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex size-14 items-center justify-center rounded-2xl text-xs font-bold text-white shadow sm:size-16",
                    accent.solid
                  )}
                >
                  {t.code}
                </div>
              );
            })}
          </div>
          <div>
            <Badge variant="outline" className="mb-2 rounded-full">
              Combined Profile
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{profile.headline}</h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
              {profile.subtitle}
            </p>
          </div>
        </div>

        <div className="relative mt-8 space-y-4">
          {profile.narrative.map((p, i) => (
            <p key={i} className="max-w-2xl text-base leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border bg-card p-6">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <SlidersHorizontal className="size-4" />
          </div>
          <h2 className="font-semibold">Signal Matrix</h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          Every completed assessment votes on each axis below, weighted by how much that framework
          actually measures it — the composite is a weighted average, not a guess.
        </p>
        <div className="space-y-5">
          {profile.axes.map((axis) => {
            const clamped = Math.max(-100, Math.min(100, axis.score));
            const fillLeft = clamped < 0 ? 50 + clamped / 2 : 50;
            const fillWidth = Math.abs(clamped) / 2;
            return (
              <div key={axis.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{axis.label}</span>
                  <span className="text-xs text-muted-foreground">{axis.tierLabel}</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted">
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                  <div
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500"
                    style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{axis.leftPole}</span>
                  <span>{axis.rightPole}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <TrendingUp className="size-4" />
            </div>
            <h2 className="font-semibold">Strengths</h2>
          </div>
          <ul className="space-y-2.5">
            {profile.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <Leaf className="size-4" />
            </div>
            <h2 className="font-semibold">Growth areas</h2>
          </div>
          <ul className="space-y-2.5">
            {profile.growth.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-4 text-lg font-semibold">The threads behind this profile</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {profile.threads.map((t) => {
          const accent = accentFor(t.id, results);
          const meta = ASSESSMENT_CATALOG[t.id];
          return (
            <Link
              key={t.id}
              href={`/personality/${meta.slug}`}
              className={cn(
                "rounded-2xl border p-5 transition-colors hover:bg-muted/50",
                accent.border
              )}
            >
              <span className={cn("text-xs font-medium", accent.text)}>{t.label}</span>
              <p className="mt-1 font-semibold">{t.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{t.tagline}</p>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This combined profile is a rule-based synthesis of your individual results, meant to surface
        interesting overlaps and contrasts for self-reflection — not a scientific composite score.
      </p>
    </div>
  );
}
