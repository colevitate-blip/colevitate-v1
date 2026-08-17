"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("guidance");
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border bg-card p-7 text-center shadow-[0_24px_50px_-16px_var(--elevation-shadow-sm)] sm:p-10">
        <div className={cn("mx-auto flex size-12 items-center justify-center rounded-2xl", accent.softBg)}>
          <ShieldCheck className={cn("size-6", accent.text)} />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">{t("beforeYouStart", { title })}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("body")}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{frameworkNote}</p>
        <Button
          size="lg"
          onClick={onContinue}
          className={cn(
            "mt-7 w-full rounded-full bg-gradient-to-r text-white hover:opacity-90",
            accent.gradient
          )}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
