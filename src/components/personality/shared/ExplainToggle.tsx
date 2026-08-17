"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplainToggleProps {
  example: string;
  className?: string;
}

export function ExplainToggle({ example, className }: ExplainToggleProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("explainToggle");

  return (
    <div className={cn("mt-2", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <HelpCircle className="size-3.5" />
        {open ? t("hide") : t("show")}
      </button>
      {open ? (
        <p className="mt-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
          {example}
        </p>
      ) : null}
    </div>
  );
}
