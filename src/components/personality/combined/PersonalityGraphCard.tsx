"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Simulation } from "d3-force";
import { Network, Locate, X } from "lucide-react";
import { GraphView, type GraphViewHandle } from "@/components/graph/GraphView";
import { personalityResultsToGraphData } from "./personalityResultsToGraphData";
import {
  getGraphNodeLabel,
  getGraphNodeSize,
  getGraphNodeCluster,
  getGraphNodeGradient,
  getGraphNodeKindTag,
  getGraphNodeExplanation,
} from "./graphAppearance";
import type { PersonalityResults, ProgressMap } from "@/lib/personality/types";
import type { GraphNode } from "@/components/graph/types";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

// Every node is a plain circle — size is the only visual cue for "how big a
// piece of the picture is this", exactly like Obsidian's graph view uses
// note in-degree for dot size. Kind still exists in the data (for the
// click/label logic) but no longer needs decoding via shape or color.
function uniformCircleShape() {
  return "circle";
}

// Auto-dismiss like a toast so the explanation never permanently blocks the
// graph — but pauses while the user is actually reading it (hover or
// keyboard focus), per standard timed-content UX guidance (don't race
// someone off a panel they're actively engaging with).
const AUTO_DISMISS_MS = 7000;

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
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const graphRef = useRef<GraphViewHandle>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const graphData = useMemo(
    () => personalityResultsToGraphData(progress, results, profile),
    [progress, results, profile]
  );

  // Every new selection gets a fresh countdown; clicking a different dot
  // while one is already open resets the clock rather than inheriting
  // whatever was left of the previous one.
  useEffect(() => {
    if (!selectedNode) return;
    dismissTimerRef.current = setTimeout(() => setSelectedNode(null), AUTO_DISMISS_MS);
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [selectedNode]);

  const pauseDismiss = () => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
  };
  const resumeDismiss = () => {
    pauseDismiss();
    dismissTimerRef.current = setTimeout(() => setSelectedNode(null), AUTO_DISMISS_MS);
  };

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
        Click any dot for a plain-English explanation. The big dot is your overall archetype. The
        medium dots are your 4 <strong className="font-medium text-foreground">spectrums</strong> —
        the core scales everything else is measured against, like how much your energy points
        outward vs. inward. Everything else clusters by which framework it came from, so nearby
        dots are actually related — not just wherever the layout happened to settle.
      </p>
      <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border/60 bg-muted/10 p-2">
        <GraphView
          ref={graphRef}
          data={graphData}
          getNodeLabel={getGraphNodeLabel}
          getNodeSize={getGraphNodeSize}
          getNodeCluster={getGraphNodeCluster}
          getNodeGradient={getGraphNodeGradient}
          getNodeShape={uniformCircleShape}
          monochrome
          labelStyle="plain"
          labelMode="all"
          selectedNodeId={selectedNode?.id ?? null}
          onNodeClick={setSelectedNode}
          onSimulationReady={setSimulation}
        />
        {selectedNode ? (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] sm:left-auto sm:right-3 sm:w-64">
            <div
              className="pointer-events-auto flex items-start gap-2 rounded-xl border border-border bg-popover/85 p-3 text-popover-foreground shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-1 duration-200"
              onMouseEnter={pauseDismiss}
              onMouseLeave={resumeDismiss}
              onFocus={pauseDismiss}
              onBlur={resumeDismiss}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {getGraphNodeKindTag(selectedNode)}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{getGraphNodeLabel(selectedNode)}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {getGraphNodeExplanation(selectedNode)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                aria-label="Close explanation"
                className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
