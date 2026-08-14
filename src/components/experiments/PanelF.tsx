import { Archivo } from "next/font/google";
import Link from "next/link";
import {
  assessments,
  combinedContent,
  footerContent,
  heroContent,
  navContent,
} from "@/data/personalityContent";

// Maps each assessment's content id to its Test F quiz route slug.
const ASSESSMENT_SLUG: Record<string, string> = {
  mbti: "mbti",
  bigfive: "big-five",
  humandesign: "human-design",
  colors: "colors",
};

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--tf-font" });

const CSS = `
[data-panel="f"] {
  --tf-ink: #111111;
  --tf-muted: #6a6a6a;
  --tf-rule: #dcdcdc;
  --tf-red: #e3161e;
  font-family: var(--tf-font), sans-serif;
  color: var(--tf-ink);
  background: #ffffff;
  letter-spacing: -0.01em;
}
[data-panel="f"] .tf-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px 100px; }

[data-panel="f"] .tf-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid var(--tf-ink);
}
[data-panel="f"] .tf-brand { font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.02em; }
[data-panel="f"] .tf-navmeta { font-size: 12px; color: var(--tf-muted); text-transform: uppercase; letter-spacing: 0.06em; }

[data-panel="f"] .tf-hero {
  padding: 64px 0 48px;
  border-bottom: 1px solid var(--tf-rule);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
@media (max-width: 780px) { [data-panel="f"] .tf-hero { grid-template-columns: 1fr; } }
[data-panel="f"] .tf-index-no { font-size: 12px; color: var(--tf-red); font-weight: 700; margin-bottom: 16px; }
[data-panel="f"] .tf-h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.02;
  margin: 0 0 24px;
}
[data-panel="f"] .tf-h1 .accent { color: var(--tf-red); }
[data-panel="f"] .tf-sub { font-size: 15px; line-height: 1.7; color: var(--tf-muted); max-width: 420px; align-self: end; }

[data-panel="f"] .tf-section {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 36px 0 20px;
}
[data-panel="f"] .tf-section .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
[data-panel="f"] .tf-section .count { font-size: 12px; color: var(--tf-muted); }

[data-panel="f"] .tf-list { border-top: 1px solid var(--tf-ink); }
[data-panel="f"] .tf-row {
  display: grid;
  grid-template-columns: 60px 1.2fr 1.6fr 1fr;
  gap: 20px;
  align-items: start;
  padding: 22px 0;
  border-bottom: 1px solid var(--tf-rule);
  text-decoration: none;
  color: inherit;
}
[data-panel="f"] .tf-row:hover .name { color: var(--tf-red); }
@media (max-width: 780px) { [data-panel="f"] .tf-row { grid-template-columns: 40px 1fr; } [data-panel="f"] .tf-row .desc, [data-panel="f"] .tf-row .meta { grid-column: 2; } }
[data-panel="f"] .tf-row .no { font-size: 13px; color: var(--tf-red); font-weight: 700; }
[data-panel="f"] .tf-row .name { font-size: 18px; font-weight: 700; }
[data-panel="f"] .tf-row .tag { font-size: 12px; color: var(--tf-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px; }
[data-panel="f"] .tf-row .desc { font-size: 13px; line-height: 1.65; color: var(--tf-muted); }
[data-panel="f"] .tf-row .meta { font-size: 12px; text-align: right; }
[data-panel="f"] .tf-row .meta .n { font-weight: 700; display: block; }

[data-panel="f"] .tf-cta {
  margin-top: 56px;
  border: 1px solid var(--tf-ink);
  padding: 40px 36px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
}
@media (max-width: 780px) { [data-panel="f"] .tf-cta { grid-template-columns: 1fr; } }
[data-panel="f"] .tf-cta h2 { font-size: 24px; font-weight: 700; margin: 0 0 12px; }
[data-panel="f"] .tf-cta p { font-size: 14px; color: var(--tf-muted); line-height: 1.65; max-width: 420px; }
[data-panel="f"] .tf-btn {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--tf-ink);
  background: var(--tf-red);
  color: #fff;
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

[data-panel="f"] .tf-footer {
  margin-top: 48px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tf-muted);
  border-top: 1px solid var(--tf-ink);
  padding-top: 16px;
}
`;

export default function PanelF() {
  return (
    <div className={`exp-panel ${archivo.variable}`} data-panel="f">
      <style>{CSS}</style>
      <div className="tf-wrap">
        <div className="tf-nav">
          <div className="tf-brand">{navContent.brand}</div>
          <div className="tf-navmeta">Ed. 04 / Assessments</div>
        </div>

        <div className="tf-hero">
          <div>
            <div className="tf-index-no">{heroContent.eyebrow}</div>
            <h1 className="tf-h1">
              {heroContent.titleLead} <span className="accent">{heroContent.titleAccent}</span>
            </h1>
          </div>
          <p className="tf-sub">{heroContent.subtitle}</p>
        </div>

        <div className="tf-section">
          <span className="label">Assessments</span>
          <span className="count">{String(assessments.length).padStart(2, "0")} total</span>
        </div>
        <div className="tf-list">
          {assessments.map((a, i) => (
            <Link
              href={`/experiments/test-f/${ASSESSMENT_SLUG[a.id] ?? a.id}`}
              className="tf-row"
              key={a.id}
            >
              <div className="no">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="name">{a.label}</div>
                <div className="tag">{a.tagline}</div>
              </div>
              <div className="desc">{a.description}</div>
              <div className="meta">
                <span className="n">{a.questionCount} questions</span>
                <span>{a.resultSummary}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="tf-cta">
          <div>
            <h2>{combinedContent.title}</h2>
            <p>{combinedContent.body}</p>
          </div>
          <div className="tf-btn">
            <span>{combinedContent.cta}</span>
            <span>→</span>
          </div>
        </div>

        <div className="tf-footer">
          <span>{footerContent.brand}</span>
          <span>{footerContent.tagline}</span>
        </div>
      </div>
    </div>
  );
}
