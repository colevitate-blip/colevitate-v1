"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DiscoverCard, type DiscoverCardData } from "@/components/discovery/DiscoverCard";
import { loadMoreDiscoverCards } from "@/app/[locale]/(personality)/discover/actions";
import type { ApproachIntent } from "@/components/discovery/discoveryTypes";

// Once the queue gets this thin, silently top it up in the background so the
// person on top never sees a loading gap before the next card.
const PREFETCH_THRESHOLD = 3;

export function DiscoverFeed({
  initialCards,
  initialNextCursor,
  intentFilter,
}: {
  initialCards: DiscoverCardData[];
  initialNextCursor: string | null;
  intentFilter: ApproachIntent | null;
}) {
  const t = useTranslations("discovery");
  const [cards, setCards] = useState(initialCards);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function advance() {
    setCards((prev) => prev.slice(1));
  }

  useEffect(() => {
    if (cards.length > PREFETCH_THRESHOLD || !nextCursor || fetchingRef.current) return;
    fetchingRef.current = true;
    loadMoreDiscoverCards(nextCursor, intentFilter)
      .then((page) => {
        setCards((prev) => [...prev, ...page.cards]);
        setNextCursor(page.nextCursor);
        setError(null);
      })
      .catch(() => {
        // Stay quiet unless the queue actually runs dry with nothing left to
        // show — otherwise this just retries next time the threshold is hit.
        if (cards.length === 0) setError(t("browse.loadMoreError"));
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  }, [cards.length, nextCursor, intentFilter, t]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      if (document.querySelector('[role="dialog"]')) return;
      const selector = e.key === "ArrowLeft" ? '[data-discover-action="skip"]' : '[data-discover-action="approach"]';
      const button = cardRef.current?.querySelector<HTMLButtonElement>(selector);
      button?.click();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (cards.length === 0) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">{t("browse.empty")}</p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  const current = cards[0];

  return (
    <div ref={cardRef} className="mx-auto max-w-md">
      <DiscoverCard
        key={current.userId}
        profile={current}
        onBlocked={advance}
        onSkipped={advance}
        onApproached={advance}
      />
      {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
