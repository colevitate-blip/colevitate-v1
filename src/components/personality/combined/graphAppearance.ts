import type { GraphNode } from "@/components/graph/types";
import type { AxisId } from "@/lib/personality/types";

// Module-level so identity stays stable across re-renders — GraphView keys
// its simulation-setup effect off these, and a fresh function reference on
// every render would tear down and rebuild the simulation constantly.
export function getGraphNodeLabel(node: GraphNode) {
  const nodeObj = node as Record<string, unknown>;
  if (nodeObj.kind === "question") {
    return `Q: ${String(nodeObj.prompt).substring(0, 20)}...`;
  }
  if (nodeObj.kind === "trait") {
    return String(nodeObj.label);
  }
  if (nodeObj.kind === "axis") {
    return String(nodeObj.label ?? nodeObj.id);
  }
  if (nodeObj.kind === "archetype") {
    return String(nodeObj.label);
  }
  return String(nodeObj.id);
}

// Floating on-canvas label — deliberately narrower than getGraphNodeLabel
// above, which is also used for the click/hover detail panels where the
// full text is wanted. On the canvas itself: a question node's "Q: ..."
// prompt is too noisy at this density (the hover tooltip and click panel
// already surface it), and once quadrant mode is on, an axis node's own
// label is redundant with the spectrum name already sitting on the
// crosshair line (see getGraphQuadrantLabel below).
export function getGraphNodeCanvasLabel(node: GraphNode, quadrantMode: boolean) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "question") return "";
  if (quadrantMode && kind === "axis") return "";
  return getGraphNodeLabel(node);
}

// Concentric ring per node kind — 0 is dead center. This mirrors the real
// hierarchy the data represents: your archetype sits at the center because
// everything else feeds it, radiating out through the axes it's computed
// from, the specific traits each spectrum is measured by, and finally the
// raw answers behind them.
const KIND_RING: Record<string, number> = {
  archetype: 0,
  axis: 1,
  trait: 2,
  question: 3,
};

export function getGraphNodeRing(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  return KIND_RING[typeof kind === "string" ? kind : ""] ?? 3;
}

const RING_LABELS: Record<number, string> = {
  1: "Spectrums",
  2: "Traits",
  3: "Answers",
};

export function getGraphRingLabel(ring: number) {
  return RING_LABELS[ring] ?? "";
}

// In "key" label mode, always label the landmark nodes (archetype, axes)
// regardless of how many connections they happen to have — degree alone
// under-labels these since a single trait node can easily out-degree an
// axis. Traits/questions still fall back to the degree heuristic so the
// densest layer doesn't get labeled all at once.
export function getGraphNodeImportance(node: GraphNode, degree: number) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "archetype" || kind === "axis") return true;
  return degree >= 3;
}

const KIND_TAGS: Record<string, string> = {
  archetype: "Your archetype",
  axis: "Spectrum — a core personality scale",
  trait: "Trait",
  question: "Your answer",
};

/** Short "what kind of thing is this" tag shown at the top of the click-to-explain panel. */
export function getGraphNodeKindTag(node: GraphNode): string {
  const kind = (node as Record<string, unknown>).kind;
  return KIND_TAGS[typeof kind === "string" ? kind : ""] ?? "";
}

// "You..." phrasing per Big Five trait, tiered by the user's actual 0-100
// score — the personalized half of a trait's explanation, appended after
// the generic description so a click answers both "what is this" and
// "where do I land on it."
const BIG_FIVE_YOU: Record<string, { high: string; mid: string; low: string }> = {
  openness: {
    high: "You're drawn to new ideas, unconventional thinking, and exploring the unfamiliar.",
    mid: "You're about equally comfortable with the familiar and the untested, without a strong pull either way.",
    low: "You gravitate toward the practical and familiar over the abstract or untested.",
  },
  conscientiousness: {
    high: "You lean organized and goal-directed, and tend to follow through once you commit.",
    mid: "You balance structure and spontaneity about evenly.",
    low: "You favor flexibility over rigid plans, and adapt as you go.",
  },
  extraversion: {
    high: "Social engagement and stimulation genuinely energize you.",
    mid: "You're comfortable both around people and on your own, depending on the moment.",
    low: "Time alone recharges you more reliably than social stimulation does.",
  },
  agreeableness: {
    high: "You prioritize cooperation and how a decision lands on other people.",
    mid: "You weigh your own read on things and others' feelings about evenly.",
    low: "You prioritize your own read on a situation over managing how it lands on others.",
  },
  neuroticism: {
    high: "Stress and emotional swings register strongly and quickly for you.",
    mid: "You feel stress like anyone does, without it dominating how you operate.",
    low: "You stay even-keeled under pressure more reliably than most.",
  },
};

function bigFiveYouText(trait: string, score: number): string {
  const phrases = BIG_FIVE_YOU[trait];
  if (!phrases) return "";
  if (score >= 70) return phrases.high;
  if (score <= 30) return phrases.low;
  return phrases.mid;
}

