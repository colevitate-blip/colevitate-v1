import { forwardRef } from "react";
import type { AssessmentId, ColorId, PersonalityResults } from "@/lib/personality/types";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

const CARD_WIDTH = 1080;

// html2canvas can't parse the color-mix()/oklch() values Tailwind v4 emits
// for its palette, so the export card avoids Tailwind color classes
// entirely and uses these plain hex equivalents instead (matching the
// Tailwind swatches used by ASSESSMENT_THEME / COLOR_THEME elsewhere).
const FRAMEWORK_HEX: Record<AssessmentId, string> = {
  mbti: "#8b5cf6",
  bigfive: "#10b981",
  humandesign: "#d946ef",
  colors: "#f59e0b",
};

const COLOR_HEX: Record<ColorId, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#fbbf24",
};

function hexForThread(id: AssessmentId, results: PersonalityResults): string {
  if (id === "colors" && results.colors) return COLOR_HEX[results.colors.dominant];
  return FRAMEWORK_HEX[id];
}

// html2canvas can't read CSS custom properties, so the card's own
// background/text/track palette is duplicated here per theme (kept in sync
// with the --background/--foreground/--muted-foreground/--secondary/
// --spatial-glow* values in src/app/globals.css).
const CARD_PALETTE = {
  dark: {
    background: "linear-gradient(160deg, #0d1224 0%, #05070f 65%)",
    foreground: "#dfe3ff",
    muted: "#8890b8",
    mutedStrong: "#b7bcdd",
    track: "#141a33",
    gradient: "linear-gradient(90deg, #7c8cff, #37e0c4)",
  },
  light: {
    background: "linear-gradient(160deg, #ffffff 0%, #fafbfc 65%)",
    foreground: "#10131c",
    muted: "#5b6178",
    mutedStrong: "#3d4258",
    track: "#eef0f6",
    gradient: "linear-gradient(90deg, #6366f1, #0d9488)",
  },
} as const;

// Rendered off-screen and captured with html2canvas for the "Save / Share"
// export. Every style here is inline and uses plain hex/rgb colors rather
// than Tailwind utility classes — html2canvas can't parse the oklch-based
// color functions Tailwind v4 emits for opacity modifiers, so this stays
// deliberately isolated from the app's normal styling path.
export const ShareCard = forwardRef<
  HTMLDivElement,
  { profile: CombinedProfileData; results: PersonalityResults; theme?: "light" | "dark" }
>(function ShareCard({ profile, results, theme = "dark" }, ref) {
  const palette = CARD_PALETTE[theme];
  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        padding: 72,
        display: "flex",
        flexDirection: "column",
        background: palette.background,
        color: palette.foreground,
        fontFamily: "var(--font-space-grotesk), sans-serif",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 40,
          }}
        >
          {profile.threads.map((t) => (
            <div
              key={t.id}
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "#ffffff",
                background: hexForThread(t.id, results),
              }}
            >
              {t.code}
            </div>
          ))}
        </div>

        {profile.archetype ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 2, color: palette.muted, textTransform: "uppercase" }}>
              Your Archetype
            </div>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginTop: 12, letterSpacing: -1 }}>
              {profile.archetype.name}
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.5, color: palette.mutedStrong, marginTop: 20, maxWidth: 820 }}>
              {profile.archetype.description}
            </div>
          </>
        ) : null}
      </div>

      <div style={{ marginTop: 64 }}>
        {profile.axes.map((axis) => {
          const clamped = Math.max(-100, Math.min(100, axis.score));
          const fillLeft = clamped < 0 ? 50 + clamped / 2 : 50;
          const fillWidth = Math.abs(clamped) / 2;
          return (
            <div key={axis.id} style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{axis.label}</span>
                <span style={{ color: palette.muted }}>{axis.tierLabel}</span>
              </div>
              <div style={{ position: "relative", height: 10, borderRadius: 999, background: palette.track }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${fillLeft}%`,
                    width: `${fillWidth}%`,
                    borderRadius: 999,
                    background: palette.gradient,
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: palette.muted, marginTop: 6 }}>
                <span>{axis.leftPole}</span>
                <span>{axis.rightPole}</span>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 20, fontSize: 15, color: palette.muted }}>Personality Studio</div>
      </div>
    </div>
  );
});
