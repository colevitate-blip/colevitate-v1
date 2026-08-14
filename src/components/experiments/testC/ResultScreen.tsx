"use client";

import Link from "next/link";
import { Playfair_Display, Work_Sans } from "next/font/google";
import type { ResultView } from "@/components/experiments/resultView";

// Editorial-themed result screen — consumes the common ResultView shape
// and renders it as a feature spread with a pull-quote treatment, trait
// bars, and a Retake action. One component serves all four frameworks.

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
[data-panel="c-result"] {
  --tc-ink: #201d1a;
  --tc-muted: #6b6459;
  --tc-rule: #d8d0c2;
  --tc-accent: #a3372c;
  font-family: var(--tc-sans), sans-serif;
  background: #fbf8f2;
  color: var(--tc-ink);
  min-height: 100vh;
}
[data-panel="c-result"] .tc-result-wrap { max-width: 880px; margin: 0 auto; padding: 28px 24px 96px; }

[data-panel="c-result"] .tc-result-masthead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 3px solid var(--tc-ink);
  margin-bottom: 40px;
}
[data-panel="c-result"] .tc-result-brand {
  font-family: var(--tc-serif), serif;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: -0.01em;
  color: var(--tc-ink);
  text-decoration: none;
}
[data-panel="c-result"] .tc-result-issue { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--tc-muted); }

[data-panel="c-result"] .tc-result-kicker {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--tc-accent);
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}
[data-panel="c-result"] .tc-result-code {
  font-family: var(--tc-serif), serif;
  font-weight: 900;
  font-size: clamp(3rem, 10vw, 5.5rem);
  line-height: 1;
  text-align: center;
  color: var(--tc-accent);
  margin: 0 0 6px;
}
[data-panel="c-result"] .tc-result-name {
  font-family: var(--tc-serif), serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  text-align: center;
  margin: 0 0 40px;
}

[data-panel="c-result"] .tc-result-pullquote {
  margin: 0 0 48px;
  padding: 40px 10px;
  border-top: 3px solid var(--tc-ink);
  border-bottom: 3px solid var(--tc-ink);
  text-align: center;
}
[data-panel="c-result"] .tc-result-pullquote p {
  font-family: var(--tc-serif), serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.3rem, 3.2vw, 1.8rem);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.4;
}

[data-panel="c-result"] .tc-result-dropcol { font-size: 15px; line-height: 1.85; color: var(--tc-ink); margin: 0 0 56px; max-width: 680px; }
[data-panel="c-result"] .tc-result-drop {
  float: left;
  font-family: var(--tc-serif), serif;
  font-size: 60px;
  line-height: 0.8;
  padding: 6px 10px 0 0;
  font-weight: 700;
  color: var(--tc-accent);
}

[data-panel="c-result"] .tc-result-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-bottom: 56px; }
@media (max-width: 700px) { [data-panel="c-result"] .tc-result-columns { grid-template-columns: 1fr; } }
[data-panel="c-result"] .tc-result-col { padding: 0 32px 0 0; }
[data-panel="c-result"] .tc-result-columns .tc-result-col:first-child { border-right: 1px solid var(--tc-rule); }
[data-panel="c-result"] .tc-result-columns .tc-result-col:last-child { padding-left: 32px; padding-right: 0; }
@media (max-width: 700px) {
  [data-panel="c-result"] .tc-result-columns .tc-result-col:first-child { border-right: none; border-bottom: 1px solid var(--tc-rule); padding: 0 0 32px; margin-bottom: 32px; }
  [data-panel="c-result"] .tc-result-columns .tc-result-col:last-child { padding-left: 0; }
}
[data-panel="c-result"] .tc-result-col-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--tc-muted);
  border-bottom: 1px solid var(--tc-ink);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
[data-panel="c-result"] .tc-result-list { list-style: none; margin: 0; padding: 0; }
[data-panel="c-result"] .tc-result-list li {
  font-size: 14px;
  line-height: 1.7;
  color: var(--tc-ink);
  padding: 12px 0;
  border-bottom: 1px dotted var(--tc-rule);
}
[data-panel="c-result"] .tc-result-list li:last-child { border-bottom: none; }

