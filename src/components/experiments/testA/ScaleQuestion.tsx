// Themed 5-point scale question card — used for both MBTI's bipolar
// statementA/statementB questions and Big Five's Likert-style statements.
// Meant to be rendered inside <SurveyShell>, which provides the
// [data-panel="a"] ancestor and its CSS custom properties.
const CSS = `
[data-panel="a"] .ta-quiz-scale { position: relative; }
[data-panel="a"] .ta-quiz-scale-prompt {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ta-text);
  margin: 0 0 28px;
}
[data-panel="a"] .ta-quiz-scale-prompt .prefix {
  color: var(--ta-amber);
  margin-right: 8px;
}
[data-panel="a"] .ta-quiz-scale-row {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
[data-panel="a"] .ta-quiz-scale-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
[data-panel="a"] .ta-quiz-scale-dot {
  width: 44px;
  height: 44px;
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  color: var(--ta-muted);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
}
[data-panel="a"] .ta-quiz-scale-dot:hover {
  border-color: var(--ta-green-dim);
  color: var(--ta-text);
}
[data-panel="a"] .ta-quiz-scale-dot.active {
  border-color: var(--ta-green);
  color: var(--ta-bg);
  background: var(--ta-green);
  font-weight: 700;
  box-shadow: 0 0 16px rgba(77, 255, 158, 0.4);
}
[data-panel="a"] .ta-quiz-scale-labels {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
[data-panel="a"] .ta-quiz-scale-label {
  flex: 1;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ta-muted);
}
[data-panel="a"] .ta-quiz-scale-label.left {
  text-align: left;
  padding-right: 8px;
  border-left: 2px solid var(--ta-line);
  padding-left: 10px;
}
[data-panel="a"] .ta-quiz-scale-label.right {
  text-align: right;
  padding-left: 8px;
  border-right: 2px solid var(--ta-line);
  padding-right: 10px;
}
`;

export interface ScaleQuestionProps {
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function ScaleQuestion({ prompt, leftLabel, rightLabel, value, onChange }: ScaleQuestionProps) {
  return (
    <div className="ta-quiz-scale">
      <style>{CSS}</style>
      <p className="ta-quiz-scale-prompt">
        <span className="prefix">$</span>
        {prompt}
      </p>
      <div className="ta-quiz-scale-row">
        <div className="ta-quiz-scale-dots">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`ta-quiz-scale-dot${value === n ? " active" : ""}`}
              aria-pressed={value === n}
              aria-label={`${n} of 5`}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="ta-quiz-scale-labels">
          <span className="ta-quiz-scale-label left">{leftLabel}</span>
          <span className="ta-quiz-scale-label right">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}
