"use client";

// Themed 5-point scale question card for Panel D (Spatial / 3D Infrastruktur).
// Works both for MBTI's bipolar statementA/statementB scale and Big Five's
// generic Likert "strongly disagree" <-> "strongly agree" scale.

const CSS = `
[data-panel="d"] .td-quiz-scale {
  position: relative;
  border-radius: 22px;
  border: 1px solid var(--td-line);
  background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  padding: 32px 28px;
  box-shadow: 0 24px 50px rgba(0,0,0,0.5);
  transform-style: preserve-3d;
}
[data-panel="d"] .td-quiz-scale-prompt {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 28px;
}
[data-panel="d"] .td-quiz-scale-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
[data-panel="d"] .td-quiz-scale-pole {
  flex: 0 0 150px;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--td-muted);
}
[data-panel="d"] .td-quiz-scale-pole.right { text-align: right; }
[data-panel="d"] .td-quiz-scale-track {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  position: relative;
}
[data-panel="d"] .td-quiz-scale-track::before {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 50%;
  height: 1px;
  background: var(--td-line);
  transform: translateY(-50%);
  z-index: 0;
}
[data-panel="d"] .td-quiz-scale-node {
  position: relative;
  z-index: 1;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid var(--td-line);
  background: #0d1224;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  padding: 0;
}
[data-panel="d"] .td-quiz-scale-node:hover {
  transform: translateY(-2px) scale(1.08);
  border-color: #7c8cff;
}
[data-panel="d"] .td-quiz-scale-node.active {
  background: linear-gradient(135deg, #7c8cff, #37e0c4);
  border-color: transparent;
  box-shadow: 0 0 0 4px rgba(124,140,255,0.18), 0 8px 20px rgba(124,140,255,0.4);
  transform: translateY(-2px) scale(1.12);
}
[data-panel="d"] .td-quiz-scale-node.mid {
  width: 12px;
  height: 12px;
  margin: 0 7px;
}
@media (max-width: 620px) {
  [data-panel="d"] .td-quiz-scale-row { flex-direction: column; gap: 18px; }
  [data-panel="d"] .td-quiz-scale-pole.right { text-align: left; }
  [data-panel="d"] .td-quiz-scale-pole { flex: none; }
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
    <div className="td-quiz-scale">
      <style>{CSS}</style>
      <p className="td-quiz-scale-prompt">{prompt}</p>
      <div className="td-quiz-scale-row">
        <div className="td-quiz-scale-pole">{leftLabel}</div>
        <div className="td-quiz-scale-track">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} of 5`}
              aria-pressed={value === n}
              className={`td-quiz-scale-node${n === 2 || n === 4 ? " mid" : ""}${value === n ? " active" : ""}`}
              onClick={() => onChange(n)}
            />
          ))}
        </div>
        <div className="td-quiz-scale-pole right">{rightLabel}</div>
      </div>
    </div>
  );
}
