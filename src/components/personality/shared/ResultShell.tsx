"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, RotateCcw, Sparkles, TrendingUp, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

interface ResultShellProps {
  eyebrow: string;
  typeName: string;
  tagline: string;
  description: string;
  strengths: string[];
  growth: string[];
  accent: AccentTheme;
  badge: ReactNode;
  onRetake: () => void;
  extra?: ReactNode;
  footnote?: string;
}

export function ResultShell({
  eyebrow,
  typeName,
  tagline,
  description,
  strengths,
  growth,
  accent,
  badge,
  onRetake,
  extra,
  footnote,
}: ResultShellProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/personality"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Overview
        </Link>
        <Button variant="ghost" size="sm" onClick={onRetake} className="rounded-full">
          <RotateCcw className="size-3.5" />
          Retake
        </Button>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-[2.5rem] border p-6 shadow-sm sm:p-10",
          accent.softBg
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
            accent.gradient
          )}
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {badge}
          <div>
            <Badge variant="outline" className={cn("mb-2 rounded-full", accent.border, accent.text)}>
              {eyebrow}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{typeName}</h1>
            <p className={cn("mt-1 text-base font-medium sm:text-lg", accent.text)}>{tagline}</p>
          </div>
        </div>

        <p className="relative mt-8 max-w-2xl text-base leading-relaxed text-foreground/90">
          {description}
        </p>

        {extra ? <div className="relative mt-8">{extra}</div> : null}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className={cn("flex size-8 items-center justify-center rounded-full", accent.softBg)}>
              <TrendingUp className={cn("size-4", accent.text)} />
            </div>
            <h2 className="font-semibold">Strengths</h2>
          </div>
          <ul className="space-y-2.5">
            {strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className={cn("mt-0.5 size-3.5 shrink-0", accent.text)} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className={cn("flex size-8 items-center justify-center rounded-full", accent.softBg)}>
              <Leaf className={cn("size-4", accent.text)} />
            </div>
            <h2 className="font-semibold">Growth areas</h2>
          </div>
          <ul className="space-y-2.5">
            {growth.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className={cn("mt-0.5 size-3.5 shrink-0", accent.text)} />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {footnote ? (
        <>
          <Separator className="my-8" />
          <p className="text-xs leading-relaxed text-muted-foreground">{footnote}</p>
        </>
      ) : null}
    </div>
  );
}
