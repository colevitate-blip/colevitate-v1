"use client";

import { cn } from "@/lib/utils";

interface SkipControlProps {
  onSkip: () => void;
  className?: string;
  label?: string;
}

export function SkipControl({ onSkip, className, label = "Not sure / doesn't apply — skip this one" }: SkipControlProps) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className={cn(
        "mt-4 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className
      )}
    >
      {label}
    </button>
  );
}
