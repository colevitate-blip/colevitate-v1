"use client";

import { useState } from "react";
import Image from "next/image";
import type { FamousPersonContent } from "@/lib/seo/famousPeopleContent";

// Minimal, abstract bust silhouettes — no stock-photo dependency, so no new
// external host/licensing/hotlinking risk on top of the Wikimedia one this
// is a fallback for. Differentiated only by a simple hair shape, the same
// convention most icon sets use for a generic man/woman glyph.
const SILHOUETTES: Record<FamousPersonContent["gender"], React.ReactNode> = {
  man: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0v1H4v-1z" />
    </>
  ),
  woman: (
    <>
      <path d="M12 3a5.5 5.5 0 0 0-5.5 5.5c0 1.7.4 3.6 1.1 5.2a.75.75 0 0 0 1.4-.6c-.6-1.4-1-3-1-4.3a4 4 0 0 1 8 0c0 1.3-.4 2.9-1 4.3a.75.75 0 0 0 1.4.6c.7-1.6 1.1-3.5 1.1-5.2A5.5 5.5 0 0 0 12 3z" />
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4 20a8 8 0 0 1 16 0v1H4v-1z" />
    </>
  ),
};

/** Circular avatar that falls back to a gender-matched silhouette when there's no photo, or the photo fails to load (e.g. the Wikimedia upstream rate-limits under a burst of requests — see /people load, 2026-08-28). */
export function PersonAvatar({ person, size = 36 }: { person: FamousPersonContent; size?: number }) {
  const [errored, setErrored] = useState(false);
  const showPhoto = person.photo && !errored;

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border bg-muted"
      style={{ width: size, height: size }}
    >
      {showPhoto ? (
        <Image
          src={person.photo!.url}
          alt={person.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 h-full w-full p-[15%] text-muted-foreground/50" aria-hidden>
          {SILHOUETTES[person.gender]}
        </svg>
      )}
    </div>
  );
}

/** Same fallback behavior as PersonAvatar, but full-bleed for a rectangular tile (e.g. the portrait-wall layout) instead of a fixed circular crop. */
export function PersonPortrait({ person, sizes, className }: { person: FamousPersonContent; sizes: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  const showPhoto = person.photo && !errored;

  return showPhoto ? (
    <Image
      src={person.photo!.url}
      alt={person.name}
      fill
      sizes={sizes}
      className={className}
      onError={() => setErrored(true)}
    />
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 h-full w-full bg-muted p-[22%] text-muted-foreground/50" aria-hidden>
      {SILHOUETTES[person.gender]}
    </svg>
  );
}
