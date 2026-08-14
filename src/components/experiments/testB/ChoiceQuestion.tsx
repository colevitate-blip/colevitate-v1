const CSS = `
.tb-quiz-q-prompt {
  font-family: var(--tb-heading), sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 1.4;
  margin: 0 0 28px;
  color: var(--tb-ink);
}
.tb-quiz-choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tb-quiz-choice {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  border: none;
  border-radius: 20px;
  background: #f8f7fc;
  padding: 16px 18px;
  font-family: var(--tb-body), sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--tb-ink);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.tb-quiz-choice:hover { transform: translateY(-2px); background: #f2effe; }
.tb-quiz-choice.active {
  background: #fff;
  box-shadow: 0 14px 28px rgba(124, 108, 240, 0.2);
}
.tb-quiz-choice-dot {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid #d9d5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease;
}
.tb-quiz-choice.active .tb-quiz-choice-dot {
  border-color: #7c6cf0;
}
.tb-quiz-choice-dot-fill {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7c6cf0, #f0708e);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tb-quiz-choice.active .tb-quiz-choice-dot-fill {
  opacity: 1;
  transform: scale(1);
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
    <div className="tb-quiz-question">
      <style>{CSS}</style>
      <p className="tb-quiz-q-prompt">{prompt}</p>
      <div className="tb-quiz-choices" role="radiogroup" aria-label={prompt}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={value === opt.id}
            className={`tb-quiz-choice${value === opt.id ? " active" : ""}`}
            onClick={() => onChange(opt.id)}
          >
            <span className="tb-quiz-choice-dot">
              <span className="tb-quiz-choice-dot-fill" />
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