const MBTI_POLE_NAME: Record<string, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
};

function mbtiYouText(pole: string, confidence: number): string {
  const poleName = MBTI_POLE_NAME[pole];
  if (!poleName) return "";
  return `You lean toward ${poleName} — ${Math.round(confidence)}% in that direction based on your answers.`;
}

/** Plain-English explanation of a specific node, for the click-to-explain panel. */
export function getGraphNodeExplanation(node: GraphNode): string {
  const n = node as Record<string, unknown>;
  switch (n.kind) {
    case "archetype":
      return String(n.description ?? "");
    case "axis": {
      const left = String(n.leftPole ?? "");
      const right = String(n.rightPole ?? "");
      const sentence = String(n.sentence ?? "");
      return `Measures ${left} vs. ${right}. ${sentence}`;
    }
    case "trait": {
      const description = String(n.description ?? "");
      let youText = "";
      if (typeof n.score === "number") {
        youText = bigFiveYouText(String(n.id), n.score);
      } else if (typeof n.pole === "string" && typeof n.confidence === "number") {
        youText = mbtiYouText(n.pole, n.confidence);
      }
      return youText ? `${description} ${youText}` : description;
    }
    case "question": {
      const prompt = String(n.prompt ?? "");
      const answer = n.answer;
      const answerText = Array.isArray(answer) ? answer.join(" > ") : String(answer);
      return `"${prompt}" — your answer: ${answerText}`;
    }
    default:
      return "";
  }
}

// Which framework a node belongs to, for clustering same-source nodes
// together — a trait and any raw answers behind it share a cluster key so
// the layout visibly groups "everything that came from 16 Personalities"
// instead of leaving that relationship to chance physics. Axis and
// archetype nodes span multiple frameworks by nature, so they sit outside
// any single cluster — exactly where they belong, since they're the shared
// ground between clusters, not part of one.
export function getGraphNodeCluster(node: GraphNode): string | undefined {
  const n = node as Record<string, unknown>;
  if (n.kind === "trait" || n.kind === "question") {
    return typeof n.framework === "string" ? n.framework : undefined;
  }
  return undefined;
}

// Real hex approximations of each framework's existing accent color (see
// ASSESSMENT_THEME in lib/personality/theme.ts) — canvas gradients need
// actual color strings, not Tailwind classes, but keeping the same hues
// means a framework reads as "the same color" everywhere in the app.
const FRAMEWORK_GRADIENT: Record<string, [string, string]> = {
  mbti: ["#8b5cf6", "#3b82f6"], // violet -> blue
  bigfive: ["#10b981", "#06b6d4"], // emerald -> cyan
  humandesign: ["#d946ef", "#f43f5e"], // fuchsia -> rose
  colors: ["#ef4444", "#eab308"], // red -> yellow
};

// The 4 Color Types framework's traits *are* literal colors — use the real
// one (matching COLOR_THEME in lib/personality/theme.ts) instead of the
// generic "colors framework" gradient when we can.
const LITERAL_COLOR_GRADIENT: Record<string, [string, string]> = {
  red: ["#ef4444", "#e11d48"],
  blue: ["#3b82f6", "#4f46e5"],
  green: ["#10b981", "#16a34a"],
  yellow: ["#fbbf24", "#eab308"],
};

// Matches --spatial-glow / --spatial-glow-2, the app's signature gradient —
// already used for the axis position sliders in the Signal Matrix, so
// reusing it here ties the graph back to the same visual language.
const SPECTRUM_LEFT = "#6366f1";
const SPECTRUM_RIGHT = "#0d9488";

/**
 * Gradient stops for a clicked node's stroke — see GraphViewProps.getNodeGradient.
 * Each kind encodes a real fact about the node, not just a decorative accent:
 *  - axis: the app's two-tone spectrum gradient, but the color switch is
 *    shifted by the *actual score* — lean hard toward one pole and the
 *    stroke is mostly that pole's color, not an even 50/50 split.
 *  - trait/question: the color of whichever framework it came from (or,
 *    for a literal color-type trait like "red", that color itself).
 *  - archetype: every contributing framework's color in sequence — visually
 *    "this archetype is made of these frameworks."
 */
