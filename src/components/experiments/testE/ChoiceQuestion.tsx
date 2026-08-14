"use client";

const POP = ["#ff2d78", "#2b5cff", "#f6ff3d", "#00e0a4"];

const CSS = `
.te-quiz-choice-prompt {
  font-family: var(--te-display), sans-serif;
  text-transform: uppercase;
  font-size: clamp(1.5rem, 3.6vw, 2.2rem);
  line-height: 1.05;
  margin: 0 0 26px;
  letter-spacing: -0.01em;
}
.te-quiz-choice-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.te-quiz-choice-opt {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  border: 4px solid var(--te-ink);
  background: #fff;
  padding: 16px 18px;
  font-weight: 700;
  font-size: 15px;
  line-height: 1.5;
  color: var(--te-ink);
  cursor: pointer;
  box-shadow: 6px 6px 0 var(--te-ink);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.te-quiz-choice-opt:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--te-ink);
}
.te-quiz-choice-opt.active {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 var(--te-ink);
}
.te-quiz-choice-swatch {
  flex: none;
  width: 30px;
  height: 30px;
  border: 3px solid var(--te-ink);
  font-family: var(--te-display), sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
`;

interface ChoiceOption {
  id: string;
  label: string;
}

interface ChoiceQuestionProps {
  prompt: string;
  options: ChoiceOption[];
  value?: string;
  onChange: (id: string) => void;
}

export function ChoiceQuestion({ prompt, options, value, onChange }: ChoiceQuestionProps) {
  return (
    <div className="te-quiz-choice">
      <style>{CSS}</style>
      <h2 className="te-quiz-choice-prompt">{prompt}</h2>
      <div className="te-quiz-choice-list">
        {options.map((opt, i) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`te-quiz-choice-opt${active ? " active" : ""}`}
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
            >
              <span
                className="te-quiz-choice-swatch"
                style={{ background: active ? POP[i % POP.length] : "#fff0f6" }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
