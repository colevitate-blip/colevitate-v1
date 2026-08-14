import { Archivo } from "next/font/google";

// Shared font + base design tokens for the Test F (Swiss Minimal) quiz
// routes. Mirrors PanelF.tsx exactly — same font, same hex values — so the
// live quiz never diverges visually from the design concept it was cloned
// from. Declared once here and imported everywhere it's needed, per
// next/font's recommended shared-file pattern.
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--tf-font",
});

// Re-declares the same CSS custom properties PanelF.tsx defines on
// [data-panel="f"]. Any quiz screen that renders its own [data-panel="f"]
// root (SurveyShell, ResultScreen) includes this block so var(--tf-ink) etc.
// resolve even though this tree is never a descendant of PanelF itself.
export const TF_ROOT_CSS = `
[data-panel="f"] {
  --tf-ink: #111111;
  --tf-muted: #6a6a6a;
  --tf-rule: #dcdcdc;
  --tf-red: #e3161e;
  font-family: var(--tf-font), sans-serif;
  color: var(--tf-ink);
  background: #ffffff;
  letter-spacing: -0.01em;
}
`;
