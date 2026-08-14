import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import type { ResultView } from "../resultView";
import { TA_BASE_CSS } from "./chrome";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--ta-font",
});

const CSS = `
${TA_BASE_CSS}

[data-panel="a"] .ta-result-wrap {
  position: relative;
  z-index: 6;
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 24px 72px;
}
[data-panel="a"] .ta-result-breadcrumb {
  font-size: 12px;
  color: var(--ta-green-dim);
  margin-bottom: 24px;
}
[data-panel="a"] .ta-result-breadcrumb a {
  color: var(--ta-green-dim);
  text-decoration: none;
}
[data-panel="a"] .ta-result-breadcrumb a:hover {
  color: var(--ta-green);
  text-decoration: underline;
}
[data-panel="a"] .ta-result-status {
  font-size: 12px;
  color: var(--ta-muted);
  margin-bottom: 18px;
}
[data-panel="a"] .ta-result-status::before {
  content: "$ ";
  color: var(--ta-amber);
}
[data-panel="a"] .ta-result-head {
  border: 1px solid var(--ta-green-dim);
  background: radial-gradient(circle at 15% 0%, rgba(77, 255, 158, 0.1), transparent 60%), var(--ta-panel);
  padding: 28px 24px;
  margin-bottom: 24px;
}
[data-panel="a"] .ta-result-code {
  display: inline-block;
  border: 1px solid var(--ta-green);
  color: var(--ta-green);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  margin-bottom: 14px;
}
[data-panel="a"] .ta-result-name {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--ta-green);
  margin: 0 0 8px;
  text-shadow: 0 0 18px rgba(77, 255, 158, 0.3);
}
[data-panel="a"] .ta-result-tagline {
  font-size: 14px;
  color: var(--ta-amber);
  margin: 0 0 16px;
}
[data-panel="a"] .ta-result-desc {
  font-size: 13px;
  line-height: 1.7;
  color: var(--ta-text);
  opacity: 0.9;
  margin: 0;
}
[data-panel="a"] .ta-result-section-label {
  font-size: 12px;
  color: var(--ta-green-dim);
  letter-spacing: 0.06em;
  margin: 32px 0 12px;
}
[data-panel="a"] .ta-result-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 640px) {
  [data-panel="a"] .ta-result-columns { grid-template-columns: 1fr; }
}
[data-panel="a"] .ta-result-list {
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  padding: 16px 18px;
  margin: 0;
  list-style: none;
}
[data-panel="a"] .ta-result-list li {
  font-size: 13px;
  line-height: 1.6;
  color: var(--ta-text);
  padding-left: 16px;
  position: relative;
  margin-bottom: 8px;
}
[data-panel="a"] .ta-result-list li:last-child { margin-bottom: 0; }
[data-panel="a"] .ta-result-list.strengths li::before {
  content: "+";
  position: absolute;
  left: 0;
  color: var(--ta-green);
  font-weight: 700;
}
[data-panel="a"] .ta-result-list.growth li::before {
  content: "~";
  position: absolute;
  left: 0;
  color: var(--ta-amber);
  font-weight: 700;
}
[data-panel="a"] .ta-result-traits {
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  padding: 16px 18px;
}
[data-panel="a"] .ta-result-trait { margin-bottom: 14px; }
[data-panel="a"] .ta-result-trait:last-child { margin-bottom: 0; }
[data-panel="a"] .ta-result-trait-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ta-muted);
  margin-bottom: 6px;
}
[data-panel="a"] .ta-result-trait-row .label { color: var(--ta-text); text-transform: uppercase; letter-spacing: 0.04em; }
[data-panel="a"] .ta-result-trait-row .caption { color: var(--ta-amber); }
[data-panel="a"] .ta-result-trait-track {
  height: 8px;
  border: 1px solid var(--ta-line);
  background: var(--ta-bg);
  overflow: hidden;
}
[data-panel="a"] .ta-result-trait-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ta-green-dim), var(--ta-green));
  box-shadow: 0 0 8px rgba(77, 255, 158, 0.5);
}
[data-panel="a"] .ta-result-actions {
  display: flex;
  gap: 12px;
  margin-top: 36px;
  flex-wrap: wrap;
}
[data-panel="a"] .ta-result-btn {
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
  text-decoration: none;
  transition: border-color 0.12s ease, color 0.12s ease;
}
[data-panel="a"] .ta-result-btn:hover {
  border-color: var(--ta-green);
  color: var(--ta-green);
}
[data-panel="a"] .ta-result-btn.primary {
  border-color: var(--ta-green);
  color: var(--ta-green);
  background: rgba(77, 255, 158, 0.08);
}
`;

export interface ResultScreenProps {
  view: ResultView;
  scriptLabel: string;
  backHref: string;
  onRetake: () => void;
}

export default function ResultScreen({ view, scriptLabel, backHref, onRetake }: ResultScreenProps) {
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
      <div className="ta-result-wrap">
        <div className="ta-result-breadcrumb">
          <Link href={backHref}>&lt; ./experiments/test-a</Link>
        </div>
        <div className="ta-result-status">process exited 0 — result compiled</div>

        <div className="ta-result-head">
          <span className="ta-result-code">{view.code}</span>
          <h1 className="ta-result-name">{view.name}</h1>
          <p className="ta-result-tagline">{view.tagline}</p>
          <p className="ta-result-desc">{view.description}</p>
        </div>

        {(view.strengths.length > 0 || view.growth.length > 0) && (
          <>
            <div className="ta-result-section-label">$ cat ./strengths ./growth-areas</div>
            <div className="ta-result-columns">
              {view.strengths.length > 0 && (
                <ul className="ta-result-list strengths">
                  {view.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {view.growth.length > 0 && (
                <ul className="ta-result-list growth">
                  {view.growth.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {view.traits.length > 0 && (
          <>
            <div className="ta-result-section-label">$ cat ./scores.json</div>
            <div className="ta-result-traits">
              {view.traits.map((t) => (
                <div className="ta-result-trait" key={t.label}>
                  <div className="ta-result-trait-row">
                    <span>
                      <span className="label">{t.label}</span>
                      {t.caption ? <span className="caption"> · {t.caption}</span> : null}
                    </span>
                    <span>{t.value}%</span>
                  </div>
                  <div className="ta-result-trait-track">
                    <div className="ta-result-trait-fill" style={{ width: `${Math.max(0, Math.min(100, t.value))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="ta-result-actions">
          <button type="button" className="ta-result-btn primary" onClick={onRetake}>
            &gt; retake assessment
          </button>
          <Link href={backHref} className="ta-result-btn">
            &gt; back to concept
          </Link>
        </div>
      </div>
    </div>
  );
}
