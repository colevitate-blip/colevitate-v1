"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { archivo, TF_ROOT_CSS } from "./theme";

// Themed survey chrome: top nav, thin-rule progress bar with a red-filled
// segment, step numeral, question slot, and Back/Next controls. Matches
// PanelF's thin-rule / uppercase-label language.
const CSS = `
[data-panel="f"] .tf-quiz-wrap { max-width: 720px; margin: 0 auto; padding: 0 24px 100px; }

[data-panel="f"] .tf-quiz-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid var(--tf-ink);
}
[data-panel="f"] .tf-quiz-brand { font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.02em; text-decoration: none; color: inherit; }
[data-panel="f"] .tf-quiz-exit { font-size: 12px; color: var(--tf-muted); text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; }
[data-panel="f"] .tf-quiz-exit:hover { color: var(--tf-red); }

[data-panel="f"] .tf-quiz-progress-row { display: flex; justify-content: space-between; align-items: baseline; padding: 24px 0 10px; }
[data-panel="f"] .tf-quiz-progress-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
[data-panel="f"] .tf-quiz-progress-count { font-size: 12px; color: var(--tf-muted); }
[data-panel="f"] .tf-quiz-progress-track { height: 2px; background: var(--tf-rule); margin-bottom: 40px; }
[data-panel="f"] .tf-quiz-progress-fill { height: 2px; background: var(--tf-red); transition: width 0.2s ease; }

[data-panel="f"] .tf-quiz-body { min-height: 260px; padding: 8px 0 40px; }

[data-panel="f"] .tf-quiz-footer-nav { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tf-rule); padding-top: 24px; }
[data-panel="f"] .tf-quiz-btn {
  appearance: none;
  border: 1px solid var(--tf-ink);
  background: #fff;
  color: var(--tf-ink);
  padding: 13px 22px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  font-family: inherit;
}
[data-panel="f"] .tf-quiz-btn:disabled { opacity: 0.35; cursor: not-allowed; }
[data-panel="f"] .tf-quiz-btn-primary { border-color: var(--tf-ink); background: var(--tf-red); color: #fff; border-color: var(--tf-red); }
[data-panel="f"] .tf-quiz-btn-primary:disabled { opacity: 0.35; }
`;

interface SurveyShellProps {
  frameworkLabel: string;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  isLastStep?: boolean;
  children: ReactNode;
}

export default function SurveyShell({
  frameworkLabel,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  nextDisabled,
  isLastStep,
  children,
}: SurveyShellProps) {
  const current = Math.min(stepIndex + 1, totalSteps);
  const pct = totalSteps > 0 ? (current / totalSteps) * 100 : 0;

  return (
    <div className={`exp-panel ${archivo.variable}`} data-panel="f">
      <style>{TF_ROOT_CSS + CSS}</style>
      <div className="tf-quiz-wrap">
        <div className="tf-quiz-nav">
          <Link href="/experiments/test-f" className="tf-quiz-brand">
            Personality Studio
          </Link>
          <Link href="/experiments/test-f" className="tf-quiz-exit">
            Exit
          </Link>
        </div>

        <div className="tf-quiz-progress-row">
          <span className="tf-quiz-progress-label">{frameworkLabel}</span>
          <span className="tf-quiz-progress-count">
            {String(current).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </span>
        </div>
        <div className="tf-quiz-progress-track">
          <div className="tf-quiz-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="tf-quiz-body">{children}</div>

        <div className="tf-quiz-footer-nav">
          <button type="button" className="tf-quiz-btn" onClick={onBack} disabled={stepIndex === 0}>
            ← Back
          </button>
          <button
            type="button"
            className="tf-quiz-btn tf-quiz-btn-primary"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {isLastStep ? "See Results" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
