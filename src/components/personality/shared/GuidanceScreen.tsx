"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

interface GuidanceScreenProps {
  title: string;
  accent: AccentTheme;
  frameworkNote: string;
  onContinue: () => void;
}

export function GuidanceScreen({ title, accent, frameworkNote, onContinue }: GuidanceScreenProps) {
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border bg-card p-7 text-center shadow-[0_24px_50px_-16px_rgba(0,0,0,0.5)] sm:p-10">
        <div className={cn("mx-auto flex size-12 items-center justify-center rounded-2xl", accent.softBg)}>
          <ShieldCheck className={cn("size-6", accent.text)} />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">Before you start {title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Answer based on what you naturally do — not what you think you should do, or what
          you&apos;ve trained yourself to do. There are no good or bad answers here.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{frameworkNote}</p>
        <Button
          size="lg"
          onClick={onContinue}
          className={cn(
            "mt-7 w-full rounded-full bg-gradient-to-r text-white hover:opacity-90",
            accent.gradient
          )}
        >
          Got it, let&apos;s start
        </Button>
      </div>
    </div>
  );
}
