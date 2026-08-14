"use client";

const POP = ["#ff2d78", "#2b5cff", "#f6ff3d", "#00e0a4"];

const CSS = `
.te-quiz-scale-prompt {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: clamp(1.5rem, 3.6vw, 2.2rem);
  line-height: 1.05;
  margin: 0 0 26px;
  letter-spacing: -0.01em;
}
.te-quiz-scale-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.te-quiz-scale-btn {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--te-ink);
  background: #fff;
  font-family: var(--te-display), sans-serif;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: var(--te-ink);
  cursor: pointer;
  box-shadow: 5px 5px 0 var(--te-ink);
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.te-quiz-scale-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--te-ink);
}
.te-quiz-scale-btn.active {
  color: var(--te-ink);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--te-ink);
}
.te-quiz-scale-labels {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.te-quiz-scale-label {
  flex: 1;
  font-weight: 900;
  font-size: 13px;
  line-height: 1.5;
  border: 3px solid var(--te-ink);
  background: #fff0f6;
  padding: 12px 14px;
}
.te-quiz-scale-label.right { text-align: right; }
`;

interface ScaleQuestionProps {
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  value?: number;
  onChange: (value: number) => void;
}

export function ScaleQuestion({ prompt, leftLabel, rightLabel, value, onChange }: ScaleQuestionProps) {
  return (
    <div className="te-quiz-scale">
      <style>{CSS}</style>
      <h2 className="te-quiz-scale-prompt">{prompt}</h2>
      <div className="te-quiz-scale-row">
        {[1, 2, 3, 4, 5].map((n, i) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              className={`te-quiz-scale-btn${active ? " active" : ""}`}
              style={{ background: active ? POP[i % POP.length] : "#fff" }}
              onClick={() => onChange(n)}
              aria-pressed={active}
              aria-label={`Rate ${n} of 5`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="te-quiz-scale-labels">
        <div className="te-quiz-scale-label">{leftLabel}</div>
        <div className="te-quiz-scale-label right">{rightLabel}</div>
      </div>
    </div>
  );
}
