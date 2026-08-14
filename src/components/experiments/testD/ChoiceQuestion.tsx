"use client";

// Themed single-select list for Panel D (Spatial / 3D Infrastruktur).
// Works for both Human Design's 5 options and Colors' 4 options.

const CSS = `
[data-panel="d"] .td-quiz-choice {
  position: relative;
  border-radius: 22px;
  border: 1px solid var(--td-line);
  background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  padding: 32px 28px;
  box-shadow: 0 24px 50px rgba(0,0,0,0.5);
  transform-style: preserve-3d;
}
[data-panel="d"] .td-quiz-choice-prompt {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 24px;
}
[data-panel="d"] .td-quiz-choice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
[data-panel="d"] .td-quiz-choice-option {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid var(--td-line);
  background: rgba(255,255,255,0.02);
  color: var(--td-text);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  transform-style: preserve-3d;
}
[data-panel="d"] .td-quiz-choice-option:hover {
  transform: translateY(-2px) rotateX(2deg);
  border-color: #7c8cff;
  background: rgba(124,140,255,0.06);
}
[data-panel="d"] .td-quiz-choice-option.active {
  border-color: transparent;
  background: linear-gradient(135deg, rgba(124,140,255,0.22), rgba(55,224,196,0.14));
  box-shadow: 0 0 0 1px rgba(124,140,255,0.5), 0 14px 30px rgba(124,140,255,0.25);
}
[data-panel="d"] .td-quiz-choice-dot {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1px solid var(--td-line);
  background: transparent;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
[data-panel="d"] .td-quiz-choice-option.active .td-quiz-choice-dot {
  background: linear-gradient(135deg, #7c8cff, #37e0c4);
  border-color: transparent;
  box-shadow: 0 0 10px rgba(124,140,255,0.6);
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

export default function ChoiceQuestion({ prompt, options, value, onChange }: ChoiceQuestionProps) {
  return (
    <div className="td-quiz-choice">
      <style>{CSS}</style>
      <p className="td-quiz-choice-prompt">{prompt}</p>
      <div className="td-quiz-choice-list">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            aria-pressed={value === opt.id}
            className={`td-quiz-choice-option${value === opt.id ? " active" : ""}`}
            onClick={() => onChange(opt.id)}
          >
            <span className="td-quiz-choice-dot" />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
