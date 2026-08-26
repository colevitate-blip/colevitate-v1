import { MousePointer2 } from "lucide-react";

// Every glyph here is a miniature of the real mark it explains — same
// stroke weight, same opacity, same shape — so the legend reads as "this is
// what you're already looking at, decoded" instead of a separate abstract
// key the viewer has to translate. That match is what makes a legend
// trustworthy at a glance instead of something people skip past.

function SizeGlyph() {
  return (
    <span className="inline-flex w-4 items-center justify-center gap-0.5">
      <span className="inline-block size-1.5 rounded-full bg-foreground/60" />
      <span className="inline-block size-3 rounded-full bg-foreground/60" />
    </span>
  );
}

function LineGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="text-foreground/50" aria-hidden>
      <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function QuadrantGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="text-foreground/40" aria-hidden>
      <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" />
      <circle cx="4.5" cy="4.5" r="1.6" className="fill-foreground/70" />
    </svg>
  );
}

/**
 * Always-visible reading key for the personality graph — deliberately not
 * gated behind a hover or an info icon. A legend nobody sees might as well
 * not exist, and the one thing this graph can't explain about itself is
 * what its own visual encoding means (size, lines, position, and how to dig
 * deeper), so that's exactly what this covers and nothing else.
 */
export function GraphLegend({ quadrantMode }: { quadrantMode: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <SizeGlyph />
        Size = how central to your profile
      </div>
      <div className="flex items-center gap-1.5">
        <LineGlyph />
        Lines = what feeds what
      </div>
      {quadrantMode ? (
        <div className="flex items-center gap-1.5">
          <QuadrantGlyph />
          Position = which of your 4 spectrums
        </div>
      ) : null}
      <div className="flex items-center gap-1.5">
        <MousePointer2 className="size-3.5 text-foreground/40" aria-hidden />
        Hover any dot for details
      </div>
    </div>
  );
}
