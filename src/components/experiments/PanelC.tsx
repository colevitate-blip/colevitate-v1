import { Playfair_Display, Work_Sans } from "next/font/google";
import Link from "next/link";
import {
  assessments,
  combinedContent,
  footerContent,
  heroContent,
  navContent,
} from "@/data/personalityContent";

const TEST_C_SLUG: Record<string, string> = {
  mbti: "mbti",
  bigfive: "big-five",
  humandesign: "human-design",
  colors: "colors",
};

const serif = Playfair_Display({ subsets: ["latin"], weight: ["500", "700", "900"], style: ["normal", "italic"], variable: "--tc-serif" });
const sans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--tc-sans" });

const CSS = `
[data-panel="c"] {
  --tc-ink: #201d1a;
  --tc-muted: #6b6459;
  --tc-rule: #d8d0c2;
  --tc-accent: #a3372c;
  font-family: var(--tc-sans), sans-serif;
  background: #fbf8f2;
  color: var(--tc-ink);
}
[data-panel="c"] .tc-wrap { max-width: 1080px; margin: 0 auto; padding: 28px 24px 96px; }

[data-panel="c"] .tc-masthead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 3px solid var(--tc-ink);
  margin-bottom: 10px;
}
[data-panel="c"] .tc-brand {
  font-family: var(--tc-serif), serif;
  font-weight: 900;
  font-size: 26px;
  letter-spacing: -0.01em;
}
[data-panel="c"] .tc-issue { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--tc-muted); }
[data-panel="c"] .tc-subrule {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tc-muted);
  padding: 8px 0 40px;
  border-bottom: 1px solid var(--tc-rule);
  margin-bottom: 40px;
}

[data-panel="c"] .tc-hero { display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: end; }
@media (max-width: 780px) { [data-panel="c"] .tc-hero { grid-template-columns: 1fr; } }
[data-panel="c"] .tc-kicker { font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--tc-accent); font-weight: 600; margin-bottom: 18px; }
[data-panel="c"] .tc-h1 {
  font-family: var(--tc-serif), serif;
  font-weight: 700;
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  line-height: 1.02;
  margin: 0 0 22px;
}
[data-panel="c"] .tc-h1 em { font-style: italic; color: var(--tc-accent); }
[data-panel="c"] .tc-dropcol { font-size: 15px; line-height: 1.8; color: var(--tc-ink); }
[data-panel="c"] .tc-drop {
  float: left;
  font-family: var(--tc-serif), serif;
  font-size: 64px;
  line-height: 0.8;
  padding: 8px 10px 0 0;
  font-weight: 700;
  color: var(--tc-accent);
}
[data-panel="c"] .tc-standfirst { font-size: 15px; line-height: 1.85; color: var(--tc-muted); border-left: 2px solid var(--tc-rule); padding-left: 20px; }

[data-panel="c"] .tc-index { margin-top: 68px; }
[data-panel="c"] .tc-index-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--tc-muted); border-bottom: 1px solid var(--tc-ink); padding-bottom: 10px; margin-bottom: 28px; }

[data-panel="c"] .tc-articles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
@media (max-width: 780px) { [data-panel="c"] .tc-articles { grid-template-columns: 1fr; } }
[data-panel="c"] .tc-article {
  padding: 28px 28px 30px 0;
  border-bottom: 1px solid var(--tc-rule);
  text-decoration: none;
  color: inherit;
  display: block;
}
[data-panel="c"] .tc-articles > .tc-article:nth-child(odd) { border-right: 1px solid var(--tc-rule); padding-right: 32px; }
[data-panel="c"] .tc-articles > .tc-article:nth-child(even) { padding-left: 32px; }
[data-panel="c"] .tc-num {
  font-family: var(--tc-serif), serif;
  font-size: 42px;
  font-weight: 700;
  color: var(--tc-rule);
  line-height: 1;
  margin-bottom: 8px;
}
[data-panel="c"] .tc-article h3 { font-family: var(--tc-serif), serif; font-size: 24px; font-weight: 700; margin: 0 0 6px; }
[data-panel="c"] .tc-article .tag { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--tc-accent); font-weight: 600; margin-bottom: 10px; }
[data-panel="c"] .tc-article p.desc { font-size: 14px; line-height: 1.75; color: var(--tc-muted); margin: 0 0 12px; }
[data-panel="c"] .tc-article .meta { font-size: 12px; color: var(--tc-ink); display: flex; justify-content: space-between; border-top: 1px dotted var(--tc-rule); padding-top: 10px; }

[data-panel="c"] .tc-pullquote {
  margin: 72px 0 0;
  padding: 56px 10px;
  border-top: 3px solid var(--tc-ink);
  border-bottom: 3px solid var(--tc-ink);
  text-align: center;
}
[data-panel="c"] .tc-pullquote .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--tc-accent); margin-bottom: 16px; font-weight: 600; }
[data-panel="c"] .tc-pullquote h2 { font-family: var(--tc-serif), serif; font-style: italic; font-weight: 500; font-size: clamp(1.6rem, 4vw, 2.4rem); max-width: 640px; margin: 0 auto 20px; line-height: 1.3; }
[data-panel="c"] .tc-pullquote p { max-width: 480px; margin: 0 auto 26px; color: var(--tc-muted); font-size: 14px; line-height: 1.7; }
[data-panel="c"] .tc-btn {
  display: inline-block;
  border: 1px solid var(--tc-ink);
  padding: 12px 28px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

[data-panel="c"] .tc-colophon {
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

const romanNumerals = ["I", "II", "III", "IV"];

export default function PanelC() {
  return (
    <div className={`exp-panel ${serif.variable} ${sans.variable}`} data-panel="c">
      <style>{CSS}</style>
      <div className="tc-wrap">
        <div className="tc-masthead">
          <div className="tc-brand">{navContent.brand}</div>
          <div className="tc-issue">Vol. 01 — Self&nbsp;Knowledge</div>
        </div>
        <div className="tc-subrule">
          <span>Four Frameworks</span>
          <span>One Combined Profile</span>
        </div>

        <div className="tc-hero">
          <div>
            <div className="tc-kicker">{heroContent.eyebrow}</div>
            <h1 className="tc-h1">
              {heroContent.titleLead} <em>{heroContent.titleAccent}</em>
            </h1>
            <p className="tc-dropcol">
              <span className="tc-drop">{heroContent.subtitle.charAt(0)}</span>
              {heroContent.subtitle.slice(1)}
            </p>
          </div>
          <p className="tc-standfirst">
            Every result below is woven, section by section, into a single reading of who you are — no two threads told the same way twice.
          </p>
        </div>

        <div className="tc-index">
          <div className="tc-index-label">Contents</div>
          <div className="tc-articles">
            {assessments.map((a, i) => (
              <Link href={`/experiments/test-c/${TEST_C_SLUG[a.id]}`} className="tc-article" key={a.id}>
                <div className="tc-num">{romanNumerals[i]}</div>
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
        </div>

        <div className="tc-pullquote">
          <div className="label">Feature</div>
          <h2>&ldquo;{combinedContent.title} — {combinedContent.body}&rdquo;</h2>
          <p>Four readings, one portrait — assembled the moment you finish the last page.</p>
          <div className="tc-btn">{combinedContent.cta}</div>
        </div>

        <div className="tc-colophon">
          <span>{footerContent.brand}</span>
          <span>{footerContent.tagline}</span>
        </div>
      </div>
    </div>
  );
}
