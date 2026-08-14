import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import {
  assessments,
  combinedContent,
  footerContent,
  heroContent,
  navContent,
} from "@/data/personalityContent";

const ASSESSMENT_QUIZ_SLUG: Record<string, string> = {
  mbti: "mbti",
  bigfive: "big-five",
  humandesign: "human-design",
  colors: "colors",
};

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--ta-font",
});

const CSS = `
[data-panel="a"] {
  --ta-bg: #060a06;
  --ta-panel: #0c130c;
  --ta-line: #1c3a24;
  --ta-green: #4dff9e;
  --ta-green-dim: #2fae72;
  --ta-amber: #ffb454;
  --ta-text: #b9f3cd;
  --ta-muted: #6f9b82;
  font-family: var(--ta-font), "JetBrains Mono", monospace;
  background: var(--ta-bg);
  color: var(--ta-text);
  position: relative;
  overflow: hidden;
}

[data-panel="a"] .ta-scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 255, 140, 0.035) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  mix-blend-mode: overlay;
}

[data-panel="a"] .ta-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 4;
  box-shadow: inset 0 0 180px rgba(0, 0, 0, 0.85);
}

[data-panel="a"] .ta-wrap {
  position: relative;
  z-index: 6;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px 96px;
}

[data-panel="a"] .ta-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--ta-line);
  background: linear-gradient(180deg, #0d160d, #060a06);
}
[data-panel="a"] .ta-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid var(--ta-line);
}
[data-panel="a"] .ta-dot.r { background: #ff6659; }
[data-panel="a"] .ta-dot.y { background: #ffcf5c; }
[data-panel="a"] .ta-dot.g { background: #63e08a; }
[data-panel="a"] .ta-titletext {
  margin-left: 10px;
  font-size: 12px;
  color: var(--ta-muted);
  letter-spacing: 0.04em;
}

[data-panel="a"] .ta-hero {
  padding: 64px 0 40px;
  border-bottom: 1px dashed var(--ta-line);
}
[data-panel="a"] .ta-prompt {
  color: var(--ta-green-dim);
  font-size: 13px;
  margin-bottom: 14px;
}
[data-panel="a"] .ta-prompt::before { content: "guest@personality-studio:~$ "; color: var(--ta-amber); }
[data-panel="a"] .ta-comment { color: var(--ta-muted); font-size: 13px; margin-bottom: 18px; }
[data-panel="a"] .ta-h1 {
  font-size: clamp(2.1rem, 5vw, 3.4rem);
  line-height: 1.12;
  font-weight: 700;
  margin: 0 0 20px;
  color: var(--ta-green);
  text-shadow: 0 0 18px rgba(77, 255, 158, 0.35);
}
[data-panel="a"] .ta-h1 .accent { color: var(--ta-amber); text-shadow: 0 0 18px rgba(255, 180, 84, 0.35); }
[data-panel="a"] .ta-h1 .cursor {
  display: inline-block;
  width: 0.5em;
  background: var(--ta-green);
  margin-left: 4px;
  animation: ta-blink 1.1s steps(1) infinite;
}
[data-panel="a"] .ta-sub {
  max-width: 640px;
  color: var(--ta-text);
  opacity: 0.85;
  font-size: 14px;
  line-height: 1.7;
}
[data-panel="a"] .ta-sub::before { content: "# "; color: var(--ta-green-dim); }

[data-panel="a"] .ta-section-label {
  margin: 44px 0 16px;
  font-size: 12px;
  color: var(--ta-green-dim);
  letter-spacing: 0.08em;
}
[data-panel="a"] .ta-section-label::before { content: "$ ls ./assessments"; }

[data-panel="a"] .ta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 720px) {
  [data-panel="a"] .ta-grid { grid-template-columns: 1fr; }
}
[data-panel="a"] .ta-card {
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  padding: 0;
  transition: border-color 0.15s ease, transform 0.15s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}
[data-panel="a"] .ta-card:hover {
  border-color: var(--ta-green-dim);
  transform: translateY(-2px);
}
[data-panel="a"] .ta-card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 14px;
  border-bottom: 1px solid var(--ta-line);
  font-size: 12px;
  color: var(--ta-muted);
}
[data-panel="a"] .ta-card-head .file { color: var(--ta-green); }
[data-panel="a"] .ta-card-body { padding: 16px 14px 18px; }
[data-panel="a"] .ta-card-title { font-size: 16px; font-weight: 700; color: var(--ta-text); margin: 0 0 4px; }
[data-panel="a"] .ta-card-tag { font-size: 12px; color: var(--ta-amber); margin: 0 0 10px; }
[data-panel="a"] .ta-card-desc { font-size: 13px; color: var(--ta-muted); line-height: 1.6; margin: 0 0 14px; }
[data-panel="a"] .ta-card-foot {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ta-green-dim);
  border-top: 1px dashed var(--ta-line);
  padding-top: 10px;
}

[data-panel="a"] .ta-cta {
  margin-top: 56px;
  border: 1px solid var(--ta-green-dim);
  background: radial-gradient(circle at 20% 0%, rgba(77, 255, 158, 0.08), transparent 60%), var(--ta-panel);
  padding: 32px 28px;
}
[data-panel="a"] .ta-cta h2 { font-size: 20px; margin: 0 0 10px; color: var(--ta-green); }
[data-panel="a"] .ta-cta p { font-size: 13px; color: var(--ta-muted); line-height: 1.6; margin: 0 0 20px; max-width: 560px; }
[data-panel="a"] .ta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--ta-green);
  color: var(--ta-green);
  background: rgba(77, 255, 158, 0.08);
  padding: 10px 18px;
  font-size: 13px;
  font-family: inherit;
  cursor: default;
}
[data-panel="a"] .ta-btn::before { content: ">"; color: var(--ta-amber); }

[data-panel="a"] .ta-footer {
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid var(--ta-line);
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ta-muted);
}
[data-panel="a"] .ta-footer .sq {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--ta-green);
  margin-left: 6px;
  animation: ta-blink 1.1s steps(1) infinite;
  vertical-align: -2px;
}

@keyframes ta-blink { 50% { opacity: 0; } }
`;

