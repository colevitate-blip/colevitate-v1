"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Leaf,
  SlidersHorizontal,
  Fingerprint,
  Share2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { accentForFramework } from "@/lib/personality/theme";
import type { PersonalityResults } from "@/lib/personality/types";
import { AxisAgreement } from "@/components/personality/shared/AxisAgreement";
import { ShareCard } from "./ShareCard";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

export function CombinedProfile({
  profile,
  results,
}: {
  profile: CombinedProfileData;
  results: PersonalityResults;
}) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function handleShare() {
    if (!shareCardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(shareCardRef.current, { scale: 2 });
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      const fileName = `personality-studio-${(profile.archetype?.name ?? "profile")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My Personality Studio profile" });
        } catch {
          // user dismissed the share sheet — nothing to do
        }
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Overview
        </Link>
        <Button variant="outline" size="sm" onClick={handleShare} disabled={isExporting} className="rounded-full">
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Share2 className="size-4" />
          )}
          Save / Share
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-[#7c8cff] to-[#37e0c4] opacity-15 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid shrink-0 grid-cols-2 gap-2">
            {profile.threads.map((t) => {
              const accent = accentForFramework(t.id, results);
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

      {profile.archetype ? (
        <div className="mt-8 rounded-3xl border bg-card p-6 text-center shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)] sm:p-8">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7c8cff] to-[#37e0c4] text-white">
            <Fingerprint className="size-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your Archetype
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {profile.archetype.name}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {profile.archetype.description}
          </p>
        </div>
      ) : null}

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)]">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <SlidersHorizontal className="size-4" />
          </div>
          <h2 className="font-semibold">Signal Matrix</h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          Every completed assessment votes on each axis below, weighted by how much that framework
          actually measures it — the composite is a weighted average, not a guess. The dots show
          where each framework landed on its own.
        </p>
        <div className="space-y-7">
          {profile.axes.map((axis) => (
            <AxisAgreement key={axis.id} axis={axis} results={results} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)]">
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

        <div className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)]">
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
          const accent = accentForFramework(t.id, results);
          const meta = ASSESSMENT_CATALOG[t.id];
          return (
            <Link
              key={t.id}
              href={`/${meta.slug}`}
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

      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden>
        <ShareCard ref={shareCardRef} profile={profile} results={results} />
      </div>
    </div>
  );
}
