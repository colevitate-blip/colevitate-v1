"use client";

// Themed 5-point scale question card — used for both MBTI's bipolar
// statementA/statementB scale and Big Five's generic Likert scale.
// Pure presentational component: numbering, thin rules, red accent only.
const CSS = `
.tf-quiz-scale-card { padding: 4px 0; }
.tf-quiz-scale-head { display: flex; gap: 20px; align-items: baseline; margin-bottom: 28px; }
.tf-quiz-scale-no { font-size: 13px; font-weight: 700; color: var(--tf-red); flex: none; }
.tf-quiz-scale-prompt { font-size: clamp(1.15rem, 2.6vw, 1.6rem); font-weight: 700; line-height: 1.25; margin: 0; }

.tf-quiz-scale-track { display: grid; grid-template-columns: repeat(5, 1fr); border-top: 1px solid var(--tf-ink); border-bottom: 1px solid var(--tf-rule); }
.tf-quiz-scale-opt {
  appearance: none;
  border: none;
  border-right: 1px solid var(--tf-rule);
  background: #fff;
  cursor: pointer;
  padding: 22px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
.tf-quiz-scale-opt:last-child { border-right: none; }
.tf-quiz-scale-dot { width: 12px; height: 12px; border: 1px solid var(--tf-ink); border-radius: 50%; transition: background 0.12s ease, border-color 0.12s ease; }
.tf-quiz-scale-opt:hover .tf-quiz-scale-dot { border-color: var(--tf-red); }
.tf-quiz-scale-opt[aria-pressed="true"] .tf-quiz-scale-dot { background: var(--tf-red); border-color: var(--tf-red); }
.tf-quiz-scale-opt[aria-pressed="true"] { background: #fafafa; }

.tf-quiz-scale-labels { display: flex; justify-content: space-between; gap: 24px; margin-top: 14px; }
.tf-quiz-scale-label { font-size: 12px; line-height: 1.5; color: var(--tf-muted); max-width: 46%; }
.tf-quiz-scale-label.left { text-align: left; }
.tf-quiz-scale-label.right { text-align: right; }
`;

interface ScaleQuestionProps {
  index: number;
  total: number;
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  value?: number;
  onChange: (value: number) => void;
}

export default function ScaleQuestion({
  index,
  total,
  prompt,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: ScaleQuestionProps) {
  return (
    <div className="tf-quiz-scale-card">
      <style>{CSS}</style>
      <div className="tf-quiz-scale-head">
        <span className="tf-quiz-scale-no">{String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <h2 className="tf-quiz-scale-prompt">{prompt}</h2>
      </div>
      <div className="tf-quiz-scale-track" role="radiogroup" aria-label={prompt}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-pressed={value === n}
            className="tf-quiz-scale-opt"
            onClick={() => onChange(n)}
          >
            <span className="tf-quiz-scale-dot" />
          </button>
        ))}
      </div>
      <div className="tf-quiz-scale-labels">
        <span className="tf-quiz-scale-label left">{leftLabel}</span>
        <span className="tf-quiz-scale-label right">{rightLabel}</span>
      </div>
    </div>
  );
}
