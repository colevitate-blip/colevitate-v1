"use client";

import * as React from "react";
import { GridCardsLayout } from "./peopleLayouts/GridCardsLayout";
import { CompactRowsLayout } from "./peopleLayouts/CompactRowsLayout";
import { PortraitWallLayout } from "./peopleLayouts/PortraitWallLayout";

// Same pattern as ExperimentsShowcaseClient (design-concept tabs, localStorage-
// persisted, all panels mounted but hidden except the active one so switching
// is instant) — reused here rather than a plain on/off toggle since there are
// three concepts to compare, not two.
const STORAGE_KEY = "personality-studio.experiments.people-layouts";

interface Concept {
  key: string;
  label: string;
  description: string;
  Panel: React.ComponentType;
}

const CONCEPTS: Concept[] = [
  { key: "grid", label: "Photo Grid", description: "Card grid, circular portrait + name", Panel: GridCardsLayout },
  { key: "rows", label: "Compact Rows", description: "Dense list, thumbnail inline with name", Panel: CompactRowsLayout },
  { key: "wall", label: "Portrait Wall", description: "Larger portrait tiles, name overlaid", Panel: PortraitWallLayout },
];

export function PeopleLayoutsShowcaseClient() {
  const [active, setActive] = React.useState("grid");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // Deliberate: restores the saved tab post-mount so SSR/first paint stays
    // locale-independent of localStorage (unavailable on the server), rather
    // than reading it in the initializer and risking a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && CONCEPTS.some((c) => c.key === saved)) setActive(saved);
    setMounted(true);
  }, []);

  function switchTo(key: string) {
    setActive(key);
    window.localStorage.setItem(STORAGE_KEY, key);
  }

  const activeConcept = CONCEPTS.find((c) => c.key === active) ?? CONCEPTS[0];

  return (
    <div>
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
          <span className="text-xs font-semibold text-muted-foreground">Layout:</span>
          <div role="tablist" aria-label="People page layout concepts" className="flex flex-wrap gap-2">
            {CONCEPTS.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active === c.key}
                onClick={() => switchTo(c.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active === c.key ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-muted-foreground" suppressHydrationWarning>
            {mounted ? activeConcept.description : ""}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Famous People & Their Personality Types</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Our editorial take on how well-known figures across science, literature, entertainment, and politics might
          type — grounded in public behavior and biography, never presented as their own result or as fact.
        </p>

        {/* Unmounted, not hidden: each panel fires ~36 real Wikimedia image
            requests, and keeping all three mounted-but-hidden (the pattern
            ExperimentsShowcaseClient uses for its lightweight CSS panels)
            fired 108 concurrent requests on first load here and got rate-
            limited (HTTP 429) by Wikimedia. Only the active one renders. */}
        <div className="mt-8">
          <activeConcept.Panel />
        </div>
      </main>
    </div>
  );
}
