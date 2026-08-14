"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Playfair_Display, Work_Sans } from "next/font/google";

// Editorial-themed survey chrome: masthead + "Article N of Total" progress,
// section kicker, thin progress rule, and Back/Next nav — reusing PanelC's
// design tokens verbatim (own <style> block, tc-quiz- prefixed classes).

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--tc-serif",
});
const sans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--tc-sans",
});

const CSS = `
[data-panel="c-quiz"] {
  --tc-ink: #201d1a;
  --tc-muted: #6b6459;
  --tc-rule: #d8d0c2;
  --tc-accent: #a3372c;
  font-family: var(--tc-sans), sans-serif;
  background: #fbf8f2;
  color: var(--tc-ink);
  min-height: 100vh;
}
[data-panel="c-quiz"] .tc-quiz-wrap { max-width: 780px; margin: 0 auto; padding: 28px 24px 96px; }

[data-panel="c-quiz"] .tc-quiz-masthead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 3px solid var(--tc-ink);
  margin-bottom: 10px;
}
[data-panel="c-quiz"] .tc-quiz-brand {
  font-family: var(--tc-serif), serif;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: -0.01em;
  color: var(--tc-ink);
  text-decoration: none;
}
[data-panel="c-quiz"] .tc-quiz-progress-label {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tc-muted);
}
[data-panel="c-quiz"] .tc-quiz-subrule {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tc-muted);
  padding: 8px 0 18px;
}
[data-panel="c-quiz"] .tc-quiz-subrule .tc-quiz-section { color: var(--tc-accent); font-weight: 600; }

[data-panel="c-quiz"] .tc-quiz-progressbar {
  height: 2px;
  background: var(--tc-rule);
  margin-bottom: 48px;
  position: relative;
}
[data-panel="c-quiz"] .tc-quiz-progressbar-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: var(--tc-accent);
  transition: width 0.2s ease;
}

[data-panel="c-quiz"] .tc-quiz-body { margin-bottom: 56px; }

[data-panel="c-quiz"] .tc-quiz-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--tc-rule);
  padding-top: 24px;
}
[data-panel="c-quiz"] .tc-quiz-btn {
  display: inline-block;
  border: 1px solid var(--tc-ink);
  background: transparent;
  padding: 12px 28px;
  font-family: var(--tc-sans), sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: var(--tc-ink);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
[data-panel="c-quiz"] .tc-quiz-btn:hover:not(:disabled) { background: var(--tc-ink); color: #fbf8f2; }
[data-panel="c-quiz"] .tc-quiz-btn:disabled { opacity: 0.3; cursor: not-allowed; }
[data-panel="c-quiz"] .tc-quiz-btn.primary { background: var(--tc-accent); border-color: var(--tc-accent); color: #fbf8f2; }
[data-panel="c-quiz"] .tc-quiz-btn.primary:hover:not(:disabled) { background: #862c22; border-color: #862c22; }
[data-panel="c-quiz"] .tc-quiz-btn.primary:disabled { opacity: 0.35; }
`;

interface SurveyShellProps {
  sectionLabel: string;
  questionIndex: number;
  totalQuestions: number;
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  children: ReactNode;
}

export default function SurveyShell({
  sectionLabel,
  questionIndex,
  totalQuestions,
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  nextLabel,
  children,
}: SurveyShellProps) {
  const pct = Math.round(((questionIndex + 1) / totalQuestions) * 100);
  return (
    <div className={`${serif.variable} ${sans.variable}`} data-panel="c-quiz">
      <style>{CSS}</style>
      <div className="tc-quiz-wrap">
        <div className="tc-quiz-masthead">
          <Link href="/experiments/test-c" className="tc-quiz-brand">
            Personality Studio
          </Link>
          <div className="tc-quiz-progress-label">
            Article {questionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <div className="tc-quiz-subrule">
          <span className="tc-quiz-section">{sectionLabel}</span>
          <span>{pct}% Complete</span>
        </div>
        <div className="tc-quiz-progressbar">
          <div className="tc-quiz-progressbar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="tc-quiz-body">{children}</div>

        <div className="tc-quiz-nav">
          <button
            type="button"
            className="tc-quiz-btn"
            onClick={onBack}
            disabled={backDisabled}
          >
            ← Back
          </button>
          <button
            type="button"
            className="tc-quiz-btn primary"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel ?? "Next"} →
          </button>
        </div>
      </div>
    </div>
  );
}
