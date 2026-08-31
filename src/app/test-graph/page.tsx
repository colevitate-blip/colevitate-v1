"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { Simulation } from "d3-force";
import { Locate } from "lucide-react";
import { GraphView, type GraphViewHandle } from "@/components/graph/GraphView";
import { personalityResultsToGraphData } from "@/components/personality/combined/personalityResultsToGraphData";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import {
  getGraphNodeCanvasLabel,
  getGraphNodeSize,
  getGraphNodeCluster,
  getGraphNodeGradient,
  getGraphNodeQuadrant,
  getGraphNodeQuadrantPull,
  getGraphQuadrantLabel,
} from "@/components/personality/combined/graphAppearance";
import type { GraphNode } from "@/components/graph/types";
import type { PersonalityResults, ProgressMap } from "@/lib/personality/types";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { GraphLegend } from "@/components/personality/combined/GraphLegend";
import { GraphNodeTooltip } from "@/components/personality/combined/GraphNodeTooltip";

// Same mock data used by /experiments/personality-graph — just enough to
// exercise all node kinds without needing a real completed assessment.
const MOCK_PROGRESS: ProgressMap = {
  mbti: { step: 0, answers: { "ei-1": 2, "sn-1": 4, "tf-1": 3, "jp-1": 2 } },
  bigfive: { step: 0, answers: { "o-1": 4, "c-1": 3, "e-1": 4, "a-1": 3, "n-1": 2 } },
  humandesign: { step: 0, answers: { "hd-1": "a" } },
  colors: { step: 0, answers: { "c-1": "red" } },
};

const MOCK_RESULTS: PersonalityResults = {
  mbti: {
    type: "ENTP",
    scores: {
      EI: { pole: "E", confidence: 75 },
      SN: { pole: "N", confidence: 65 },
      TF: { pole: "T", confidence: 55 },
      JP: { pole: "P", confidence: 70 },
    },
    completedAt: new Date().toISOString(),
  },
  bigfive: {
    scores: { openness: 85, conscientiousness: 60, extraversion: 80, agreeableness: 65, neuroticism: 40 },
    completedAt: new Date().toISOString(),
  },
  humandesign: {
    type: "generator",
    scores: { generator: 3, "manifesting-generator": 1, manifestor: 0, projector: 1, reflector: 0 },
    completedAt: new Date().toISOString(),
  },
  colors: {
    scores: { red: 80, blue: 60, green: 55, yellow: 75 },
    dominant: "red",
    secondary: "yellow",
    completedAt: new Date().toISOString(),
  },
};

function uniformCircleShape() {
  return "circle";
}

// One preview panel, so the same graph can be checked against both a light
// and a dark background side by side without toggling the whole site's theme.
function QuadrantPreview({ dark, label, quadrantMode }: { dark: boolean; label: string; quadrantMode: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setSimulation] = useState<Simulation<any, any> | null>(null);
  const graphRef = useRef<GraphViewHandle>(null);
  const [tooltip, setTooltip] = useState<{ node: GraphNode; x: number; y: number } | null>(null);

  const combinedProfile = useMemo(() => generateCombinedProfile(MOCK_RESULTS), []);
  const graphData = useMemo(
    () => (combinedProfile ? personalityResultsToGraphData(MOCK_PROGRESS, MOCK_RESULTS, combinedProfile) : null),
    [combinedProfile]
  );
  if (!combinedProfile || !graphData) return null;

  return (
    <div className={dark ? "dark" : ""}>
      <div className="rounded-2xl bg-background p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => graphRef.current?.resetView()}
              aria-label="Fit graph to window — recenter pan and zoom without moving any dots"
              title="Fit to window"
            >
              <Locate className="size-3.5" data-icon="inline-start" />
              Fit to window
            </Button>
          </div>
          <GraphLegend quadrantMode={quadrantMode} />
        </div>
        <div className="h-[420px]">
          <GraphView
            ref={graphRef}
            data={graphData}
            getNodeLabel={getGraphNodeCanvasLabel}
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
            onSimulationReady={setSimulation}
            onNodeHover={(node, clientPos) => setTooltip(node && clientPos ? { node, x: clientPos.x, y: clientPos.y } : null)}
          />
        </div>
      </div>
      {tooltip ? <GraphNodeTooltip node={tooltip.node} clientX={tooltip.x} clientY={tooltip.y} /> : null}
    </div>
  );
}

export default function TestGraphPage() {
  const [quadrantMode, setQuadrantMode] = useState(true);
  const switchId = useId();

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-black text-foreground">Quadrant graph test</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Card/border stripped (<code className="rounded bg-muted px-1 py-0.5 text-xs">background=&quot;none&quot;</code>
          ) so it floats on transparency. When quadrant mode is on, each of the 4 spectrums — Energy Direction,
          Openness to Novelty, People Orientation, Structure &amp; Pace — owns one quadrant (top-left, top-right,
          bottom-left, bottom-right), and every trait/answer that feeds that spectrum gets pulled into it. Threads and
          your overall archetype span more than one spectrum, so they settle near the shared center instead. Off goes
          back to the plain force-directed layout, clustered by which framework each node came from.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3">
          <Switch id={switchId} checked={quadrantMode} onCheckedChange={setQuadrantMode} />
          <label htmlFor={switchId} className="text-sm font-medium text-foreground">
            Quadrant layout
          </label>
          <span className="text-xs text-muted-foreground">{quadrantMode ? "On — grouped by spectrum" : "Off — free force-directed"}</span>
        </div>

        <div className="mt-8 space-y-8">
          <QuadrantPreview dark={false} label="Light" quadrantMode={quadrantMode} />
          <QuadrantPreview dark={true} label="Dark" quadrantMode={quadrantMode} />
        </div>
      </div>
    </div>
  );
}
