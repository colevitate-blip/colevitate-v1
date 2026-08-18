import { forwardRef } from "react";
import type { AssessmentId, ColorId, PersonalityResults } from "@/lib/personality/types";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

const DOC_WIDTH = 760;

// html2canvas can't parse the color-mix()/oklch() values Tailwind v4 emits
// for its palette (same constraint documented in ShareCard.tsx), so this
// export document — like ShareCard — is styled with plain inline hex
// values instead of Tailwind color classes. A printed report also reads
// better on paper-white than in the app's dark UI, so this is a deliberate
// light "document" palette rather than a mirror of the on-screen theme.
const INK = "#15161c";
const INK_SOFT = "#565a68";
const INK_FAINT = "#93969f";
const LINE = "#e4e6ec";
const PAPER = "#ffffff";
const PAPER_SUNK = "#f7f7f9";
const ACCENT = "#4f46e5";

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

function Section({ children }: { children: React.ReactNode }) {
  // data-pdf-section marks the boundaries exportPdf.ts measures to decide
  // where a page break is allowed to fall — never mid-section.
  return (
    <div data-pdf-section style={{ marginTop: 28 }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        color: ACCENT,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Rendered off-screen and captured with html2canvas + jsPDF for "Export as
 * PDF" (see exportPdf.ts). Kept as a separate, purpose-built layout rather
 * than printing the live app UI — that sidesteps both the browser print
 * dialog's own date/URL header-footer stamps (outside any page's control)
 * and the oklch color-parsing issue that would otherwise mangle the app's
 * live styling under html2canvas.
 */
export const PdfDocument = forwardRef<
  HTMLDivElement,
  { profile: CombinedProfileData; results: PersonalityResults; careerSuggestions: string[] }
>(function PdfDocument({ profile, results, careerSuggestions }, ref) {
  const generatedOn = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={ref}
      style={{
        width: DOC_WIDTH,
        padding: 48,
        background: PAPER,
        color: INK,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Masthead — the only place a date appears, by design, not stamped by a print dialog. */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderBottom: `1px solid ${LINE}`,
          paddingBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.2 }}>Colevitate</div>
          <div style={{ fontSize: 12, color: INK_FAINT, marginTop: 2 }}>Many lenses. One you.</div>
        </div>
        <div style={{ fontSize: 12, color: INK_FAINT }}>{generatedOn}</div>
      </div>

      {/* Identity */}
      <Section>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {profile.threads.map((t) => (
              <div
                key={t.id}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ffffff",
                  background: hexForThread(t.id, results),
                }}
              >
                {t.code}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "inline-block",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: INK_FAINT,
            border: `1px solid ${LINE}`,
            borderRadius: 999,
            padding: "3px 10px",
          }}
        >
          Combined Profile
        </div>

        {profile.archetype ? (
          <>
            <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginTop: 10 }}>
              {profile.archetype.name}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: INK_SOFT, marginTop: 6 }}>
              {profile.archetype.description}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginTop: 10 }}>
            {profile.headline}
          </div>
        )}
        <div style={{ fontSize: 11, color: INK_FAINT, marginTop: 8 }}>{profile.sourcesLine}</div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {profile.narrative.map((p, i) => (
            <div key={i} style={{ fontSize: 13.5, lineHeight: 1.65, color: INK }}>
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* Where your lenses agree */}
      <Section>
        <SectionTitle>Where Your Lenses Agree</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {profile.axes.map((axis) => {
            const clamped = Math.max(-100, Math.min(100, axis.score));
            const fillLeft = clamped < 0 ? 50 + clamped / 2 : 50;
            const fillWidth = Math.abs(clamped) / 2;
            return (
              <div key={axis.id}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{axis.label}</span>
                  <span style={{ color: INK_FAINT }}>{axis.tierLabel}</span>
                </div>
                <div
                  style={{
                    position: "relative",
                    height: 6,
                    borderRadius: 999,
                    background: PAPER_SUNK,
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${fillLeft}%`,
                      width: `${fillWidth}%`,
                      borderRadius: 999,
                      background: ACCENT,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10.5,
                    color: INK_FAINT,
                    marginTop: 4,
                  }}
                >
                  <span>{axis.leftPole}</span>
                  <span>{axis.rightPole}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Where to lean in */}
      <Section>
        <SectionTitle>Where to Lean In</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {profile.axes.map((axis) => (
            <div key={axis.id}>
              <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, color: INK_FAINT }}>
                {axis.label}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.55, marginTop: 2 }}>{axis.sentence}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Where this might fit */}
      {careerSuggestions.length > 0 ? (
        <Section>
          <SectionTitle>Where This Might Fit</SectionTitle>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: INK }}>
            {careerSuggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Strengths / growth */}
      <Section>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <SectionTitle>Strengths</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.65, color: INK }}>
              {profile.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <SectionTitle>Growth Areas</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.65, color: INK }}>
              {profile.growth.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Your four lenses */}
      <Section>
        <SectionTitle>Your Four Lenses</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {profile.threads.map((t) => (
            <div
              key={t.id}
              style={{
                border: `1px solid ${LINE}`,
                borderLeft: `3px solid ${hexForThread(t.id, results)}`,
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 600, color: hexForThread(t.id, results) }}>
                {t.label}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{t.name}</div>
              <div style={{ fontSize: 11.5, color: INK_FAINT, marginTop: 1 }}>{t.tagline}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <Section>
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 14, fontSize: 11, lineHeight: 1.6, color: INK_FAINT }}>
          This is our synthesis of your four results, not a lab measurement — built to help you see
          the pattern, not to grade you on it. Generated by Colevitate on {generatedOn}.
        </div>
      </Section>
    </div>
  );
});
