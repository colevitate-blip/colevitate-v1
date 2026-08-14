import { Baloo_2, Nunito } from "next/font/google";
import Link from "next/link";
import {
  assessments,
  combinedContent,
  footerContent,
  heroContent,
  navContent,
} from "@/data/personalityContent";

const QUIZ_SLUGS: Record<string, string> = {
  mbti: "mbti",
  bigfive: "big-five",
  humandesign: "human-design",
  colors: "colors",
};

const heading = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--tb-heading" });
const body = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--tb-body" });

const COLORS = ["#7c6cf0", "#37c2a8", "#f0708e", "#f2b544"];

const CSS = `
[data-panel="b"] {
  --tb-ink: #34324a;
  --tb-muted: #7c7a94;
  font-family: var(--tb-body), sans-serif;
  color: var(--tb-ink);
  background:
    radial-gradient(60% 50% at 85% -10%, #ffe1ea 0%, transparent 60%),
    radial-gradient(50% 40% at 5% 10%, #dcecff 0%, transparent 60%),
    radial-gradient(55% 45% at 30% 100%, #e3f6e6 0%, transparent 60%),
    #fbf9ff;
  position: relative;
  overflow: hidden;
}
[data-panel="b"] .tb-blob {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  opacity: 0.55;
  z-index: 0;
}
[data-panel="b"] .tb-blob.one { width: 260px; height: 260px; background: #ffd3e2; top: -80px; right: 6%; }
[data-panel="b"] .tb-blob.two { width: 180px; height: 180px; background: #cfe8ff; bottom: 10%; left: -60px; }

[data-panel="b"] .tb-wrap { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 28px 24px 96px; }

[data-panel="b"] .tb-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 10px 30px rgba(124, 108, 240, 0.12);
  width: fit-content;
  margin-bottom: 56px;
}
[data-panel="b"] .tb-logo {
  width: 30px; height: 30px; border-radius: 999px;
  background: linear-gradient(135deg, #7c6cf0, #37c2a8);
}
[data-panel="b"] .tb-navtext { font-family: var(--tb-heading), sans-serif; font-weight: 700; font-size: 15px; }

[data-panel="b"] .tb-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #7c6cf0;
  box-shadow: 0 8px 20px rgba(124, 108, 240, 0.14);
  margin-bottom: 22px;
}
[data-panel="b"] .tb-h1 {
  font-family: var(--tb-heading), sans-serif;
  font-weight: 800;
  font-size: clamp(2.4rem, 6vw, 3.8rem);
  line-height: 1.08;
  margin: 0 0 20px;
  max-width: 720px;
}
[data-panel="b"] .tb-h1 .accent {
  background: linear-gradient(90deg, #7c6cf0, #f0708e 60%, #f2b544);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
[data-panel="b"] .tb-sub {
  max-width: 560px;
  font-size: 17px;
  line-height: 1.7;
  color: var(--tb-muted);
  margin-bottom: 8px;
}

[data-panel="b"] .tb-grid {
  margin-top: 56px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}
@media (max-width: 720px) { [data-panel="b"] .tb-grid { grid-template-columns: 1fr; } }

[data-panel="b"] .tb-card {
  background: #fff;
  border-radius: 32px;
  padding: 26px 26px 24px;
  box-shadow: 0 18px 40px rgba(124, 108, 240, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}
[data-panel="b"] .tb-card:hover { transform: translateY(-6px); box-shadow: 0 26px 50px rgba(124, 108, 240, 0.18); }
[data-panel="b"] .tb-icon {
  width: 52px; height: 52px; border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 800; font-family: var(--tb-heading), sans-serif;
  margin-bottom: 16px;
}
[data-panel="b"] .tb-card-title { font-family: var(--tb-heading), sans-serif; font-weight: 700; font-size: 19px; margin: 0 0 4px; }
[data-panel="b"] .tb-card-tag { font-size: 13px; font-weight: 700; margin: 0 0 10px; opacity: 0.75; }
[data-panel="b"] .tb-card-desc { font-size: 14px; line-height: 1.65; color: var(--tb-muted); margin: 0 0 16px; }
[data-panel="b"] .tb-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f4f2ff;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #7c6cf0;
}

[data-panel="b"] .tb-cta {
  margin-top: 64px;
  border-radius: 40px;
  padding: 44px 40px;
  text-align: center;
  background: linear-gradient(135deg, #efe9ff, #ffe9f1);
  box-shadow: 0 24px 60px rgba(124, 108, 240, 0.16);
}
[data-panel="b"] .tb-cta h2 { font-family: var(--tb-heading), sans-serif; font-size: 26px; margin: 0 0 12px; }
[data-panel="b"] .tb-cta p { max-width: 480px; margin: 0 auto 24px; color: var(--tb-muted); font-size: 15px; line-height: 1.7; }
[data-panel="b"] .tb-btn {
  display: inline-block;
  padding: 15px 32px;
  border-radius: 999px;
  background: linear-gradient(90deg, #7c6cf0, #f0708e);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 16px 30px rgba(240, 112, 142, 0.35);
}

[data-panel="b"] .tb-footer {
  margin-top: 48px;
  text-align: center;
  font-size: 13px;
  color: var(--tb-muted);
}
`;

export default function PanelB() {
  return (
    <div className={`exp-panel ${heading.variable} ${body.variable}`} data-panel="b">
      <style>{CSS}</style>
      <div className="tb-blob one" />
      <div className="tb-blob two" />
      <div className="tb-wrap">
        <div className="tb-nav">
          <div className="tb-logo" />
          <div className="tb-navtext">{navContent.brand}</div>
        </div>

        <div className="tb-eyebrow">✨ {heroContent.eyebrow}</div>
        <h1 className="tb-h1">
          {heroContent.titleLead} <span className="accent">{heroContent.titleAccent}</span>
        </h1>
        <p className="tb-sub">{heroContent.subtitle}</p>

        <div className="tb-grid">
          {assessments.map((a, i) => (
            <Link href={`/experiments/test-b/${QUIZ_SLUGS[a.id] ?? a.id}`} className="tb-card" key={a.id}>
              <div className="tb-icon" style={{ background: COLORS[i] }}>
                {a.code.slice(0, 2)}
              </div>
              <h3 className="tb-card-title">{a.label}</h3>
              <p className="tb-card-tag" style={{ color: COLORS[i] }}>
                {a.tagline}
              </p>
              <p className="tb-card-desc">{a.description}</p>
              <div className="tb-pill">{a.questionCount} questions · {a.resultSummary}</div>
            </Link>
          ))}
        </div>

        <div className="tb-cta">
          <h2>{combinedContent.title}</h2>
          <p>{combinedContent.body}</p>
          <div className="tb-btn">{combinedContent.cta} →</div>
        </div>

        <div className="tb-footer">{footerContent.tagline}</div>
      </div>
    </div>
  );
}
