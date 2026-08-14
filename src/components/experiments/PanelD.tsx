import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import {
  assessments,
  combinedContent,
  footerContent,
  heroContent,
  navContent,
} from "@/data/personalityContent";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--td-font" });

const GLOWS = ["#7c8cff", "#37e0c4", "#ff7ab8", "#ffcf5c"];

const QUIZ_SLUG: Record<string, string> = {
  mbti: "mbti",
  bigfive: "big-five",
  humandesign: "human-design",
  colors: "colors",
};

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
  overflow: hidden;
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
[data-panel="d"] .td-wrap { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 28px 24px 110px; perspective: 1400px; }

[data-panel="d"] .td-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 16px;
  background: rgba(13, 18, 36, 0.6);
  border: 1px solid var(--td-line);
  backdrop-filter: blur(8px);
  margin-bottom: 72px;
}
[data-panel="d"] .td-brand { font-weight: 700; font-size: 15px; letter-spacing: 0.01em; }
[data-panel="d"] .td-brand span { color: #7c8cff; }
[data-panel="d"] .td-navdot { width: 8px; height: 8px; border-radius: 999px; background: #37e0c4; box-shadow: 0 0 12px #37e0c4; }

[data-panel="d"] .td-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; }
@media (max-width: 780px) { [data-panel="d"] .td-hero { grid-template-columns: 1fr; } }
[data-panel="d"] .td-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9fa8ff;
  border: 1px solid var(--td-line);
  border-radius: 999px;
  padding: 7px 14px;
  margin-bottom: 22px;
}
[data-panel="d"] .td-h1 { font-size: clamp(2.1rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.12; margin: 0 0 20px; }
[data-panel="d"] .td-h1 .accent { background: linear-gradient(90deg, #7c8cff, #37e0c4); -webkit-background-clip: text; background-clip: text; color: transparent; }
[data-panel="d"] .td-sub { font-size: 15px; line-height: 1.75; color: var(--td-muted); max-width: 460px; }

[data-panel="d"] .td-stack { position: relative; height: 260px; transform-style: preserve-3d; }
[data-panel="d"] .td-tile {
  position: absolute;
  width: 190px;
  border-radius: 20px;
  border: 1px solid var(--td-line);
  background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  box-shadow: 0 30px 60px rgba(0,0,0,0.55);
  padding: 16px;
  backdrop-filter: blur(6px);
}
[data-panel="d"] .td-tile.t1 { top: 0; left: 20px; transform: rotateY(-14deg) rotateX(6deg) translateZ(10px); }
[data-panel="d"] .td-tile.t2 { top: 40px; left: 130px; transform: rotateY(-6deg) rotateX(2deg) translateZ(50px); z-index: 2; }
[data-panel="d"] .td-tile.t3 { top: 120px; left: 60px; transform: rotateY(-18deg) rotateX(10deg) translateZ(-10px); opacity: 0.85; }
[data-panel="d"] .td-tile .dot { width: 26px; height: 26px; border-radius: 9px; margin-bottom: 10px; }
[data-panel="d"] .td-tile .lbl { font-size: 13px; font-weight: 600; }
[data-panel="d"] .td-tile .sub { font-size: 11px; color: var(--td-muted); margin-top: 4px; }

[data-panel="d"] .td-section-label { margin: 88px 0 24px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--td-muted); }

[data-panel="d"] .td-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (max-width: 780px) { [data-panel="d"] .td-grid { grid-template-columns: 1fr; } }
[data-panel="d"] .td-card {
  position: relative;
  border-radius: 22px;
  border: 1px solid var(--td-line);
  background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
  padding: 24px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  transform-style: preserve-3d;
  text-decoration: none;
  color: inherit;
  display: block;
}
[data-panel="d"] .td-card:hover { transform: rotateX(4deg) rotateY(-4deg) translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
[data-panel="d"] .td-card .badge {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #05070f;
  margin-bottom: 16px;
}
[data-panel="d"] .td-card h3 { font-size: 18px; font-weight: 700; margin: 0 0 4px; }
[data-panel="d"] .td-card .tag { font-size: 12px; color: var(--td-muted); margin-bottom: 12px; }
[data-panel="d"] .td-card p.desc { font-size: 13px; line-height: 1.65; color: var(--td-muted); margin: 0 0 16px; }
[data-panel="d"] .td-card .meta { display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid var(--td-line); padding-top: 12px; color: #b7bdea; }

[data-panel="d"] .td-cta {
  margin-top: 72px;
  border-radius: 28px;
  padding: 40px 36px;
  background: linear-gradient(135deg, rgba(124,140,255,0.16), rgba(55,224,196,0.1));
  border: 1px solid var(--td-line);
  box-shadow: 0 30px 70px rgba(0,0,0,0.5);
  text-align: center;
}
[data-panel="d"] .td-cta h2 { font-size: 24px; margin: 0 0 10px; }
[data-panel="d"] .td-cta p { max-width: 480px; margin: 0 auto 24px; color: var(--td-muted); font-size: 14px; line-height: 1.7; }
[data-panel="d"] .td-btn {
  display: inline-block;
  padding: 14px 30px;
  border-radius: 14px;
  background: linear-gradient(90deg, #7c8cff, #37e0c4);
  color: #05070f;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 16px 34px rgba(124,140,255,0.35);
}

[data-panel="d"] .td-footer { margin-top: 44px; text-align: center; font-size: 12px; color: var(--td-muted); }
`;

export default function PanelD() {
  return (
    <div className={`exp-panel ${grotesk.variable}`} data-panel="d">
      <style>{CSS}</style>
      <div className="td-grid-bg" />
      <div className="td-wrap">
        <div className="td-nav">
          <div className="td-brand">
            <span>◆</span> {navContent.brand}
          </div>
          <div className="td-navdot" />
        </div>

        <div className="td-hero">
          <div>
            <div className="td-eyebrow">{heroContent.eyebrow}</div>
            <h1 className="td-h1">
              {heroContent.titleLead} <span className="accent">{heroContent.titleAccent}</span>
            </h1>
            <p className="td-sub">{heroContent.subtitle}</p>
          </div>
          <div className="td-stack">
            {assessments.slice(0, 3).map((a, i) => (
              <div className={`td-tile t${i + 1}`} key={a.id}>
                <div className="dot" style={{ background: GLOWS[i] }} />
                <div className="lbl">{a.label}</div>
                <div className="sub">{a.tagline}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="td-section-label">// assessment modules</div>
        <div className="td-grid">
          {assessments.map((a, i) => (
            <Link href={`/experiments/test-d/${QUIZ_SLUG[a.id]}`} className="td-card" key={a.id}>
              <div className="badge" style={{ background: GLOWS[i] }}>
                {a.code}
              </div>
              <h3>{a.label}</h3>
              <div className="tag">{a.tagline}</div>
              <p className="desc">{a.description}</p>
              <div className="meta">
                <span>{a.questionCount} questions</span>
                <span>{a.resultSummary}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="td-cta">
          <h2>{combinedContent.title}</h2>
          <p>{combinedContent.body}</p>
          <div className="td-btn">{combinedContent.cta}</div>
        </div>

        <div className="td-footer">{footerContent.tagline}</div>
      </div>
    </div>
  );
}
