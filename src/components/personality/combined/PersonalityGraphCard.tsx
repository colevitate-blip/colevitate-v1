"use client";

import { useMemo, useRef, useState } from "react";
import type { Simulation } from "d3-force";
import { Network, Locate } from "lucide-react";
import { GraphView, type GraphViewHandle } from "@/components/graph/GraphView";
import { personalityResultsToGraphData } from "./personalityResultsToGraphData";
import { getGraphNodeLabel, getGraphNodeSize } from "./graphAppearance";
import type { PersonalityResults, ProgressMap } from "@/lib/personality/types";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

// Every node is a plain circle — size is the only visual cue for "how big a
// piece of the picture is this", exactly like Obsidian's graph view uses
// note in-degree for dot size. Kind still exists in the data (for the
// hover/label logic) but no longer needs decoding via shape or color.
function uniformCircleShape() {
  return "circle";
}

export function PersonalityGraphCard({
  profile,
  results,
  progress,
}: {
  profile: CombinedProfileData;
  results: PersonalityResults;
  progress: ProgressMap;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setSimulation] = useState<Simulation<any, any> | null>(null);
  const graphRef = useRef<GraphViewHandle>(null);

  const graphData = useMemo(
    () => personalityResultsToGraphData(progress, results, profile),
    [progress, results, profile]
  );

  if (graphData.nodes.length === 0) return null;

  return (
    <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <Network className="size-4" />
          </div>
          <h2 className="font-semibold">How It All Connects</h2>
        </div>
        <button
          type="button"
          onClick={() => graphRef.current?.resetView()}
          title="Recenter the view"
          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <Locate className="size-3.5" />
          Recenter
        </button>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Every dot is a piece of your results — bigger dots are the big picture (your archetype,
        then the axes it&apos;s built from); smaller ones are the individual frameworks and traits
        behind them. A line means one directly feeds the other: an answer feeds a trait, a trait
        feeds a framework, a framework feeds an axis. <strong className="font-medium text-foreground">Hover any dot</strong> to trace exactly
        what it connects to — everything unrelated fades out. Drag to rearrange, scroll to zoom,
        Recenter if you wander off.
      </p>
      <div className="h-[420px] overflow-hidden rounded-2xl border border-border/60 bg-muted/10 p-2">
        <GraphView
          ref={graphRef}
          data={graphData}
          getNodeLabel={getGraphNodeLabel}
          getNodeSize={getGraphNodeSize}
          getNodeShape={uniformCircleShape}
          monochrome
          labelStyle="plain"
          labelMode="all"
          onSimulationReady={setSimulation}
        />
      </div>
    </div>
  );
}
