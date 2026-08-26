"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { Simulation } from "d3-force";
import { Network, Locate, Info } from "lucide-react";
import { GraphView, type GraphViewHandle } from "@/components/graph/GraphView";
import { personalityResultsToGraphData } from "./personalityResultsToGraphData";
import {
  getGraphNodeLabel,
  getGraphNodeCanvasLabel,
  getGraphNodeSize,
  getGraphNodeCluster,
  getGraphNodeGradient,
  getGraphNodeKindTag,
  getGraphNodeExplanation,
  getGraphNodeQuadrant,
  getGraphNodeQuadrantPull,
  getGraphQuadrantLabel,
} from "./graphAppearance";
import { GraphLegend } from "./GraphLegend";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { PersonalityResults, ProgressMap } from "@/lib/personality/types";
import type { GraphNode } from "@/components/graph/types";
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
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [quadrantMode, setQuadrantMode] = useState(true);
  const graphRef = useRef<GraphViewHandle>(null);
  const switchId = useId();

  const graphData = useMemo(
    () => personalityResultsToGraphData(progress, results, profile),
    [progress, results, profile]
  );
  const getNodeLabel = useMemo(
    () => (node: GraphNode) => getGraphNodeCanvasLabel(node, quadrantMode),
    [quadrantMode]
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id={switchId} checked={quadrantMode} onCheckedChange={setQuadrantMode} />
            <label htmlFor={switchId} className="text-xs font-medium text-muted-foreground">
              Group by spectrum
            </label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => graphRef.current?.resetView()}
            aria-label="Recenter the graph — reset pan and zoom without moving any dots"
            title="Recenter"
          >
            <Locate className="size-3.5" data-icon="inline-start" />
            Recenter
          </Button>
        </div>
      </div>
      <div className="group/legend relative mb-3 inline-flex">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <Info className="size-3.5" />
          How to read this
        </button>
        <div className="pointer-events-none absolute top-full left-0 z-20 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-popover/95 p-3 text-xs leading-relaxed text-popover-foreground opacity-0 shadow-xl backdrop-blur-sm transition-opacity duration-150 group-hover/legend:opacity-100 group-focus-within/legend:opacity-100">
          <p className="mb-2 text-muted-foreground">
            The big dot is your overall archetype. The medium dots are your 4{" "}
            <strong className="font-medium text-foreground">spectrums</strong> — the core scales
            everything else is measured against
            {quadrantMode
              ? ", one per quadrant. Everything else sits in whichever spectrum it feeds."
              : ", like how much your energy points outward vs. inward. Everything else clusters by which framework it came from."}
          </p>
          <GraphLegend quadrantMode={quadrantMode} />
        </div>
      </div>
      <div className="relative h-[420px]">
        <GraphView
          ref={graphRef}
          data={graphData}
          getNodeLabel={getNodeLabel}
          getNodeSize={getGraphNodeSize}
          // Quadrant mode positions nodes by which spectrum they belong to,
          // so pulling them toward a framework cluster at the same time
          // would fight that placement — only cluster by framework when
          // quadrant mode is off.
          getNodeCluster={quadrantMode ? undefined : getGraphNodeCluster}
          getNodeQuadrant={quadrantMode ? getGraphNodeQuadrant : undefined}
          getNodeQuadrantPull={quadrantMode ? getGraphNodeQuadrantPull : undefined}
          getQuadrantLabel={quadrantMode ? getGraphQuadrantLabel : undefined}
          getNodeGradient={getGraphNodeGradient}
          getNodeShape={uniformCircleShape}
          monochrome
          labelStyle="plain"
          labelMode="all"
          background="none"
          quadrantGuide={quadrantMode}
          selectedNodeId={hoveredNode?.id ?? null}
          onNodeHover={setHoveredNode}
          onSimulationReady={setSimulation}
        />
        {hoveredNode ? (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] sm:left-auto sm:right-3 sm:w-64">
            <div className="rounded-xl border border-border bg-popover/85 p-3 text-popover-foreground shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-1 duration-150">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {getGraphNodeKindTag(hoveredNode)}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{getGraphNodeLabel(hoveredNode)}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {getGraphNodeExplanation(hoveredNode)}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
