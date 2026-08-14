"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import type { ResultView } from "../resultView";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--td-font" });

const GLOWS = ["#7c8cff", "#37e0c4", "#ff7ab8", "#ffcf5c"];

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
[data-panel="d"] .td-result-wrap {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
  padding: 28px 24px 110px;
  perspective: 1400px;
}
[data-panel="d"] .td-result-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 16px;
  background: rgba(13, 18, 36, 0.6);
  border: 1px solid var(--td-line);
  backdrop-filter: blur(8px);
  margin-bottom: 44px;
}
[data-panel="d"] .td-result-brand { font-weight: 700; font-size: 15px; }
[data-panel="d"] .td-result-brand span { color: #7c8cff; }
[data-panel="d"] .td-result-exit {
  font-size: 12px;
  color: var(--td-muted);
  text-decoration: none;
  border: 1px solid var(--td-line);
  border-radius: 999px;
  padding: 6px 14px;
  transition: color 0.18s ease, border-color 0.18s ease;
}
[data-panel="d"] .td-result-exit:hover { color: var(--td-text); border-color: #7c8cff; }

[data-panel="d"] .td-result-hero {
  text-align: center;
  margin-bottom: 48px;
}
[data-panel="d"] .td-result-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 72px;
  padding: 0 14px;
  border-radius: 20px;
  background: linear-gradient(135deg, #7c8cff, #37e0c4);
  color: #05070f;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 20px 44px rgba(124,140,255,0.4);
  margin-bottom: 20px;
}
[data-panel="d"] .td-result-name { font-size: clamp(1.7rem, 4vw, 2.4rem); font-weight: 700; margin: 0 0 8px; }
[data-panel="d"] .td-result-tagline { font-size: 14px; color: #9fa8ff; margin: 0 0 18px; }
[data-panel="d"] .td-result-desc {
  font-size: 15px;
  line-height: 1.75;
  color: var(--td-muted);
  max-width: 540px;
  margin: 0 auto;
}

[data-panel="d"] .td-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
@media (max-width: 680px) { [data-panel="d"] .td-result-grid { grid-template-columns: 1fr; } }
[data-panel="d"] .td-result-card {
  position: relative;
  border-radius: 22px;
  border: 1px solid var(--td-line);
  background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
  padding: 24px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
  transform-style: preserve-3d;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
[data-panel="d"] .td-result-card:hover { transform: rotateX(3deg) rotateY(-3deg) translateY(-4px); box-shadow: 0 26px 54px rgba(0,0,0,0.55); }
[data-panel="d"] .td-result-card h3 {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--td-muted);
  margin: 0 0 16px;
}
[data-panel="d"] .td-result-card ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
[data-panel="d"] .td-result-card li {
  font-size: 13.5px;
  line-height: 1.6;
  padding-left: 18px;
  position: relative;
  color: var(--td-text);
}
[data-panel="d"] .td-result-card li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7c8cff, #37e0c4);
}

[data-panel="d"] .td-result-traits {
  border-radius: 22px;
  border: 1px solid var(--td-line);
  background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
  padding: 24px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
  margin-bottom: 40px;
}
[data-panel="d"] .td-result-traits h3 {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--td-muted);
  margin: 0 0 18px;
}
[data-panel="d"] .td-result-trait { margin-bottom: 16px; }
[data-panel="d"] .td-result-trait:last-child { margin-bottom: 0; }
[data-panel="d"] .td-result-trait-label {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  margin-bottom: 7px;
  color: var(--td-text);
}
[data-panel="d"] .td-result-trait-label .cap { color: var(--td-muted); }
[data-panel="d"] .td-result-trait-track {
  height: 7px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--td-line);
  overflow: hidden;
}
[data-panel="d"] .td-result-trait-fill {
  height: 100%;
  border-radius: 999px;
  box-shadow: 0 0 12px rgba(124,140,255,0.5);
}

[data-panel="d"] .td-result-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
[data-panel="d"] .td-result-btn {
  display: inline-block;
  padding: 14px 30px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--td-line);
  background: transparent;
  color: var(--td-text);
  text-decoration: none;
  transition: border-color 0.18s ease, transform 0.18s ease;
}
[data-panel="d"] .td-result-btn:hover { border-color: #7c8cff; transform: translateY(-1px); }
[data-panel="d"] .td-result-btn-primary {
  border: none;
  background: linear-gradient(90deg, #7c8cff, #37e0c4);
  color: #05070f;
  box-shadow: 0 16px 34px rgba(124,140,255,0.35);
}
`;

interface ResultScreenProps {
  result: ResultView;
  onRetake: () => void;
  backHref?: string;
}

export default function ResultScreen({ result, onRetake, backHref = "/experiments/test-d" }: ResultScreenProps) {
  return (
    <div className={`exp-panel ${grotesk.variable}`} data-panel="d">
      <style>{CSS}</style>
      <div className="td-grid-bg" />
      <div className="td-result-wrap">
        <div className="td-result-nav">
          <div className="td-result-brand">
            <span>◆</span> Personality Studio
          </div>
          <Link href={backHref} className="td-result-exit">
            Exit
          </Link>
        </div>

        <div className="td-result-hero">
          <div className="td-result-badge">{result.code}</div>
          <h1 className="td-result-name">{result.name}</h1>
          <p className="td-result-tagline">{result.tagline}</p>
          <p className="td-result-desc">{result.description}</p>
        </div>

        {result.traits.length > 0 && (
          <div className="td-result-traits">
            <h3>Trait breakdown</h3>
            {result.traits.map((trait, i) => (
              <div className="td-result-trait" key={trait.label}>
                <div className="td-result-trait-label">
                  <span>{trait.label}</span>
                  <span className="cap">{trait.caption ? `${trait.caption} · ` : ""}{trait.value}%</span>
                </div>
                <div className="td-result-trait-track">
                  <div
                    className="td-result-trait-fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, trait.value))}%`,
                      background: `linear-gradient(90deg, ${GLOWS[i % GLOWS.length]}, ${GLOWS[(i + 1) % GLOWS.length]})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="td-result-grid">
          <div className="td-result-card">
            <h3>Strengths</h3>
            <ul>
              {result.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="td-result-card">
            <h3>Growth areas</h3>
            <ul>
              {result.growth.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="td-result-actions">
          <button type="button" className="td-result-btn" onClick={onRetake}>
            Retake
          </button>
          <Link href={backHref} className="td-result-btn td-result-btn-primary">
            Back to concept
          </Link>
        </div>
      </div>
    </div>
  );
}
