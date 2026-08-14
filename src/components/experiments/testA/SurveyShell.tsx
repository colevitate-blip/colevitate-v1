import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { TA_BASE_CSS } from "./chrome";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--ta-font",
});

const CSS = `
${TA_BASE_CSS}

[data-panel="a"] .ta-quiz-wrap {
  position: relative;
  z-index: 6;
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}
[data-panel="a"] .ta-quiz-breadcrumb {
  font-size: 12px;
  color: var(--ta-green-dim);
  margin-bottom: 24px;
}
[data-panel="a"] .ta-quiz-breadcrumb a {
  color: var(--ta-green-dim);
  text-decoration: none;
}
[data-panel="a"] .ta-quiz-breadcrumb a:hover {
  color: var(--ta-green);
  text-decoration: underline;
}
[data-panel="a"] .ta-quiz-header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
[data-panel="a"] .ta-quiz-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ta-green);
  letter-spacing: 0.03em;
}
[data-panel="a"] .ta-quiz-count {
  font-size: 12px;
  color: var(--ta-muted);
}
[data-panel="a"] .ta-quiz-progress-track {
  height: 6px;
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  margin-bottom: 32px;
  overflow: hidden;
}
[data-panel="a"] .ta-quiz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ta-green-dim), var(--ta-green));
  box-shadow: 0 0 10px rgba(77, 255, 158, 0.5);
  transition: width 0.2s ease;
}
[data-panel="a"] .ta-quiz-card {
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  padding: 28px 24px;
  margin-bottom: 24px;
}
[data-panel="a"] .ta-quiz-nav {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
[data-panel="a"] .ta-quiz-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--ta-green-dim);
  color: var(--ta-text);
  background: transparent;
  padding: 10px 18px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.12s ease, color 0.12s ease, opacity 0.12s ease;
}
[data-panel="a"] .ta-quiz-btn:hover:not(:disabled) {
  border-color: var(--ta-green);
  color: var(--ta-green);
}
[data-panel="a"] .ta-quiz-btn:disabled {
  opacity: 0.35;
  cursor: default;
}
[data-panel="a"] .ta-quiz-btn.primary {
  border-color: var(--ta-green);
  color: var(--ta-green);
  background: rgba(77, 255, 158, 0.08);
}
[data-panel="a"] .ta-quiz-btn.primary:hover:not(:disabled) {
  box-shadow: 0 0 14px rgba(77, 255, 158, 0.3);
}
`;

export interface SurveyShellProps {
  scriptLabel: string;
  title: string;
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
}

export default function SurveyShell({
  scriptLabel,
  title,
  step,
  totalSteps,
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  nextLabel,
  children,
}: SurveyShellProps) {
  const pct = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  return (
    <div className={`exp-panel ${mono.variable}`} data-panel="a">
      <style>{CSS}</style>
      <div className="ta-scanlines" />
      <div className="ta-glow" />
      <div className="ta-titlebar">
        <span className="ta-dot r" />
        <span className="ta-dot y" />
        <span className="ta-dot g" />
        <span className="ta-titletext">{scriptLabel} — zsh</span>
      </div>
      <div className="ta-quiz-wrap">
        <div className="ta-quiz-breadcrumb">
          <Link href="/experiments/test-a">&lt; ./experiments/test-a</Link>
        </div>
        <div className="ta-quiz-header-row">
          <span className="ta-quiz-title">{title}</span>
          <span className="ta-quiz-count">
            Q{step + 1}/{totalSteps}
          </span>
        </div>
        <div className="ta-quiz-progress-track">
          <div className="ta-quiz-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="ta-quiz-card">{children}</div>
        <div className="ta-quiz-nav">
          <button type="button" className="ta-quiz-btn" onClick={onBack} disabled={backDisabled}>
            &lt; back
          </button>
          <button type="button" className="ta-quiz-btn primary" onClick={onNext} disabled={nextDisabled}>
            {nextLabel ?? "next >"}
          </button>
        </div>
      </div>
    </div>
  );
}
