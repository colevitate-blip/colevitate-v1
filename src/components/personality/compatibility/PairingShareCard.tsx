import { forwardRef } from "react";
import type { Compatibility, AxisCompatibility } from "@/components/personality/combined/computeCompatibility";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

// Same rationale as ShareCard.tsx: html2canvas can't parse the
// color-mix()/oklch() values Tailwind v4 emits, so this card avoids
// Tailwind classes entirely and uses plain hex colors instead.
const BUCKET_HEX: Record<AxisCompatibility["bucket"], string> = {
  aligned: "#10b981",
  different: "#f59e0b",
  opposite: "#f43f5e",
};

const BUCKET_LABEL: Record<AxisCompatibility["bucket"], string> = {
  aligned: "Aligned",
  different: "Different",
  opposite: "Opposite ends",
};

const CARD_PALETTE = {
  dark: {
    background: "linear-gradient(160deg, #0d1224 0%, #05070f 65%)",
    foreground: "#dfe3ff",
    muted: "#8890b8",
    mutedStrong: "#b7bcdd",
    track: "#141a33",
    dotA: "#7c8cff",
    dotB: "#fbbf24",
  },
  light: {
    background: "linear-gradient(160deg, #ffffff 0%, #fafbfc 65%)",
    foreground: "#10131c",
    muted: "#5b6178",
    mutedStrong: "#3d4258",
    track: "#eef0f6",
    dotA: "#6366f1",
    dotB: "#d97706",
  },
} as const;

function positionOf(signal: number): number {
  const clamped = Math.max(-100, Math.min(100, signal));
  return 50 + clamped / 2;
}

function fillRect(score: number): { left: number; width: number } {
  const clamped = Math.max(-100, Math.min(100, score));
  const left = clamped < 0 ? 50 + clamped / 2 : 50;
  const width = Math.abs(clamped) / 2;
  return { left, width };
}

// Rendered off-screen and captured with html2canvas for the pairing report's
// "Share" export — a vertical (9:16) card sized for Stories/Reels, distinct
// from ShareCard.tsx's single-person horizontal export.
export const PairingShareCard = forwardRef<
  HTMLDivElement,
  { compatibility: Compatibility; nameA: string; nameB: string; reportTitle: string; theme?: "light" | "dark" }
>(function PairingShareCard({ compatibility, nameA, nameB, reportTitle, theme = "dark" }, ref) {
  const palette = CARD_PALETTE[theme];
  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: 80,
        display: "flex",
        flexDirection: "column",
        background: palette.background,
        color: palette.foreground,
        fontFamily: "var(--font-space-grotesk), sans-serif",
      }}
    >
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: 2, color: palette.muted, textTransform: "uppercase" }}>
          {reportTitle}
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, marginTop: 18 }}>
          {nameA} <span style={{ color: palette.muted, fontWeight: 500 }}>&amp;</span> {nameB}
        </div>
        <div style={{ fontSize: 26, lineHeight: 1.5, color: palette.mutedStrong, marginTop: 22 }}>
          {compatibility.headline}
        </div>
      </div>

      <div style={{ marginTop: 72, display: "flex", flexDirection: "column", gap: 44 }}>
        {compatibility.axes.map((axis) => {
          const fill = fillRect(axis.scoreA);
          return (
            <div key={axis.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 22, marginBottom: 12 }}>
                <span style={{ fontWeight: 600 }}>{axis.label}</span>
                <span style={{ color: BUCKET_HEX[axis.bucket], fontWeight: 600, fontSize: 17 }}>
                  {BUCKET_LABEL[axis.bucket]}
                </span>
              </div>
              <div style={{ position: "relative", height: 12, borderRadius: 999, background: palette.track }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${fill.left}%`,
                    width: `${fill.width}%`,
                    borderRadius: 999,
                    background: palette.dotA + "40",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${positionOf(axis.scoreA)}%`,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: palette.dotA,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 0 4px ${palette.background === CARD_PALETTE.dark.background ? "#05070f" : "#ffffff"}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${positionOf(axis.scoreB)}%`,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: palette.dotB,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 0 4px ${palette.background === CARD_PALETTE.dark.background ? "#05070f" : "#ffffff"}`,
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: palette.muted, marginTop: 10 }}>
                <span>{axis.leftPole}</span>
                <span>{axis.rightPole}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 60, display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: "linear-gradient(135deg, #7c8cff, #37e0c4)",
          }}
        />
        <span style={{ fontSize: 20, fontWeight: 600 }}>Colevitate</span>
        <span style={{ fontSize: 20, color: palette.muted }}>· Personality Studio</span>
      </div>
    </div>
  );
});
