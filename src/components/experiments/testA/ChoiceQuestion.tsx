// Themed single-select list — used for both Human Design's 5-option
// questions and Colors' 4-option questions. Meant to be rendered inside
// <SurveyShell>, which provides the [data-panel="a"] ancestor and its
// CSS custom properties.
const CSS = `
[data-panel="a"] .ta-quiz-choice-prompt {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ta-text);
  margin: 0 0 22px;
}
[data-panel="a"] .ta-quiz-choice-prompt .prefix {
  color: var(--ta-amber);
  margin-right: 8px;
}
[data-panel="a"] .ta-quiz-choice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
[data-panel="a"] .ta-quiz-choice-opt {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  text-align: left;
  border: 1px solid var(--ta-line);
  background: var(--ta-panel);
  color: var(--ta-text);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.55;
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease;
}
[data-panel="a"] .ta-quiz-choice-opt:hover {
  border-color: var(--ta-green-dim);
}
[data-panel="a"] .ta-quiz-choice-opt.active {
  border-color: var(--ta-green);
  background: rgba(77, 255, 158, 0.08);
  box-shadow: 0 0 16px rgba(77, 255, 158, 0.15);
}
[data-panel="a"] .ta-quiz-choice-opt .idx {
  flex: none;
  color: var(--ta-green-dim);
  font-weight: 700;
}
[data-panel="a"] .ta-quiz-choice-opt.active .idx {
  color: var(--ta-green);
}
[data-panel="a"] .ta-quiz-choice-opt .label {
  flex: 1;
}
`;

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface ChoiceQuestionProps {
  prompt: string;
  options: ChoiceOption[];
  value: string | undefined;
  onChange: (id: string) => void;
}

export default function ChoiceQuestion({ prompt, options, value, onChange }: ChoiceQuestionProps) {
  return (
    <div className="ta-quiz-choice">
      <style>{CSS}</style>
      <p className="ta-quiz-choice-prompt">
        <span className="prefix">$</span>
        {prompt}
      </p>
      <div className="ta-quiz-choice-list">
        {options.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            className={`ta-quiz-choice-opt${value === opt.id ? " active" : ""}`}
            aria-pressed={value === opt.id}
            onClick={() => onChange(opt.id)}
          >
            <span className="idx">[{String.fromCharCode(97 + i)}]</span>
            <span className="label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
