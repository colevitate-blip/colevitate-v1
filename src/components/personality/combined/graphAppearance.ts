import type { GraphNode } from "@/components/graph/types";
import type { AxisId } from "@/lib/personality/types";
import { axisSentenceFor, type Subject, type Translator } from "./scoringMatrix";

export type { Subject };

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
// already surface it). Axis nodes get their own label here — outside
// quadrant mode there's no crosshair heading naming the spectrum, so
// without this an axis node was the only dot on the whole graph with no
// text anywhere near it, reading as broken/uninitialized rather than
// intentional. (In quadrant mode, use getGraphNodeCanvasLabelQuadrant
// below instead — the crosshair already carries that name.) GraphView's
// label-collision pass prioritizes larger nodes (see getNodeRadius sort in
// GraphView.tsx), so this rarely fights with a nearby trait label for space.
export function getGraphNodeCanvasLabel(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "question") return "";
  return getGraphNodeLabel(node);
}

// Quadrant mode already prints the spectrum's name as the crosshair heading
// (see getGraphQuadrantLabel) right next to the axis dot, so labeling the
// dot itself with that same name a few pixels away is pure repetition —
// this variant drops it there while keeping every other kind's label (and
// the non-quadrant behavior above, where the crosshair heading doesn't
// exist and the axis dot needs its own label or it reads as broken).
export function getGraphNodeCanvasLabelQuadrant(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "axis") return "";
  return getGraphNodeCanvasLabel(node);
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

export function getGraphRingLabel(ring: number, t: Translator) {
  if (ring !== 1 && ring !== 2 && ring !== 3) return "";
  return t(`graph.ringLabels.${ring}`);
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

/** Short "what kind of thing is this" tag shown at the top of the click-to-explain panel. */
export function getGraphNodeKindTag(node: GraphNode, subject: Subject = "you", t?: Translator): string {
  const kind = (node as Record<string, unknown>).kind;
  if (!t) return "";
  if (kind === "archetype") return t(`graph.archetypeTag.${subject}`);
  if (kind === "axis" || kind === "trait" || kind === "question") return t(`graph.kindTags.${kind}`);
  return "";
}

// Big Five trait phrasing, tiered by the actual 0-100 score — the
// personalized half of a trait's explanation, appended after the generic
// description so a click answers both "what is this" and "where does this
// person land on it." Written out per-subject (not pronoun-templated) in
// graph.json, since third-person grammar doesn't translate as a shared
// template across languages (see scoringMatrix.ts's axisSentenceFor for the
// same reasoning).
function bigFiveText(trait: string, score: number, subject: Subject, t: Translator): string {
  const tier = score >= 70 ? "high" : score <= 30 ? "low" : "mid";
  return t(`graph.bigFiveText.${trait}.${tier}.${subject}`);
}

function mbtiText(pole: string, confidence: number, subject: Subject, t: Translator): string {
  const poleName = t(`scoring.labels.mbtiPoles.${pole}`);
  return t(`graph.mbtiLean.${subject}`, { pole: poleName, confidence: Math.round(confidence) });
}

// Not every trait has hand-written third-person copy (graph.json only
// carries `descriptionThird` for the traits worth personalizing at a
// glance) — this mirrors which keys personalityResultsToGraphData.ts's
// TRAIT_TO_AXIS registry actually populates a descriptionThird for.
const TRAITS_WITH_THIRD_PERSON = new Set([
  "EI", "SN", "JP", "openness", "conscientiousness", "extraversion",
  "agreeableness", "neuroticism", "generator", "manifestor",
]);

/** Plain-English explanation of a specific node, for the click-to-explain panel. */
export function getGraphNodeExplanation(node: GraphNode, subject: Subject = "you", t?: Translator): string {
  const n = node as Record<string, unknown>;
  switch (n.kind) {
    case "archetype": {
      if (subject === "you" || !t) return String(n.description ?? "");
      const archetypeKey = String(n.archetypeKey ?? "");
      if (!archetypeKey) return String(n.description ?? "");
      return t(`archetypes.${archetypeKey}.descriptionThird.${subject}`);
    }
    case "axis": {
      if (!t) return "";
      const left = String(n.leftPole ?? "");
      const right = String(n.rightPole ?? "");
      const selfSentence = String(n.sentence ?? "");
      const sentence = axisSentenceFor(n.id as AxisId, Number(n.tierIndex ?? 0), subject, selfSentence, t);
      return `Measures ${left} vs. ${right}. ${sentence}`;
    }
    case "trait": {
      if (!t) return String(n.description ?? "");
      const traitId = String(n.id ?? "");
      const description =
        subject === "you" || !TRAITS_WITH_THIRD_PERSON.has(traitId)
          ? String(n.description ?? "")
          : t(`graph.traits.${traitId}.descriptionThird.${subject}`);
      let youText = "";
      if (typeof n.score === "number") {
        youText = bigFiveText(traitId, n.score, subject, t);
      } else if (typeof n.pole === "string" && typeof n.confidence === "number") {
        youText = mbtiText(n.pole, n.confidence, subject, t);
      }
      return youText ? `${description} ${youText}` : description;
    }
    case "question": {
      // Question nodes only exist when raw in-progress answers are cached
      // locally (see personalityResultsToGraphData) — that's never true for
      // a famous person's editorial profile, so this is unreachable with a
      // non-"you" subject in practice.
      const prompt = String(n.prompt ?? "");
      const answer = n.answer;
      const answerText = Array.isArray(answer) ? answer.join(" > ") : String(answer);
      return `"${prompt}" — answer: ${answerText}`;
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

const QUADRANT_AXIS = (Object.keys(AXIS_QUADRANT) as AxisId[]).reduce<Record<number, AxisId>>((acc, axisId) => {
  acc[AXIS_QUADRANT[axisId]] = axisId;
  return acc;
}, {});

/** The spectrum name to draw on the crosshair for a given quadrant index — see GraphViewProps.getQuadrantLabel. */
export function getGraphQuadrantLabel(quadrant: number, t: Translator): string {
  const axisId = QUADRANT_AXIS[quadrant];
  return axisId ? t(`scoring.axes.${axisId}.label`) : "";
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
