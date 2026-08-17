"use client";

import { useMemo, useRef, useState } from "react";
import type { Simulation } from "d3-force";
import { GraphView, type GraphViewHandle } from "@/components/graph/GraphView";
import { GraphControls } from "@/components/graph/GraphControls";
import { personalityResultsToGraphData } from "@/components/personality/combined/personalityResultsToGraphData";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import type { PersonalityResults, ProgressMap } from "@/lib/personality/types";
import type { LabelMode, GraphNode } from "@/components/graph/types";

// Mock data for demo
const MOCK_PROGRESS: ProgressMap = {
  mbti: {
    step: 0,
    answers: {
      "ei-1": 2,
      "sn-1": 4,
      "tf-1": 3,
      "jp-1": 2,
    },
  },
  bigfive: {
    step: 0,
    answers: {
      "o-1": 4,
      "c-1": 3,
      "e-1": 4,
      "a-1": 3,
      "n-1": 2,
    },
  },
  humandesign: {
    step: 0,
    answers: {
      "hd-1": "a",
    },
  },
  colors: {
    step: 0,
    answers: {
      "c-1": "red",
    },
  },
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
    scores: {
      openness: 85,
      conscientiousness: 60,
      extraversion: 80,
      agreeableness: 65,
      neuroticism: 40,
    },
    completedAt: new Date().toISOString(),
  },
  humandesign: {
    type: "generator",
    scores: {
      generator: 3,
      "manifesting-generator": 1,
      manifestor: 0,
      projector: 1,
      reflector: 0,
    },
    completedAt: new Date().toISOString(),
  },
  colors: {
    scores: {
      red: 80,
      blue: 60,
      green: 55,
      yellow: 75,
    },
    dominant: "red",
    secondary: "yellow",
    completedAt: new Date().toISOString(),
  },
};

// Module-level so identity stays stable across re-renders — GraphView keys
// its simulation-setup effect off these, and a fresh function reference on
// every render would tear down and rebuild the simulation constantly.
function getNodeLabel(node: GraphNode) {
  const nodeObj = node as Record<string, unknown>;
  if (nodeObj.kind === "question") {
    return `Q: ${String(nodeObj.prompt).substring(0, 20)}...`;
  }
  if (nodeObj.kind === "trait") {
    return String(nodeObj.label);
  }
  if (nodeObj.kind === "thread") {
    return String(nodeObj.label);
  }
  if (nodeObj.kind === "axis") {
    return String(nodeObj.id);
  }
  if (nodeObj.kind === "archetype") {
    return String(nodeObj.label);
  }
  return String(nodeObj.id);
}

function getNodeSize(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  switch (kind) {
    case "archetype":
      return 10;
    case "axis":
      return 8;
    case "thread":
      return 7;
    case "trait":
      return 5;
    case "question":
      return 3;
    default:
      return 4;
  }
}

export default function PersonalityGraphDemo() {
  const [showNames, setShowNames] = useState(false);
  const [spacingMode, setSpacingMode] = useState<"cozy" | "roomy">("roomy");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [simulation, setSimulation] = useState<Simulation<any, any> | null>(null);
  const graphRef = useRef<GraphViewHandle>(null);

  const combinedProfile = useMemo(() => generateCombinedProfile(MOCK_RESULTS), []);
  const graphData = useMemo(
    () => (combinedProfile ? personalityResultsToGraphData(MOCK_PROGRESS, MOCK_RESULTS, combinedProfile) : null),
    [combinedProfile]
  );

  // Show words → key mode (important labels), hide → off (no labels)
  const labelMode: LabelMode = showNames ? "key" : "off";

  if (!combinedProfile || !graphData) {
    return <div className="p-8 text-center">Need at least 2 assessments to generate graph</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <GraphControls
        simulation={simulation}
        showNames={showNames}
        onShowNamesChange={setShowNames}
        spacingMode={spacingMode}
        onSpacingModeChange={setSpacingMode}
        onResetLayout={() => graphRef.current?.resetLayout()}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border bg-card/50">
          <h1 className="text-3xl font-black text-foreground">{combinedProfile.headline}</h1>
          <p className="text-base text-muted-foreground mt-2">{combinedProfile.subtitle}</p>
        </div>
        <div className="flex-1 min-h-0">
          <GraphView
            ref={graphRef}
            data={graphData}
            getNodeLabel={getNodeLabel}
            getNodeSize={getNodeSize}
            labelMode={labelMode}
            onSimulationReady={setSimulation}
          />
        </div>
      </div>
    </div>
  );
}