[data-panel="c-result"] .tc-result-traits { margin-bottom: 56px; }
[data-panel="c-result"] .tc-result-traits-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--tc-muted);
  border-bottom: 1px solid var(--tc-ink);
  padding-bottom: 10px;
  margin-bottom: 24px;
}
[data-panel="c-result"] .tc-result-trait { margin-bottom: 18px; }
[data-panel="c-result"] .tc-result-trait-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
}
[data-panel="c-result"] .tc-result-trait-label { text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
[data-panel="c-result"] .tc-result-trait-caption { color: var(--tc-muted); }
[data-panel="c-result"] .tc-result-trait-value { color: var(--tc-accent); font-weight: 600; }
[data-panel="c-result"] .tc-result-trait-bar { height: 6px; background: var(--tc-rule); position: relative; }
[data-panel="c-result"] .tc-result-trait-bar-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--tc-accent); }

[data-panel="c-result"] .tc-result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 32px;
  border-top: 1px solid var(--tc-rule);
}
[data-panel="c-result"] .tc-result-btn {
  display: inline-block;
  border: 1px solid var(--tc-ink);
  padding: 12px 28px;
  font-family: var(--tc-sans), sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: var(--tc-ink);
  background: transparent;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}
[data-panel="c-result"] .tc-result-btn:hover { background: var(--tc-ink); color: #fbf8f2; }
[data-panel="c-result"] .tc-result-btn.primary { background: var(--tc-accent); border-color: var(--tc-accent); color: #fbf8f2; }
[data-panel="c-result"] .tc-result-btn.primary:hover { background: #862c22; border-color: #862c22; }

[data-panel="c-result"] .tc-result-colophon {
  margin-top: 56px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tc-muted);
  padding-top: 16px;
  border-top: 1px solid var(--tc-rule);
}
`;

interface ResultScreenProps {
  view: ResultView;
  assessmentLabel: string;
  onRetake: () => void;
}

export default function ResultScreen({ view, assessmentLabel, onRetake }: ResultScreenProps) {
  return (
    <div className={`${serif.variable} ${sans.variable}`} data-panel="c-result">
      <style>{CSS}</style>
      <div className="tc-result-wrap">
        <div className="tc-result-masthead">
          <Link href="/experiments/test-c" className="tc-result-brand">
            Personality Studio
          </Link>
          <div className="tc-result-issue">{assessmentLabel} — Result</div>
        </div>

        <div className="tc-result-kicker">Your Result</div>
        <div className="tc-result-code">{view.code}</div>
        <h1 className="tc-result-name">{view.name}</h1>

        <div className="tc-result-pullquote">
          <p>&ldquo;{view.tagline}&rdquo;</p>
        </div>

        <p className="tc-result-dropcol">
          <span className="tc-result-drop">{view.description.charAt(0)}</span>
          {view.description.slice(1)}
        </p>

        {view.traits.length > 0 && (
          <div className="tc-result-traits">
            <div className="tc-result-traits-label">Trait Breakdown</div>
            {view.traits.map((trait) => (
              <div className="tc-result-trait" key={trait.label}>
                <div className="tc-result-trait-head">
                  <span className="tc-result-trait-label">
                    {trait.label}
                    {trait.caption ? <span className="tc-result-trait-caption"> — {trait.caption}</span> : null}
                  </span>
                  <span className="tc-result-trait-value">{trait.value}%</span>
                </div>
                <div className="tc-result-trait-bar">
                  <div
                    className="tc-result-trait-bar-fill"
                    style={{ width: `${Math.max(0, Math.min(100, trait.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="tc-result-columns">
          <div className="tc-result-col">
            <div className="tc-result-col-label">Strengths</div>
            <ul className="tc-result-list">
              {view.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="tc-result-col">
            <div className="tc-result-col-label">Growth Edges</div>
            <ul className="tc-result-list">
              {view.growth.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tc-result-actions">
          <button type="button" className="tc-result-btn" onClick={onRetake}>
            Retake Assessment
          </button>
          <Link href="/experiments/test-c" className="tc-result-btn primary">
            Back to Contents
          </Link>
        </div>

        <div className="tc-result-colophon">
          <span>Personality Studio</span>
          <span>Editorial / Magazine Concept</span>
        </div>
      </div>
    </div>
  );
}
