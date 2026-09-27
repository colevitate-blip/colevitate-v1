"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A list that shows `previewCount` items and hides the rest behind a
 * "Show all N" toggle. Extracted from FrameworkTypesCard, which had this
 * inline, once the /learn hub grew a second long list (81 combination cards)
 * that needed the same treatment: two collapses sitting on one page have to
 * animate and read identically, and that only stays true if there's one
 * implementation.
 *
 * `items` are ReactNodes rather than data plus a render callback, so a server
 * component can hand over already-rendered <Link>s — a function prop wouldn't
 * cross the boundary. Each item needs its own key, as in any list.
 *
 * The two rows take their classes separately and in full rather than sharing
 * one string: they need the same layout (a flex-wrap of pills in one case, a
 * two-column grid of cards in the other) but different top margins, and
 * merging a shared base with an override leaves the winning margin up to
 * tailwind-merge's conflict rules. Spelling both out keeps it obvious.
 *
 * Below the threshold it renders a plain container and no toggle, so callers
 * with short lists (Human Design's 4 types, Colors' 4) are unaffected.
 */
export function ExpandableList({
  items,
  previewCount,
  previewClassName,
  restClassName,
  toggleClassName,
}: {
  items: ReactNode[];
  previewCount: number;
  previewClassName?: string;
  restClassName?: string;
  toggleClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > previewCount;
  const visible = hasMore ? items.slice(0, previewCount) : items;
  const rest = hasMore ? items.slice(previewCount) : [];

  return (
    <>
      <div className={previewClassName}>{visible}</div>

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
                <div className={restClassName}>{rest}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={cn(
              "flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              toggleClassName
            )}
          >
            <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
            {expanded ? "Show fewer" : `Show all ${items.length}`}
          </button>
        </>
      ) : null}
    </>
  );
}
