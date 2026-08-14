"use client";

import * as React from "react";
import PanelA from "./PanelA";
import PanelB from "./PanelB";
import PanelC from "./PanelC";
import PanelD from "./PanelD";
import PanelE from "./PanelE";
import PanelF from "./PanelF";

const STORAGE_KEY = "personality-studio.experiments.active";

interface Concept {
  key: string;
  short: string;
  full: string;
  Panel: React.ComponentType;
}

const CONCEPTS: Concept[] = [
  { key: "a", short: "Terminal", full: "Terminal Brutalism", Panel: PanelA },
  { key: "b", short: "Soft Cloud", full: "Soft Human Cloud", Panel: PanelB },
  { key: "c", short: "Editorial", full: "Editorial / Magazine", Panel: PanelC },
  { key: "d", short: "Spatial 3D", full: "Spatial / 3D Infrastruktur", Panel: PanelD },
  { key: "e", short: "Maximalist", full: "Bold Maximalist", Panel: PanelE },
  { key: "f", short: "Swiss", full: "Swiss Minimal", Panel: PanelF },
];

export function ExperimentsShowcaseClient() {
  const [active, setActive] = React.useState("a");
  const [fading, setFading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && CONCEPTS.some((c) => c.key === saved)) {
      setActive(saved);
    }
    setMounted(true);
  }, []);

  function switchTo(key: string) {
    if (key === active) return;
    setFading(true);
    window.setTimeout(() => {
      setActive(key);
      window.localStorage.setItem(STORAGE_KEY, key);
      window.scrollTo(0, 0);
      setFading(false);
    }, 140);
  }

  const activeConcept = CONCEPTS.find((c) => c.key === active) ?? CONCEPTS[0];

  return (
    <div className="exs-root">
      <style>{SHOWCASE_CSS}</style>
      <div className="exs-switcher" role="tablist" aria-label="Design concepts">
        <div className="exs-switcher-inner">
          <div className="exs-brand">Design Experiments</div>
          <div className="exs-tabs">
            {CONCEPTS.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active === c.key}
                aria-pressed={active === c.key}
                className={`exs-tab${active === c.key ? " is-active" : ""}`}
                onClick={() => switchTo(c.key)}
              >
                {c.short}
              </button>
            ))}
          </div>
          <div className="exs-active-label" suppressHydrationWarning>
            {mounted ? `Active: ${activeConcept.full}` : ""}
          </div>
        </div>
      </div>

      <div className={`exs-stage${fading ? " is-fading" : ""}`}>
        {CONCEPTS.map(({ key, Panel }) => (
          <div className="exs-slot" key={key} hidden={key !== active}>
            <Panel />
          </div>
        ))}
      </div>
    </div>
  );
}

const SHOWCASE_CSS = `
.exs-root { min-height: 100vh; }
.exs-switcher {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(12, 12, 16, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
.exs-switcher-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.exs-brand {
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.exs-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}
.exs-tab {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12.5px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
}
.exs-tab:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.exs-tab.is-active {
  background: #fff;
  color: #0c0c10;
  border-color: #fff;
}
.exs-active-label {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  white-space: nowrap;
  margin-left: auto;
}
.exs-stage {
  transition: opacity 140ms ease;
  opacity: 1;
}
.exs-stage.is-fading { opacity: 0; }
.exs-stage .exs-slot[hidden] { display: none !important; }

@media (max-width: 720px) {
  .exs-switcher-inner { gap: 10px; }
  .exs-active-label { display: none; }
}
`;
