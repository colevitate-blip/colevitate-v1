"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * One framework's card on /types: a short "how it works" blurb (so a visitor
 * hits that before the raw list of sub-types, not after) plus its type pills.
 * Pills past `previewCount` start collapsed — 16 MBTI or 10 Big Five pills
 * dumped flat under a heading is the "overwhelming on mobile" complaint this
 * exists to fix; smaller frameworks (Human Design, Colors) never hit the
 * threshold so they render exactly as before, no toggle.
 */
export function FrameworkTypesCard({
  tagline,
  label,
  intro,
  learnHref,
  pills,
  previewCount = 8,
}: {
  tagline: string;
  label: string;
  intro: string;
  learnHref: string;
  pills: { href: string; label: string }[];
  previewCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = pills.length > previewCount;
  const visiblePills = hasMore ? pills.slice(0, previewCount) : pills;
  const restPills = hasMore ? pills.slice(previewCount) : [];

  return (
    <div className="rounded-3xl border bg-card p-6">
      <Badge variant="outline" className="w-fit rounded-full">
        {tagline}
      </Badge>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{label}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      <Link
        href={learnHref}
        className="mt-2 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        How {label} works →
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        {visiblePills.map((pill) => (
          <Link
            key={pill.href}
            href={pill.href}
            className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            {pill.label}
          </Link>
        ))}
      </div>

      {hasMore ? (
        <>
          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex flex-wrap gap-2">
                  {restPills.map((pill) => (
                    <Link
                      key={pill.href}
                      href={pill.href}
                      className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
                    >
                      {pill.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
            {expanded ? "Show fewer" : `Show all ${pills.length}`}
          </button>
        </>
      ) : null}
    </div>
  );
}
