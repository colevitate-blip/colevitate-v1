const CSS = `
.tb-quiz-q-prompt {
  font-family: var(--tb-heading), sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 1.4;
  margin: 0 0 28px;
  color: var(--tb-ink);
}
.tb-quiz-scale {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 0 20px;
}
.tb-quiz-scale-btn {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: none;
  background: #f4f2ff;
  color: #7c6cf0;
  font-family: var(--tb-heading), sans-serif;
  font-weight: 700;
  font-size: 17px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.tb-quiz-scale-btn:hover { transform: translateY(-2px); }
.tb-quiz-scale-btn.active {
  background: linear-gradient(135deg, #7c6cf0, #f0708e);
  color: #fff;
  box-shadow: 0 12px 24px rgba(124, 108, 240, 0.32);
  transform: translateY(-2px);
}
.tb-quiz-scale-labels {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}
.tb-quiz-scale-caption {
  font-size: 14px;
  line-height: 1.6;
  color: var(--tb-muted);
  max-width: 42%;
}
.tb-quiz-scale-caption.left { text-align: left; }
.tb-quiz-scale-caption.right { text-align: right; }
@media (max-width: 560px) {
  .tb-quiz-scale { gap: 8px; }
  .tb-quiz-scale-btn { width: 42px; height: 42px; font-size: 15px; }
  .tb-quiz-scale-caption { max-width: 46%; font-size: 13px; }
}
`;

interface ScaleQuestionProps {
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  value?: number;
  onChange: (value: number) => void;
}

export default function ScaleQuestion({ prompt, leftLabel, rightLabel, value, onChange }: ScaleQuestionProps) {
  return (
    <div className="tb-quiz-question">
      <style>{CSS}</style>
      <p className="tb-quiz-q-prompt">{prompt}</p>
      <div className="tb-quiz-scale" role="radiogroup" aria-label={prompt}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            className={`tb-quiz-scale-btn${value === n ? " active" : ""}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="tb-quiz-scale-labels">
        <span className="tb-quiz-scale-caption left">{leftLabel}</span>
        <span className="tb-quiz-scale-caption right">{rightLabel}</span>
      </div>
    </div>
  );
}
