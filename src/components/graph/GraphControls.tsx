"use client";

import type { ForceLink, ForceManyBody, Simulation } from "d3-force";

export type SpacingMode = "cozy" | "roomy";

const SPACING_PRESETS: Record<SpacingMode, { distance: number; charge: number }> = {
  cozy: { distance: 60, charge: -140 },
  roomy: { distance: 160, charge: -320 },
};

interface GraphControlsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simulation: Simulation<any, any> | null;
  showNames: boolean;
  onShowNamesChange: (show: boolean) => void;
  spacingMode: SpacingMode;
  onSpacingModeChange: (mode: SpacingMode) => void;
  onResetLayout?: () => void;
}

export function GraphControls({
  simulation,
  showNames,
  onShowNamesChange,
  spacingMode,
  onSpacingModeChange,
  onResetLayout,
}: GraphControlsProps) {
  const handleSpacingModeChange = (mode: SpacingMode) => {
    onSpacingModeChange(mode);
    const preset = SPACING_PRESETS[mode];
    const linkForce = simulation?.force("link") as ForceLink<never, never> | undefined;
    const chargeForce = simulation?.force("charge") as ForceManyBody<never> | undefined;
    if (linkForce) linkForce.distance(preset.distance);
    if (chargeForce) chargeForce.strength(preset.charge);
    simulation?.alpha(0.3).restart();
  };

  return (
    <aside className="w-40 bg-background border-r border-border p-4 space-y-4 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">✨</h2>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetLayout}
        disabled={!onResetLayout}
        className="w-full py-4 px-3 bg-primary text-primary-foreground font-bold text-lg rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        🎲 Shake It
      </button>

      {/* Show Names Toggle */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Words?</p>
        <div className="flex gap-2">
          <button
            onClick={() => onShowNamesChange(false)}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-base transition-colors ${
              !showNames
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            🤐 Hide
          </button>
          <button
            onClick={() => onShowNamesChange(true)}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-base transition-colors ${
              showNames
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            💬 Show
          </button>
        </div>
      </div>

      {/* Spacing Toggle */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Room?</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSpacingModeChange("cozy")}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-base transition-colors ${
              spacingMode === "cozy"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            🏠 Close
          </button>
          <button
            onClick={() => handleSpacingModeChange("roomy")}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-base transition-colors ${
              spacingMode === "roomy"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            🌳 Far
          </button>
        </div>
      </div>

      {/* Shape Legend */}
      <div className="mt-auto pt-6 border-t border-border space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Shapes mean:</p>
        <div className="space-y-2 text-xs text-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400" />
            <span>Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400" />
            <span>Traits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400" style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }} />
            <span>Threads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-400" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
            <span>Axes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-yellow-400" style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
            <span>You!</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
