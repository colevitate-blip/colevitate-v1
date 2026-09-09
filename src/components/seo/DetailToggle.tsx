"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Collapsed-by-default "for the curious" detail panel — same expand pattern as AxisAgreement's "Why this score?" toggle, reused here for exact-number asides that shouldn't crowd the main explanation. */
export function DetailToggle({
  label,
  hideLabel,
  children,
}: {
  label: string;
  hideLabel: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={expanded}
      >
        <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
        {expanded ? hideLabel : label}
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl border bg-muted/30 p-3.5 text-xs leading-relaxed text-muted-foreground">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
