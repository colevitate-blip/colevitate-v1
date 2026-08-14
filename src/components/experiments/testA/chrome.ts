// Shared terminal-brutalism chrome CSS reused by the quiz/result components
// under testA/. Mirrors the design tokens and titlebar/scanline motifs
// established in ../PanelA.tsx exactly — do not invent new colors here.
export const TA_BASE_CSS = `
[data-panel="a"] {
  --ta-bg: #060a06;
  --ta-panel: #0c130c;
  --ta-line: #1c3a24;
  --ta-green: #4dff9e;
  --ta-green-dim: #2fae72;
  --ta-amber: #ffb454;
  --ta-text: #b9f3cd;
  --ta-muted: #6f9b82;
  font-family: var(--ta-font), "JetBrains Mono", monospace;
  background: var(--ta-bg);
  color: var(--ta-text);
  position: relative;
  overflow: hidden;
}

[data-panel="a"] .ta-scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 255, 140, 0.035) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  mix-blend-mode: overlay;
}

[data-panel="a"] .ta-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 4;
  box-shadow: inset 0 0 180px rgba(0, 0, 0, 0.85);
}

[data-panel="a"] .ta-titlebar {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--ta-line);
  background: linear-gradient(180deg, #0d160d, #060a06);
}
[data-panel="a"] .ta-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid var(--ta-line);
}
[data-panel="a"] .ta-dot.r { background: #ff6659; }
[data-panel="a"] .ta-dot.y { background: #ffcf5c; }
[data-panel="a"] .ta-dot.g { background: #63e08a; }
[data-panel="a"] .ta-titletext {
  margin-left: 10px;
  font-size: 12px;
  color: var(--ta-muted);
  letter-spacing: 0.04em;
}

@keyframes ta-blink { 50% { opacity: 0; } }
`;
