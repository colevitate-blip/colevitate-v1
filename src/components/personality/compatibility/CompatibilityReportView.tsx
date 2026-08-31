"use client";

import { useRef, useState } from "react";
import { GitCompareArrows, Loader2, Share2 } from "lucide-react";
import type { Compatibility } from "@/components/personality/combined/computeCompatibility";
import { computeMatchGauge, frameCompatibility, relationshipFramingFor, type RelationshipType } from "./relationshipFraming";
import { CompatibilityAxisBar } from "./CompatibilityAxisBar";
import { CompatibilityAxisSummary } from "./CompatibilityAxisSummary";
import { MatchGaugeMeter } from "./MatchGaugeMeter";
import { PairingShareCard } from "./PairingShareCard";
import { Button } from "@/components/ui/button";

/**
 * The paid Compatibility Report: relationship-framed axis labels/copy on
 * top of computeCompatibility's framework-agnostic axis math, with the
 * axis row swapped per the invitee's chosen consent level — 'axes' shows
 * the full CompatibilityAxisBar dial (both people's positions), while
 * 'summary_only' shows only the descriptive sentence/bucket, never a
 * numeric score.
 */
export function CompatibilityReportView({
  compatibility,
  nameA,
  nameB,
  relationshipType,
  shareLevel,
}: {
  compatibility: Compatibility;
  nameA: string;
  nameB: string;
  relationshipType: RelationshipType;
  shareLevel: "summary_only" | "axes";
}) {
  const framed = frameCompatibility(compatibility, relationshipType);
  const framing = relationshipFramingFor(relationshipType);
  const matchGauge = computeMatchGauge(framed, relationshipType);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    if (!shareCardRef.current || isSharing) return;
    setIsSharing(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(shareCardRef.current, { scale: 2 });
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      const fileName = `colevitate-${nameA}-${nameB}-compatibility`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .concat(".png");
      const file = new File([blob], fileName, { type: "image/png" });

      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: framing.reportTitle });
        } catch {
          // user dismissed the share sheet — nothing to do
        }
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-6 text-center shadow-[0_30px_70px_-20px_var(--elevation-shadow-lg)] sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] opacity-15 blur-3xl" />
        <div className="relative mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] text-white">
          <GitCompareArrows className="size-5" />
        </div>
        <p className="relative text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {framing.reportTitle}
        </p>
        <h1 className="relative mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{framed.headline}</h1>
        <p className="relative mt-2 text-sm text-muted-foreground">{framing.aboutClause(nameA, nameB)}</p>
        {matchGauge && <MatchGaugeMeter gauge={matchGauge} />}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          disabled={isSharing}
          className="relative mt-5 rounded-full"
        >
          {isSharing ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" />}
          Share as image
        </Button>
      </div>

      <div style={{ position: "absolute", left: -99999, top: 0 }} aria-hidden>
        <PairingShareCard
          ref={shareCardRef}
          compatibility={framed}
          nameA={nameA}
          nameB={nameB}
          reportTitle={framing.reportTitle}
        />
      </div>

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
        <div className="space-y-7">
          {framed.axes.map((axis) =>
            shareLevel === "axes" ? (
              <CompatibilityAxisBar key={axis.id} axis={axis} nameA={nameA} nameB={nameB} />
            ) : (
              <CompatibilityAxisSummary key={axis.id} axis={axis} />
            )
          )}
        </div>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This comparison is a rule-based read of where two combined profiles land relative to each
        other — meant to surface interesting overlaps and contrasts for conversation, not a
        scientific compatibility score.
      </p>
    </div>
  );
}
