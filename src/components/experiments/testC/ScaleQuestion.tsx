"use client";

// Editorial-themed 5-point scale question card — used both for MBTI's
// bipolar statements (statementA / statementB) and Big Five's Likert
// agreement scale (generic "Strongly disagree" / "Strongly agree" labels).

const CSS = `
.tc-quiz-scaleq { max-width: 720px; }
.tc-quiz-scaleq .tc-quiz-kicker {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--tc-accent);
  font-weight: 600;
  margin-bottom: 16px;
}
.tc-quiz-scaleq .tc-quiz-prompt {
  font-family: var(--tc-serif), serif;
  font-weight: 700;
  font-size: clamp(1.6rem, 3.6vw, 2.3rem);
  line-height: 1.15;
  margin: 0 0 40px;
}
.tc-quiz-scale { }
.tc-quiz-scale-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--tc-rule);
  border-bottom: 1px solid var(--tc-rule);
  padding: 22px 0;
  margin-bottom: 18px;
}
.tc-quiz-scale-dot {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid var(--tc-ink);
  background: transparent;
  font-family: var(--tc-serif), serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--tc-ink);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.tc-quiz-scale-dot:hover { transform: translateY(-2px); }
.tc-quiz-scale-dot.active {
  background: var(--tc-accent);
  border-color: var(--tc-accent);
  color: #fbf8f2;
}
.tc-quiz-scale-labels {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}
.tc-quiz-scale-label {
  font-size: 14px;
  line-height: 1.6;
  color: var(--tc-muted);
  max-width: 44%;
}
.tc-quiz-scale-label.left { text-align: left; }
.tc-quiz-scale-label.right { text-align: right; }
.tc-quiz-scale-label strong { color: var(--tc-ink); font-weight: 600; }
@media (max-width: 600px) {
  .tc-quiz-scale-dot { width: 38px; height: 38px; font-size: 14px; }
  .tc-quiz-scale-labels { flex-direction: column; gap: 10px; }
  .tc-quiz-scale-label { max-width: 100%; }
  .tc-quiz-scale-label.right { text-align: left; }
}
`;

interface ScaleQuestionProps {
  index: number;
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function ScaleQuestion({
  index,
  prompt,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: ScaleQuestionProps) {
  return (
    <div className="tc-quiz-scaleq">
      <style>{CSS}</style>
      <div className="tc-quiz-kicker">Question {index}</div>
      <h2 className="tc-quiz-prompt">{prompt}</h2>
      <div className="tc-quiz-scale">
        <div className="tc-quiz-scale-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`tc-quiz-scale-dot${value === n ? " active" : ""}`}
              onClick={() => onChange(n)}
              aria-pressed={value === n}
              aria-label={`${n} of 5`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="tc-quiz-scale-labels">
          <span className="tc-quiz-scale-label left">{leftLabel}</span>
          <span className="tc-quiz-scale-label right">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}
