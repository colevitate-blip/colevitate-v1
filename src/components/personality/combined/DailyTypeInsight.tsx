"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

/** Small retention nudge (Tier 3.2, see prompt.md): one cached-per-day sentence for the visitor's archetype, fetched client-side so the server-rendered profile page never blocks on it. */
export function DailyTypeInsight({ archetypeKey, archetypeName }: { archetypeKey: string; archetypeName: string }) {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/daily-type-content?key=${encodeURIComponent(archetypeKey)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data?.content === "string") setContent(data.content);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [archetypeKey]);

  if (!content) return null;

  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-2xl border bg-muted/20 p-4">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Today, for {archetypeName}</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/90">{content}</p>
      </div>
    </div>
  );
}
