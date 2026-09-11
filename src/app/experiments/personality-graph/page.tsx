"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations, useLocale, NextIntlClientProvider } from "next-intl";
import type { Simulation } from "d3-force";
import { GraphView, type GraphViewHandle } from "@/components/graph/GraphView";
import { GraphControls } from "@/components/graph/GraphControls";
import { personalityResultsToGraphData } from "@/components/personality/combined/personalityResultsToGraphData";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import {
  getGraphNodeLabel,
  getGraphNodeSize,
  getGraphNodeRing,
  getGraphNodeImportance,
} from "@/components/personality/combined/graphAppearance";
import type { PersonalityResults, ProgressMap } from "@/lib/personality/types";
import type { LabelMode } from "@/components/graph/types";
import enCommon from "@/messages/en/common.json";
import enCombined from "@/messages/en/combined.json";
import enScoring from "@/messages/en/scoring.json";
import enGrowth from "@/messages/en/growth.json";
import enArchetypes from "@/messages/en/archetypes.json";
import enMbti from "@/messages/en/mbti.json";
import enBigfive from "@/messages/en/bigfive.json";
import enHumandesign from "@/messages/en/humandesign.json";
import enColors from "@/messages/en/colors.json";
import enGraph from "@/messages/en/graph.json";

// This route lives outside the `[locale]` segment (no NextIntlClientProvider
// from the locale layout), so it supplies its own English-only messages —
// dev/QA harness only, never localized for real users.
const DEV_MESSAGES = {
  ...enCommon,
  combined: enCombined,
  scoring: enScoring,
  growth: enGrowth,
  archetypes: enArchetypes,
  mbti: enMbti,
  bigfive: enBigfive,
  humandesign: enHumandesign,
  colors: enColors,
  graph: enGraph,
};

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

export default function PersonalityGraphDemo() {
  return (
    <NextIntlClientProvider locale="en" timeZone="UTC" messages={DEV_MESSAGES}>
      <PersonalityGraphDemoInner />
    </NextIntlClientProvider>
  );
}

function PersonalityGraphDemoInner() {
  const [showNames, setShowNames] = useState(false);
  const [spacingMode, setSpacingMode] = useState<"cozy" | "roomy">("roomy");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [simulation, setSimulation] = useState<Simulation<any, any> | null>(null);
  const graphRef = useRef<GraphViewHandle>(null);

  const t = useTranslations();
  const locale = useLocale();
  const combinedProfile = useMemo(() => generateCombinedProfile(MOCK_RESULTS, t, locale), [t, locale]);
  const graphData = useMemo(
    () => (combinedProfile ? personalityResultsToGraphData(MOCK_PROGRESS, MOCK_RESULTS, combinedProfile, t) : null),
    [combinedProfile, t]
  );

  // Show words → all labels, hide → key landmarks only (still not "off",
  // since the radial layout only reads as a hierarchy once you can tell
  // which ring is which).
  const labelMode: LabelMode = showNames ? "all" : "key";

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
            getNodeLabel={getGraphNodeLabel}
            getNodeSize={getGraphNodeSize}
            getNodeRing={getGraphNodeRing}
            getNodeImportance={getGraphNodeImportance}
            labelMode={labelMode}
            onSimulationReady={setSimulation}
          />
        </div>
      </div>
    </div>
  );
}