export function getGraphNodeGradient(node: GraphNode): Array<{ color: string; stop: number }> | null {
  const n = node as Record<string, unknown>;

  switch (n.kind) {
    case "axis": {
      const score = typeof n.score === "number" ? n.score : 0;
      // score -100 (fully leftPole) -> t=1 (left color dominates the
      // stroke); score +100 (fully rightPole) -> t=0.
      const t = Math.min(1, Math.max(0, (100 - score) / 200));
      const feather = 0.12;
      return [
        { color: SPECTRUM_LEFT, stop: 0 },
        { color: SPECTRUM_LEFT, stop: Math.max(0, t - feather) },
        { color: SPECTRUM_RIGHT, stop: Math.min(1, t + feather) },
        { color: SPECTRUM_RIGHT, stop: 1 },
      ];
    }

    case "trait": {
      const literal = typeof n.id === "string" ? LITERAL_COLOR_GRADIENT[n.id] : undefined;
      const gradient = literal ?? (typeof n.framework === "string" ? FRAMEWORK_GRADIENT[n.framework] : undefined);
      return gradient ? [{ color: gradient[0], stop: 0 }, { color: gradient[1], stop: 1 }] : null;
    }

    case "question": {
      const gradient = typeof n.framework === "string" ? FRAMEWORK_GRADIENT[n.framework] : undefined;
      return gradient ? [{ color: gradient[0], stop: 0 }, { color: gradient[1], stop: 1 }] : null;
    }

    case "archetype": {
      const frameworks = Array.isArray(n.frameworks) ? (n.frameworks as string[]) : [];
      const stops = frameworks
        .map((framework, i) => {
          const gradient = FRAMEWORK_GRADIENT[framework];
          if (!gradient) return null;
          const stop = frameworks.length === 1 ? 0 : i / (frameworks.length - 1);
          return { color: gradient[0], stop };
        })
        .filter((s): s is { color: string; stop: number } => s !== null);
      return stops.length >= 2 ? stops : null;
    }

    default:
      return null;
  }
}

// Each of the app's 4 spectrums gets its own quadrant (0 top-left, 1
// top-right, 2 bottom-left, 3 bottom-right) — matches the order they're
// generated in scoringMatrix.ts (energy, structure, people, novelty), just
// arranged so no two adjacent-feeling spectrums share an edge.
const AXIS_QUADRANT: Record<AxisId, number> = {
  energy: 0,
  novelty: 1,
  people: 2,
  structure: 3,
};

// Axis nodes carry their spectrum as their own id; trait and question nodes
// carry it as an explicit axisId (see personalityResultsToGraphData.ts).
// The archetype node returns undefined — it spans every spectrum, not just
// one, so it belongs in the shared center rather than any single quadrant.
export function getGraphNodeQuadrant(node: GraphNode): number | undefined {
  const n = node as Record<string, unknown>;
  if (n.kind === "axis") return AXIS_QUADRANT[n.id as AxisId];
  if (typeof n.axisId === "string") return AXIS_QUADRANT[n.axisId as AxisId];
  return undefined;
}

// Same spectrum names as scoringMatrix.ts's AXIS_DEFINITIONS — duplicated
// here (like RING_LABELS above) since this is presentation, not scoring.
const AXIS_LABEL: Record<AxisId, string> = {
  energy: "Energy Direction",
  novelty: "Openness to Novelty",
  people: "People Orientation",
  structure: "Structure & Pace",
};

const QUADRANT_AXIS = (Object.keys(AXIS_QUADRANT) as AxisId[]).reduce<Record<number, AxisId>>((acc, axisId) => {
  acc[AXIS_QUADRANT[axisId]] = axisId;
  return acc;
}, {});

/** The spectrum name to draw on the crosshair for a given quadrant index — see GraphViewProps.getQuadrantLabel. */
export function getGraphQuadrantLabel(quadrant: number): string {
  const axisId = QUADRANT_AXIS[quadrant];
  return axisId ? AXIS_LABEL[axisId] : "";
}

/**
 * How strongly a node's own data leans away from neutral, 0 (dead-even) to
 * 1 (fully leaning toward one pole) — see GraphViewProps.getNodeQuadrantPull.
 * Without this every trait in a quadrant sits at the same fixed distance
 * from center, so all four quadrants fan out into identical-looking
 * mirrored shapes regardless of what your actual scores are. Feeding real
 * score magnitude in here is what makes a strongly-leaning trait visibly
 * push out toward the edge while a near-toss-up trait stays close to the
 * middle, so the shape of each quadrant is a real (if rough) picture of how
 * decisively you land on the traits inside it.
 */
export function getGraphNodeQuadrantPull(node: GraphNode): number {
  const n = node as Record<string, unknown>;
  if (n.kind === "axis" && typeof n.score === "number") {
    // -100..100, neutral at 0.
    return Math.min(1, Math.abs(n.score) / 100);
  }
  if (n.kind === "trait") {
    if (typeof n.score === "number") {
      // Big Five: 0-100, neutral at 50.
      return Math.min(1, Math.abs(n.score - 50) / 50);
    }
    if (typeof n.confidence === "number") {
      // MBTI: 50-100 (a dead-even split between the pole's questions lands at 50).
      return Math.min(1, Math.max(0, (n.confidence - 50) / 50));
    }
    // Human Design type / color type — categorical, no numeric lean to scale by.
    return 1;
  }
  return 1;
}

export function getGraphNodeSize(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  switch (kind) {
    case "archetype":
      return 10;
    case "axis":
      return 8;
    case "trait":
      return 5;
    case "question":
      return 3;
    default:
      return 4;
  }
}
