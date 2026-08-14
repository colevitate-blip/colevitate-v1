"use client";

import Link from "next/link";
import type { ResultView } from "@/components/experiments/resultView";
import { archivo, TF_ROOT_CSS } from "./theme";

// Single themed result screen shared by all four frameworks — consumes the
// common ResultView shape so no per-framework result UI is needed.
const CSS = `
[data-panel="f"] .tf-result-wrap { max-width: 880px; margin: 0 auto; padding: 0 24px 100px; }

[data-panel="f"] .tf-result-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid var(--tf-ink);
}
[data-panel="f"] .tf-result-brand { font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.02em; text-decoration: none; color: inherit; }
[data-panel="f"] .tf-result-exit { font-size: 12px; color: var(--tf-muted); text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; }
[data-panel="f"] .tf-result-exit:hover { color: var(--tf-red); }

[data-panel="f"] .tf-result-hero {
  padding: 56px 0 40px;
  border-bottom: 1px solid var(--tf-rule);
}
[data-panel="f"] .tf-result-eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: var(--tf-red); margin-bottom: 18px; }
[data-panel="f"] .tf-result-code { font-size: clamp(2.6rem, 8vw, 5rem); font-weight: 700; line-height: 1; margin: 0 0 12px; }
[data-panel="f"] .tf-result-name { font-size: 18px; font-weight: 700; margin: 0 0 16px; }
[data-panel="f"] .tf-result-tagline { font-size: 14px; color: var(--tf-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0; }

[data-panel="f"] .tf-result-desc { padding: 32px 0; border-bottom: 1px solid var(--tf-rule); font-size: 15px; line-height: 1.75; color: var(--tf-ink); max-width: 640px; }

[data-panel="f"] .tf-result-traits { padding: 36px 0; border-bottom: 1px solid var(--tf-rule); }
[data-panel="f"] .tf-result-section-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 24px; }
[data-panel="f"] .tf-result-trait { padding: 14px 0; border-bottom: 1px solid var(--tf-rule); }
[data-panel="f"] .tf-result-trait:last-child { border-bottom: none; }
[data-panel="f"] .tf-result-trait-head { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
[data-panel="f"] .tf-result-trait-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; }
[data-panel="f"] .tf-result-trait-caption { color: var(--tf-muted); }
[data-panel="f"] .tf-result-trait-value { color: var(--tf-muted); }
[data-panel="f"] .tf-result-trait-track { height: 3px; background: var(--tf-rule); }
[data-panel="f"] .tf-result-trait-fill { height: 3px; background: var(--tf-red); }

[data-panel="f"] .tf-result-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 36px 0; }
@media (max-width: 700px) { [data-panel="f"] .tf-result-cols { grid-template-columns: 1fr; } }
[data-panel="f"] .tf-result-list { list-style: none; margin: 0; padding: 0; }
[data-panel="f"] .tf-result-list li { display: flex; gap: 14px; font-size: 14px; line-height: 1.6; padding: 12px 0; border-bottom: 1px solid var(--tf-rule); }
[data-panel="f"] .tf-result-list li:last-child { border-bottom: none; }
[data-panel="f"] .tf-result-list li .n { color: var(--tf-red); font-weight: 700; flex: none; }

[data-panel="f"] .tf-result-actions { display: flex; gap: 16px; padding-top: 40px; flex-wrap: wrap; }
[data-panel="f"] .tf-result-btn {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--tf-ink);
  background: #fff;
  color: var(--tf-ink);
  padding: 14px 22px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
}
[data-panel="f"] .tf-result-btn-primary { background: var(--tf-red); color: #fff; border-color: var(--tf-red); }
`;

interface ResultScreenProps {
  view: ResultView;
  onRetake: () => void;
  backHref: string;
}

export default function ResultScreen({ view, onRetake, backHref }: ResultScreenProps) {
  return (
    <div className={`exp-panel ${archivo.variable}`} data-panel="f">
      <style>{TF_ROOT_CSS + CSS}</style>
      <div className="tf-result-wrap">
        <div className="tf-result-nav">
          <Link href={backHref} className="tf-result-brand">
            Personality Studio
          </Link>
          <Link href={backHref} className="tf-result-exit">
            Exit
          </Link>
        </div>

        <div className="tf-result-hero">
          <div className="tf-result-eyebrow">Your Result</div>
          <h1 className="tf-result-code">{view.code}</h1>
          <p className="tf-result-name">{view.name}</p>
          <p className="tf-result-tagline">{view.tagline}</p>
        </div>

        <p className="tf-result-desc">{view.description}</p>

        {view.traits.length > 0 && (
          <div className="tf-result-traits">
            <div className="tf-result-section-label">Trait Breakdown</div>
            {view.traits.map((t) => (
              <div className="tf-result-trait" key={t.label}>
                <div className="tf-result-trait-head">
                  <span className="tf-result-trait-label">{t.label}</span>
                  <span>
                    {t.caption && <span className="tf-result-trait-caption">{t.caption} — </span>}
                    <span className="tf-result-trait-value">{t.value}%</span>
                  </span>
                </div>
                <div className="tf-result-trait-track">
                  <div className="tf-result-trait-fill" style={{ width: `${Math.max(0, Math.min(100, t.value))}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="tf-result-cols">
          <div>
            <div className="tf-result-section-label">Strengths</div>
            <ul className="tf-result-list">
              {view.strengths.map((s, i) => (
                <li key={i}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="tf-result-section-label">Growth Areas</div>
            <ul className="tf-result-list">
              {view.growth.map((g, i) => (
                <li key={i}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tf-result-actions">
          <button type="button" className="tf-result-btn tf-result-btn-primary" onClick={onRetake}>
            Retake
          </button>
          <Link href={backHref} className="tf-result-btn">
            Back to Concept
          </Link>
        </div>
      </div>
    </div>
  );
}
