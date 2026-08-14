import Link from "next/link";
import type { ResultView } from "@/components/experiments/resultView";
import { COLORS, fontVariables } from "./theme";

const CSS = `
[data-result="b"] {
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
[data-result="b"] .tb-result-blob {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  opacity: 0.55;
  z-index: 0;
}
[data-result="b"] .tb-result-blob.one { width: 260px; height: 260px; background: #ffd3e2; top: -80px; right: 6%; }
[data-result="b"] .tb-result-blob.two { width: 180px; height: 180px; background: #cfe8ff; bottom: 10%; left: -60px; }

[data-result="b"] .tb-result-wrap { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; padding: 28px 24px 96px; }

[data-result="b"] .tb-result-nav {
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
[data-result="b"] .tb-result-logo {
  width: 30px; height: 30px; border-radius: 999px;
  background: linear-gradient(135deg, #7c6cf0, #37c2a8);
  flex: 0 0 auto;
}
[data-result="b"] .tb-result-navtext { font-family: var(--tb-heading), sans-serif; font-weight: 700; font-size: 15px; }

[data-result="b"] .tb-result-card {
  background: #fff;
  border-radius: 32px;
  padding: 38px 32px;
  box-shadow: 0 18px 40px rgba(124, 108, 240, 0.1);
}
[data-result="b"] .tb-result-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 64px;
  padding: 0 14px;
  border-radius: 20px;
  background: linear-gradient(135deg, #7c6cf0, #f0708e);
  color: #fff;
  font-family: var(--tb-heading), sans-serif;
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 18px;
}
[data-result="b"] .tb-result-name {
  font-family: var(--tb-heading), sans-serif;
  font-weight: 800;
  font-size: 30px;
  margin: 0 0 6px;
}
[data-result="b"] .tb-result-tagline {
  font-size: 14px;
  font-weight: 700;
  color: #7c6cf0;
  margin: 0 0 18px;
}
[data-result="b"] .tb-result-desc {
  font-size: 15px;
  line-height: 1.75;
  color: var(--tb-muted);
  margin: 0 0 28px;
}

[data-result="b"] .tb-result-section-title {
  font-family: var(--tb-heading), sans-serif;
  font-weight: 700;
  font-size: 16px;
  margin: 0 0 12px;
}
[data-result="b"] .tb-result-list {
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
[data-result="b"] .tb-result-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--tb-ink);
  background: #f8f7fc;
  border-radius: 16px;
  padding: 12px 16px;
}
[data-result="b"] .tb-result-list .tb-result-dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-top: 6px;
  background: linear-gradient(135deg, #7c6cf0, #f0708e);
}

[data-result="b"] .tb-result-trait { margin-bottom: 16px; }
[data-result="b"] .tb-result-trait-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
}
[data-result="b"] .tb-result-trait-label { color: var(--tb-ink); }
[data-result="b"] .tb-result-trait-caption { color: var(--tb-muted); font-weight: 600; margin-left: 6px; }
[data-result="b"] .tb-result-trait-value { color: var(--tb-muted); font-weight: 700; }
[data-result="b"] .tb-result-trait-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #f0edfb;
  overflow: hidden;
}
[data-result="b"] .tb-result-trait-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

[data-result="b"] .tb-result-actions {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
[data-result="b"] .tb-result-btn {
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
  background: linear-gradient(90deg, #7c6cf0, #f0708e);
  color: #fff;
  box-shadow: 0 16px 30px rgba(240, 112, 142, 0.35);
  transition: transform 0.15s ease;
}
[data-result="b"] .tb-result-btn:hover { transform: translateY(-2px); }
[data-result="b"] .tb-result-back {
  font-size: 14px;
  font-weight: 700;
  color: #7c6cf0;
  text-decoration: none;
}
`;

function formatLabel(label: string): string {
  if (label.length <= 3) return label.toUpperCase();
  return label
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

interface ResultScreenProps {
  view: ResultView;
  onRetake: () => void;
  backHref?: string;
}

export default function ResultScreen({ view, onRetake, backHref = "/experiments/test-b" }: ResultScreenProps) {
  return (
    <div className={`exp-panel ${fontVariables}`} data-result="b">
      <style>{CSS}</style>
      <div className="tb-result-blob one" />
      <div className="tb-result-blob two" />
      <div className="tb-result-wrap">
        <Link href={backHref} className="tb-result-nav">
          <div className="tb-result-logo" />
          <div className="tb-result-navtext">Personality Studio</div>
        </Link>

        <div className="tb-result-card">
          <div className="tb-result-badge">{view.code}</div>
          <h1 className="tb-result-name">{view.name}</h1>
          <p className="tb-result-tagline">{view.tagline}</p>
          <p className="tb-result-desc">{view.description}</p>

          {view.strengths.length > 0 && (
            <>
              <h2 className="tb-result-section-title">Strengths</h2>
              <ul className="tb-result-list">
                {view.strengths.map((s, i) => (
                  <li key={i}>
                    <span className="tb-result-dot" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {view.growth.length > 0 && (
            <>
              <h2 className="tb-result-section-title">Growth areas</h2>
              <ul className="tb-result-list">
                {view.growth.map((g, i) => (
                  <li key={i}>
                    <span className="tb-result-dot" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {view.traits.length > 0 && (
            <>
              <h2 className="tb-result-section-title">Trait breakdown</h2>
              {view.traits.map((t, i) => (
                <div className="tb-result-trait" key={t.label}>
                  <div className="tb-result-trait-head">
                    <span>
                      <span className="tb-result-trait-label">{formatLabel(t.label)}</span>
                      {t.caption && <span className="tb-result-trait-caption">{formatLabel(t.caption)}</span>}
                    </span>
                    <span className="tb-result-trait-value">{t.value}%</span>
                  </div>
                  <div className="tb-result-trait-track">
                    <div
                      className="tb-result-trait-fill"
                      style={{ width: `${t.value}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="tb-result-actions">
            <button type="button" className="tb-result-btn" onClick={onRetake}>
              Retake assessment
            </button>
            <Link href={backHref} className="tb-result-back">
              ← Back to Soft Cloud overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
