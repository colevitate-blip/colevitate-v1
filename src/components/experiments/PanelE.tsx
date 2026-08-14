import { Anton, DM_Sans } from "next/font/google";
import Link from "next/link";
import {
  assessments,
  combinedContent,
  footerContent,
  heroContent,
  navContent,
} from "@/data/personalityContent";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--te-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--te-body" });

const POP = ["#ff2d78", "#2b5cff", "#f6ff3d", "#00e0a4"];

const QUIZ_SLUGS: Record<string, string> = {
  mbti: "mbti",
  bigfive: "big-five",
  humandesign: "human-design",
  colors: "colors",
};

const CSS = `
[data-panel="e"] {
  --te-ink: #101010;
  font-family: var(--te-body), sans-serif;
  color: var(--te-ink);
  background: #fff0f6;
  overflow: hidden;
}
[data-panel="e"] .te-marquee {
  background: var(--te-ink);
  color: #f6ff3d;
  font-family: var(--te-display), sans-serif;
  font-size: 15px;
  letter-spacing: 0.04em;
  padding: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-transform: uppercase;
}
[data-panel="e"] .te-marquee-track {
  display: inline-block;
  animation: te-scroll 16s linear infinite;
}
[data-panel="e"] .te-marquee span { margin: 0 22px; }
@keyframes te-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

[data-panel="e"] .te-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px 110px; }

[data-panel="e"] .te-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
[data-panel="e"] .te-brand {
  font-family: var(--te-display), sans-serif;
  font-size: 24px;
  text-transform: uppercase;
  background: var(--te-ink);
  color: #fff;
  padding: 6px 14px;
  display: inline-block;
  transform: rotate(-2deg);
}
[data-panel="e"] .te-navbadge {
  background: #2b5cff;
  color: #fff;
  font-weight: 900;
  font-size: 12px;
  padding: 8px 14px;
  border: 3px solid var(--te-ink);
  transform: rotate(3deg);
}

[data-panel="e"] .te-hero { position: relative; margin-bottom: 60px; }
[data-panel="e"] .te-eyebrow {
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
[data-panel="e"] .te-h1 {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: clamp(3rem, 9vw, 6.4rem);
  line-height: 0.92;
  margin: 0 0 26px;
  letter-spacing: -0.01em;
}
[data-panel="e"] .te-h1 .accent {
  color: #fff;
  -webkit-text-stroke: 2px var(--te-ink);
  text-shadow: 6px 6px 0 #2b5cff;
}
[data-panel="e"] .te-sub {
  max-width: 520px;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.6;
  background: #fff;
  border: 3px solid var(--te-ink);
  padding: 16px 20px;
  transform: rotate(-1deg);
}

[data-panel="e"] .te-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
@media (max-width: 780px) { [data-panel="e"] .te-grid { grid-template-columns: 1fr; } }
[data-panel="e"] .te-card {
  border: 4px solid var(--te-ink);
  background: #fff;
  padding: 22px;
  box-shadow: 10px 10px 0 var(--te-ink);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}
[data-panel="e"] .te-card:nth-child(even) { transform: rotate(1deg); }
[data-panel="e"] .te-card:nth-child(odd) { transform: rotate(-1deg); }
[data-panel="e"] .te-card:hover { transform: translate(-4px, -4px) rotate(0deg); box-shadow: 14px 14px 0 var(--te-ink); }
[data-panel="e"] .te-tagbox {
  display: inline-block;
  font-family: var(--te-display), sans-serif;
  font-size: 13px;
  color: #fff;
  padding: 4px 10px;
  margin-bottom: 14px;
  text-transform: uppercase;
}
[data-panel="e"] .te-card h3 { font-family: var(--te-display), sans-serif; text-transform: uppercase; font-size: 26px; margin: 0 0 8px; letter-spacing: -0.01em; }
[data-panel="e"] .te-card .tag { font-weight: 900; font-size: 13px; margin-bottom: 10px; }
[data-panel="e"] .te-card p.desc { font-size: 14px; line-height: 1.6; font-weight: 500; margin: 0 0 14px; }
[data-panel="e"] .te-card .meta { display: flex; justify-content: space-between; font-weight: 900; font-size: 12px; border-top: 3px solid var(--te-ink); padding-top: 10px; text-transform: uppercase; }

[data-panel="e"] .te-cta {
  margin-top: 64px;
  border: 4px solid var(--te-ink);
  background: #2b5cff;
  color: #fff;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 12px 12px 0 var(--te-ink);
}
[data-panel="e"] .te-cta h2 { font-family: var(--te-display), sans-serif; text-transform: uppercase; font-size: clamp(1.8rem, 4vw, 2.6rem); margin: 0 0 14px; }
[data-panel="e"] .te-cta p { max-width: 500px; margin: 0 auto 24px; font-weight: 700; font-size: 15px; line-height: 1.6; }
[data-panel="e"] .te-btn {
  display: inline-block;
  background: #f6ff3d;
  color: var(--te-ink);
  border: 3px solid var(--te-ink);
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: 16px;
  padding: 14px 30px;
  transform: rotate(-2deg);
}

[data-panel="e"] .te-footer { margin-top: 44px; text-align: center; font-weight: 700; font-size: 13px; }
`;

export default function PanelE() {
  return (
    <div className={`exp-panel ${display.variable} ${body.variable}`} data-panel="e">
      <style>{CSS}</style>
      <div className="te-marquee">
        <div className="te-marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              {assessments.map((a) => (
                <span key={a.id}>★ {a.label}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="te-wrap">
        <div className="te-nav">
          <div className="te-brand">{navContent.brand}</div>
          <div className="te-navbadge">4 in 1</div>
        </div>

        <div className="te-hero">
          <div className="te-eyebrow">{heroContent.eyebrow}</div>
          <h1 className="te-h1">
            {heroContent.titleLead}
            <br />
            <span className="accent">{heroContent.titleAccent}</span>
          </h1>
          <p className="te-sub">{heroContent.subtitle}</p>
        </div>

        <div className="te-grid">
          {assessments.map((a, i) => (
            <Link href={`/experiments/test-e/${QUIZ_SLUGS[a.id]}`} className="te-card" key={a.id}>
              <span className="te-tagbox" style={{ background: POP[i] }}>
                {a.code}
              </span>
              <h3>{a.label}</h3>
              <div className="tag">{a.tagline}</div>
              <p className="desc">{a.description}</p>
              <div className="meta">
                <span>{a.questionCount} Q</span>
                <span>{a.resultSummary}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="te-cta">
          <h2>{combinedContent.title}</h2>
          <p>{combinedContent.body}</p>
          <div className="te-btn">{combinedContent.cta}</div>
        </div>

        <div className="te-footer">{footerContent.tagline}</div>
      </div>
    </div>
  );
}
