"use client";

import Link from "next/link";
import { Anton, DM_Sans } from "next/font/google";
import type { ResultView } from "@/components/experiments/resultView";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--te-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--te-body" });

const POP = ["#ff2d78", "#2b5cff", "#f6ff3d", "#00e0a4"];

const CSS = `
.te-result-root {
  --te-ink: #101010;
  font-family: var(--te-body), sans-serif;
  color: var(--te-ink);
  background: #fff0f6;
  min-height: 100vh;
}
.te-result-wrap { max-width: 760px; margin: 0 auto; padding: 40px 24px 90px; }

.te-result-eyebrow {
  display: inline-block;
  background: #f6ff3d;
  border: 3px solid var(--te-ink);
  font-weight: 900;
  font-size: 13px;
  text-transform: uppercase;
  padding: 8px 16px;
  transform: rotate(-3deg);
  margin-bottom: 22px;
}
.te-result-code {
  display: inline-block;
  font-family: var(--te-display), sans-serif;
  font-size: 15px;
  color: #fff;
  background: var(--te-ink);
  padding: 6px 14px;
  margin-bottom: 14px;
  text-transform: uppercase;
}
.te-result-name {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: clamp(2.4rem, 8vw, 4.4rem);
  line-height: 0.92;
  margin: 0 0 18px;
  letter-spacing: -0.01em;
}
.te-result-tagline {
  font-weight: 900;
  font-size: 18px;
  margin: 0 0 20px;
}
.te-result-desc {
  background: #fff;
  border: 3px solid var(--te-ink);
  padding: 18px 20px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.7;
  margin-bottom: 32px;
  transform: rotate(-0.5deg);
}

.te-result-section-title {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 22px;
  margin: 0 0 14px;
}
.te-result-lists {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
@media (max-width: 620px) { .te-result-lists { grid-template-columns: 1fr; } }
.te-result-list-block {
  border: 4px solid var(--te-ink);
  background: #fff;
  padding: 18px;
  box-shadow: 8px 8px 0 var(--te-ink);
}
.te-result-list-block h3 {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 17px;
  margin: 0 0 10px;
}
.te-result-list-block ul { margin: 0; padding-left: 20px; }
.te-result-list-block li { font-weight: 700; font-size: 14px; line-height: 1.6; margin-bottom: 6px; }

.te-result-traits { margin-bottom: 40px; }
.te-result-trait { margin-bottom: 16px; }
.te-result-trait-head {
  display: flex;
  justify-content: space-between;
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  margin-bottom: 6px;
}
.te-result-trait-track {
  border: 3px solid var(--te-ink);
  background: #fff;
  height: 20px;
  padding: 2px;
}
.te-result-trait-fill {
  height: 100%;
}

.te-result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.te-result-btn {
  display: inline-block;
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 15px;
  border: 3px solid var(--te-ink);
  padding: 14px 28px;
  cursor: pointer;
  box-shadow: 6px 6px 0 var(--te-ink);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  text-decoration: none;
}
.te-result-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--te-ink);
}
.te-result-btn.retake { background: #f6ff3d; color: var(--te-ink); }
.te-result-btn.back { background: #fff; color: var(--te-ink); }
`;

interface ResultScreenProps {
  view: ResultView;
  onRetake: () => void;
  backHref?: string;
}

export function ResultScreen({ view, onRetake, backHref = "/experiments/test-e" }: ResultScreenProps) {
  return (
    <div className={`te-result-root ${display.variable} ${body.variable}`}>
      <style>{CSS}</style>
      <div className="te-result-wrap">
        <div className="te-result-eyebrow">Your Result</div>
        <div className="te-result-code">{view.code}</div>
        <h1 className="te-result-name">{view.name}</h1>
        <p className="te-result-tagline">{view.tagline}</p>
        <p className="te-result-desc">{view.description}</p>

        <div className="te-result-lists">
          <div className="te-result-list-block">
            <h3>Strengths</h3>
            <ul>
              {view.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="te-result-list-block">
            <h3>Growth Edges</h3>
            <ul>
              {view.growth.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        {view.traits.length > 0 ? (
          <div className="te-result-traits">
            <h2 className="te-result-section-title">Breakdown</h2>
            {view.traits.map((t, i) => (
              <div className="te-result-trait" key={t.label}>
                <div className="te-result-trait-head">
                  <span>{t.label}{t.caption ? ` — ${t.caption}` : ""}</span>
                  <span>{t.value}%</span>
                </div>
                <div className="te-result-trait-track">
                  <div
                    className="te-result-trait-fill"
                    style={{ width: `${Math.max(0, Math.min(100, t.value))}%`, background: POP[i % POP.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="te-result-actions">
          <button type="button" className="te-result-btn retake" onClick={onRetake}>
            Retake
          </button>
          <Link href={backHref} className="te-result-btn back">
            Back to Concept
          </Link>
        </div>
      </div>
    </div>
  );
}
