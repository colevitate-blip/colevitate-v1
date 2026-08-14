"use client";

// Editorial-themed single-select list — used for Human Design's 5 options
// and Colors' 4 options. Styled as a numbered list matching PanelC's
// roman-numeral article-index treatment.

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const CSS = `
.tc-quiz-choiceq { max-width: 720px; }
.tc-quiz-choiceq .tc-quiz-kicker {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--tc-accent);
  font-weight: 600;
  margin-bottom: 16px;
}
.tc-quiz-choiceq .tc-quiz-prompt {
  font-family: var(--tc-serif), serif;
  font-weight: 700;
  font-size: clamp(1.6rem, 3.6vw, 2.3rem);
  line-height: 1.15;
  margin: 0 0 36px;
}
.tc-quiz-choices { border-top: 1px solid var(--tc-rule); }
.tc-quiz-choice {
  display: flex;
  align-items: baseline;
  gap: 20px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--tc-rule);
  padding: 18px 4px;
  cursor: pointer;
  font-family: var(--tc-sans), sans-serif;
}
.tc-quiz-choice-num {
  font-family: var(--tc-serif), serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--tc-rule);
  min-width: 32px;
  transition: color 0.15s ease;
}
.tc-quiz-choice-label {
  font-size: 15px;
  line-height: 1.6;
  color: var(--tc-ink);
}
.tc-quiz-choice:hover .tc-quiz-choice-num { color: var(--tc-accent); }
.tc-quiz-choice.active { background: rgba(163, 55, 44, 0.06); }
.tc-quiz-choice.active .tc-quiz-choice-num { color: var(--tc-accent); }
.tc-quiz-choice.active .tc-quiz-choice-label { color: var(--tc-ink); font-weight: 600; }
`;

interface ChoiceOption {
  id: string;
  label: string;
}

interface ChoiceQuestionProps {
  index: number;
  prompt: string;
  options: ChoiceOption[];
  value: string | undefined;
  onChange: (id: string) => void;
}

export default function ChoiceQuestion({
  index,
  prompt,
  options,
  value,
  onChange,
}: ChoiceQuestionProps) {
  return (
    <div className="tc-quiz-choiceq">
      <style>{CSS}</style>
      <div className="tc-quiz-kicker">Question {index}</div>
      <h2 className="tc-quiz-prompt">{prompt}</h2>
      <div className="tc-quiz-choices">
        {options.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            className={`tc-quiz-choice${value === opt.id ? " active" : ""}`}
            onClick={() => onChange(opt.id)}
            aria-pressed={value === opt.id}
          >
            <span className="tc-quiz-choice-num">{ROMAN[i] ?? i + 1}</span>
            <span className="tc-quiz-choice-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
