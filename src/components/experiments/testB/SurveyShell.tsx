import type { ReactNode } from "react";
import Link from "next/link";
import { fontVariables } from "./theme";

const CSS = `
[data-quiz="b"] {
  --tb-ink: #34324a;
  --tb-muted: #7c7a94;
  font-family: var(--tb-body), sans-serif;
  color: var(--tb-ink);
  min-height: 100vh;
  background:
    radial-gradient(60% 50% at 85% -10%, #ffe1ea 0%, transparent 60%),
    radial-gradient(50% 40% at 5% 10%, #dcecff 0%, transparent 60%),
    radial-gradient(55% 45% at 30% 100%, #e3f6e6 0%, transparent 60%),
    #fbf9ff;
  position: relative;
  overflow: hidden;
}
[data-quiz="b"] .tb-quiz-blob {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  opacity: 0.55;
  z-index: 0;
}
[data-quiz="b"] .tb-quiz-blob.one { width: 260px; height: 260px; background: #ffd3e2; top: -80px; right: 6%; }
[data-quiz="b"] .tb-quiz-blob.two { width: 180px; height: 180px; background: #cfe8ff; bottom: 10%; left: -60px; }

[data-quiz="b"] .tb-quiz-wrap { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; padding: 28px 24px 96px; }

[data-quiz="b"] .tb-quiz-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 10px 30px rgba(124, 108, 240, 0.12);
  width: fit-content;
  margin-bottom: 36px;
  text-decoration: none;
  color: inherit;
}
[data-quiz="b"] .tb-quiz-logo {
  width: 30px; height: 30px; border-radius: 999px;
  background: linear-gradient(135deg, #7c6cf0, #37c2a8);
  flex: 0 0 auto;
}
[data-quiz="b"] .tb-quiz-navtext { font-family: var(--tb-heading), sans-serif; font-weight: 700; font-size: 15px; }

[data-quiz="b"] .tb-quiz-progress-label {
  font-size: 13px;
  font-weight: 700;
  color: #7c6cf0;
  margin: 0 0 10px;
}
[data-quiz="b"] .tb-quiz-progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #f0edfb;
  overflow: hidden;
  margin-bottom: 28px;
}
[data-quiz="b"] .tb-quiz-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #7c6cf0, #f0708e 60%, #f2b544);
  transition: width 0.3s ease;
}

[data-quiz="b"] .tb-quiz-title {
  font-family: var(--tb-heading), sans-serif;
  font-weight: 800;
  font-size: 26px;
  margin: 0 0 24px;
}

[data-quiz="b"] .tb-quiz-card {
  background: #fff;
  border-radius: 32px;
  padding: 34px 30px;
  box-shadow: 0 18px 40px rgba(124, 108, 240, 0.1);
}

[data-quiz="b"] .tb-quiz-navbtns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
}
[data-quiz="b"] .tb-quiz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  font-family: var(--tb-body), sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
[data-quiz="b"] .tb-quiz-btn.primary {
  background: linear-gradient(90deg, #7c6cf0, #f0708e);
  color: #fff;
  box-shadow: 0 16px 30px rgba(240, 112, 142, 0.35);
}
[data-quiz="b"] .tb-quiz-btn.primary:hover { transform: translateY(-2px); }
[data-quiz="b"] .tb-quiz-btn.primary:disabled {
  opacity: 0.4;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}
[data-quiz="b"] .tb-quiz-btn.secondary {
  background: #f4f2ff;
  color: #7c6cf0;
}
[data-quiz="b"] .tb-quiz-btn.secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
`;

interface SurveyShellProps {
  title: string;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  children: ReactNode;
}

export default function SurveyShell({
  title,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  nextLabel = "Next",
  children,
}: SurveyShellProps) {
  const pct = Math.round(((stepIndex + 1) / totalSteps) * 100);
  return (
    <div className={`exp-panel ${fontVariables}`} data-quiz="b">
      <style>{CSS}</style>
      <div className="tb-quiz-blob one" />
      <div className="tb-quiz-blob two" />
      <div className="tb-quiz-wrap">
        <Link href="/experiments/test-b" className="tb-quiz-nav">
          <div className="tb-quiz-logo" />
          <div className="tb-quiz-navtext">Personality Studio</div>
        </Link>

        <div className="tb-quiz-progress-label">
          Question {stepIndex + 1} of {totalSteps}
        </div>
        <div className="tb-quiz-progress-track">
          <div className="tb-quiz-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <h1 className="tb-quiz-title">{title}</h1>

        <div className="tb-quiz-card">{children}</div>

        <div className="tb-quiz-navbtns">
          <button type="button" className="tb-quiz-btn secondary" onClick={onBack} disabled={backDisabled}>
            Back
          </button>
          <button type="button" className="tb-quiz-btn primary" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