export default function PanelA() {
  return (
    <div className={`exp-panel ${mono.variable}`} data-panel="a">
      <style>{CSS}</style>
      <div className="ta-scanlines" />
      <div className="ta-glow" />
      <div className="ta-titlebar">
        <span className="ta-dot r" />
        <span className="ta-dot y" />
        <span className="ta-dot g" />
        <span className="ta-titletext">{navContent.brand.toLowerCase().replace(/\s+/g, "-")} — zsh</span>
      </div>
      <div className="ta-wrap">
        <section className="ta-hero">
          <div className="ta-prompt">./launch --app=personality-studio</div>
          <div className="ta-comment">{heroContent.eyebrow}</div>
          <h1 className="ta-h1">
            {heroContent.titleLead} <span className="accent">{heroContent.titleAccent}</span>
            <span className="cursor">&nbsp;</span>
          </h1>
          <p className="ta-sub">{heroContent.subtitle}</p>
        </section>

        <div className="ta-section-label" />
        <div className="ta-grid">
          {assessments.map((a) => (
            <Link
              href={`/experiments/test-a/${ASSESSMENT_QUIZ_SLUG[a.id] ?? a.id}`}
              className="ta-card"
              key={a.id}
            >
              <div className="ta-card-head">
                <span className="file">{a.id}.sh</span>
                <span>{a.code}</span>
              </div>
              <div className="ta-card-body">
                <h3 className="ta-card-title">{a.label}</h3>
                <p className="ta-card-tag">{a.tagline}</p>
                <p className="ta-card-desc">{a.description}</p>
                <div className="ta-card-foot">
                  <span>{a.questionCount} questions</span>
                  <span>{a.resultSummary}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="ta-cta">
          <h2>{combinedContent.title}</h2>
          <p>{combinedContent.body}</p>
          <div className="ta-btn">{combinedContent.cta.toLowerCase().replace(/\s+/g, "-")}</div>
        </div>

        <div className="ta-footer">
          <span>{footerContent.tagline}</span>
          <span>
            {footerContent.brand}
            <span className="sq" />
          </span>
        </div>
      </div>
    </div>
  );
}
