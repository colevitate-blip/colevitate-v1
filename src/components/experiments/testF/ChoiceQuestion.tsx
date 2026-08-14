"use client";

// Themed single-select list — used for both Human Design's 5 options and
// Colors' 4 options. Renders as a numbered, thin-ruled row list matching
// PanelF's .tf-row / .tf-list chrome.
const CSS = `
.tf-quiz-choice-card { padding: 4px 0; }
.tf-quiz-choice-head { display: flex; gap: 20px; align-items: baseline; margin-bottom: 24px; }
.tf-quiz-choice-no { font-size: 13px; font-weight: 700; color: var(--tf-red); flex: none; }
.tf-quiz-choice-prompt { font-size: clamp(1.15rem, 2.6vw, 1.6rem); font-weight: 700; line-height: 1.25; margin: 0; }

.tf-quiz-choice-list { border-top: 1px solid var(--tf-ink); }
.tf-quiz-choice-row {
  width: 100%;
  display: grid;
  grid-template-columns: 32px 1fr 20px;
  gap: 16px;
  align-items: center;
  padding: 18px 4px;
  border: none;
  border-bottom: 1px solid var(--tf-rule);
  background: #fff;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.tf-quiz-choice-row:hover { background: #fafafa; }
.tf-quiz-choice-row[aria-checked="true"] { background: #fafafa; }
.tf-quiz-choice-letter { font-size: 13px; font-weight: 700; color: var(--tf-muted); }
.tf-quiz-choice-row[aria-checked="true"] .tf-quiz-choice-letter { color: var(--tf-red); }
.tf-quiz-choice-text { font-size: 14px; line-height: 1.6; color: var(--tf-ink); }
.tf-quiz-choice-marker { width: 12px; height: 12px; border: 1px solid var(--tf-ink); border-radius: 50%; justify-self: end; }
.tf-quiz-choice-row[aria-checked="true"] .tf-quiz-choice-marker { background: var(--tf-red); border-color: var(--tf-red); }
`;

interface ChoiceOption {
  id: string;
  label: string;
}

interface ChoiceQuestionProps {
  index: number;
  total: number;
  prompt: string;
  options: ChoiceOption[];
  value?: string;
  onChange: (id: string) => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function ChoiceQuestion({
  index,
  total,
  prompt,
  options,
  value,
  onChange,
}: ChoiceQuestionProps) {
  return (
    <div className="tf-quiz-choice-card">
      <style>{CSS}</style>
      <div className="tf-quiz-choice-head">
        <span className="tf-quiz-choice-no">{String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <h2 className="tf-quiz-choice-prompt">{prompt}</h2>
      </div>
      <div className="tf-quiz-choice-list" role="radiogroup" aria-label={prompt}>
        {options.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={value === opt.id}
            className="tf-quiz-choice-row"
            onClick={() => onChange(opt.id)}
          >
            <span className="tf-quiz-choice-letter">{LETTERS[i] ?? String(i + 1)}</span>
            <span className="tf-quiz-choice-text">{opt.label}</span>
            <span className="tf-quiz-choice-marker" />
          </button>
        ))}
      </div>
    </div>
  );
}
