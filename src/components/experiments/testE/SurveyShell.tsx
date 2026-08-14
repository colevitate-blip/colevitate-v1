"use client";

import Link from "next/link";
import { Anton, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--te-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--te-body" });

const CSS = `
.te-quiz-root {
  --te-ink: #101010;
  font-family: var(--te-body), sans-serif;
  color: var(--te-ink);
  background: #fff0f6;
  min-height: 100vh;
}
.te-quiz-wrap { max-width: 760px; margin: 0 auto; padding: 32px 24px 80px; }

.te-quiz-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 12px;
}
.te-quiz-exit {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 13px;
  color: var(--te-ink);
  background: #fff;
  border: 3px solid var(--te-ink);
  padding: 8px 14px;
  text-decoration: none;
  transform: rotate(-2deg);
  display: inline-block;
}
.te-quiz-counter {
  font-weight: 900;
  font-size: 13px;
  text-transform: uppercase;
  background: var(--te-ink);
  color: #f6ff3d;
  border: 3px solid var(--te-ink);
  padding: 8px 14px;
  transform: rotate(2deg);
}

.te-quiz-title {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  line-height: 0.95;
  margin: 0 0 18px;
  letter-spacing: -0.01em;
}

.te-quiz-progress-track {
  border: 3px solid var(--te-ink);
  background: #fff;
  height: 22px;
  margin-bottom: 32px;
  padding: 3px;
}
.te-quiz-progress-fill {
  height: 100%;
  background: #2b5cff;
  border-right: 3px solid var(--te-ink);
  transition: width 0.2s ease;
}

.te-quiz-card {
  border: 4px solid var(--te-ink);
  background: #fff;
  padding: 28px 24px;
  box-shadow: 10px 10px 0 var(--te-ink);
  margin-bottom: 28px;
}

.te-quiz-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.te-quiz-nav-btn {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 16px;
  border: 3px solid var(--te-ink);
  padding: 14px 28px;
  cursor: pointer;
  box-shadow: 6px 6px 0 var(--te-ink);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.te-quiz-nav-btn:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--te-ink);
}
.te-quiz-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: 3px 3px 0 var(--te-ink);
}
.te-quiz-nav-btn.back { background: #fff; color: var(--te-ink); }
.te-quiz-nav-btn.next { background: #f6ff3d; color: var(--te-ink); }
`;

interface SurveyShellProps {
  title: string;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  exitHref?: string;
  children: ReactNode;
}

export function SurveyShell({
  title,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  nextDisabled = false,
  backDisabled = false,
  exitHref = "/experiments/test-e",
  children,
}: SurveyShellProps) {
  const pct = totalSteps > 0 ? Math.round(((stepIndex + 1) / totalSteps) * 100) : 0;

  return (
    <div className={`te-quiz-root ${display.variable} ${body.variable}`}>
      <style>{CSS}</style>
      <div className="te-quiz-wrap">
        <div className="te-quiz-topbar">
          <Link href={exitHref} className="te-quiz-exit">
            ← Exit
          </Link>
          <div className="te-quiz-counter">
            {stepIndex + 1} / {totalSteps}
          </div>
        </div>

        <h1 className="te-quiz-title">{title}</h1>

        <div className="te-quiz-progress-track">
          <div className="te-quiz-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="te-quiz-card">{children}</div>

        <div className="te-quiz-nav">
          <button type="button" className="te-quiz-nav-btn back" onClick={onBack} disabled={backDisabled}>
            {backLabel}
          </button>
          <button type="button" className="te-quiz-nav-btn next" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
