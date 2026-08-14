"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

// Full-page chrome for a Panel D quiz: dot-grid bg, glassy nav pill, glowing
// progress bar, title, and Back/Next controls — wraps the current question.

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--td-font" });

const CSS = `
[data-panel="d"] {
  --td-bg: #05070f;
  --td-panel: #0d1224;
  --td-line: #232a4a;
  --td-text: #dfe3ff;
  --td-muted: #8890b8;
  font-family: var(--td-font), sans-serif;
  color: var(--td-text);
  background:
    radial-gradient(60% 40% at 15% 0%, rgba(124, 140, 255, 0.18), transparent 60%),
    radial-gradient(50% 40% at 90% 10%, rgba(55, 224, 196, 0.14), transparent 60%),
    var(--td-bg);
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}
[data-panel="d"] .td-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(65% 55% at 50% 20%, black, transparent 85%);
  z-index: 0;
}
[data-panel="d"] .td-quiz-wrap {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 28px 24px 90px;
  perspective: 1400px;
}
[data-panel="d"] .td-quiz-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 16px;
  background: rgba(13, 18, 36, 0.6);
  border: 1px solid var(--td-line);
  backdrop-filter: blur(8px);
  margin-bottom: 36px;
}
[data-panel="d"] .td-quiz-brand { font-weight: 700; font-size: 15px; letter-spacing: 0.01em; }
[data-panel="d"] .td-quiz-brand span { color: #7c8cff; }
[data-panel="d"] .td-quiz-exit {
  font-size: 12px;
  color: var(--td-muted);
  text-decoration: none;
  border: 1px solid var(--td-line);
  border-radius: 999px;
  padding: 6px 14px;
  transition: color 0.18s ease, border-color 0.18s ease;
}
[data-panel="d"] .td-quiz-exit:hover { color: var(--td-text); border-color: #7c8cff; }

[data-panel="d"] .td-quiz-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
[data-panel="d"] .td-quiz-framework {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9fa8ff;
}
[data-panel="d"] .td-quiz-count { font-size: 12px; color: var(--td-muted); }
[data-panel="d"] .td-quiz-progress-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--td-line);
  overflow: hidden;
  margin-bottom: 32px;
}
[data-panel="d"] .td-quiz-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #7c8cff, #37e0c4);
  box-shadow: 0 0 14px rgba(124,140,255,0.6);
  transition: width 0.3s ease;
}

[data-panel="d"] .td-quiz-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
}
[data-panel="d"] .td-quiz-btn {
  padding: 12px 26px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--td-line);
  background: transparent;
  color: var(--td-text);
  transition: border-color 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
}
[data-panel="d"] .td-quiz-btn:hover:not(:disabled) { border-color: #7c8cff; transform: translateY(-1px); }
[data-panel="d"] .td-quiz-btn:disabled { opacity: 0.35; cursor: not-allowed; }
[data-panel="d"] .td-quiz-btn-primary {
  border: none;
  background: linear-gradient(90deg, #7c8cff, #37e0c4);
  color: #05070f;
  box-shadow: 0 16px 34px rgba(124,140,255,0.35);
}
[data-panel="d"] .td-quiz-btn-primary:hover:not(:disabled) { transform: translateY(-1px); }
[data-panel="d"] .td-quiz-btn-primary:disabled { box-shadow: none; }
`;

interface SurveyShellProps {
  frameworkLabel: string;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}

export default function SurveyShell({
  frameworkLabel,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  nextDisabled = false,
  children,
}: SurveyShellProps) {
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className={`exp-panel ${grotesk.variable}`} data-panel="d">
      <style>{CSS}</style>
      <div className="td-grid-bg" />
      <div className="td-quiz-wrap">
        <div className="td-quiz-nav">
          <div className="td-quiz-brand">
            <span>◆</span> Personality Studio
          </div>
          <Link href="/experiments/test-d" className="td-quiz-exit">
            Exit
          </Link>
        </div>

        <div className="td-quiz-meta">
          <div className="td-quiz-framework">{frameworkLabel}</div>
          <div className="td-quiz-count">
            {stepIndex + 1} / {totalSteps}
          </div>
        </div>
        <div className="td-quiz-progress-track">
          <div className="td-quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {children}

        <div className="td-quiz-actions">
          <button type="button" className="td-quiz-btn" onClick={onBack}>
            {backLabel}
          </button>
          <button
            type="button"
            className="td-quiz-btn td-quiz-btn-primary"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
