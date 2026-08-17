"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SkipControlProps {
  onSkip: () => void;
  className?: string;
  label?: string;
}

export function SkipControl({ onSkip, className, label }: SkipControlProps) {
  const t = useTranslations("skipControl");
  return (
    <button
      type="button"
      onClick={onSkip}
      className={cn(
        "mt-4 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className
      )}
    >
      {label ?? t("label")}
    </button>
  );
}
