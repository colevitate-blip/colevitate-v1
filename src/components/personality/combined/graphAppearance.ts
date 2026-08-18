import type { GraphNode } from "@/components/graph/types";

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
  if (nodeObj.kind === "thread") {
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

// Concentric ring per node kind — 0 is dead center. This mirrors the real
// hierarchy the data represents: your archetype sits at the center because
// everything else feeds it, radiating out through the axes it's computed
// from, the frameworks (threads) that inform those axes, the specific
// traits each framework measures, and finally the raw answers behind them.
const KIND_RING: Record<string, number> = {
  archetype: 0,
  axis: 1,
  thread: 2,
  trait: 3,
  question: 4,
};

export function getGraphNodeRing(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  return KIND_RING[typeof kind === "string" ? kind : ""] ?? 4;
}

const RING_LABELS: Record<number, string> = {
  1: "Spectrums",
  2: "Frameworks",
  3: "Traits",
  4: "Answers",
};

export function getGraphRingLabel(ring: number) {
  return RING_LABELS[ring] ?? "";
}

// In "key" label mode, always label the landmark nodes (archetype, axes,
// threads) regardless of how many connections they happen to have — degree
// alone under-labels these since a single trait node can easily out-degree
// an axis. Traits/questions still fall back to the degree heuristic so the
// densest layer doesn't get labeled all at once.
export function getGraphNodeImportance(node: GraphNode, degree: number) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "archetype" || kind === "axis" || kind === "thread") return true;
  return degree >= 3;
}

const KIND_TAGS: Record<string, string> = {
  archetype: "Your archetype",
  axis: "Spectrum — a core personality scale",
  thread: "Framework you completed",
  trait: "Trait",
  question: "Your answer",
};

/** Short "what kind of thing is this" tag shown at the top of the click-to-explain panel. */
export function getGraphNodeKindTag(node: GraphNode): string {
  const kind = (node as Record<string, unknown>).kind;
  return KIND_TAGS[typeof kind === "string" ? kind : ""] ?? "";
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
    case "thread": {
      const label = String(n.label ?? "");
      const name = String(n.name ?? "");
      const tagline = String(n.tagline ?? "");
      return `Your ${label} result: ${name}. ${tagline}`;
    }
    case "trait":
      return String(n.description ?? "");
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
// together — a trait and its thread (and any raw answers behind it) share a
// cluster key so the layout visibly groups "everything that came from 16
// Personalities" instead of leaving that relationship to chance physics.
// Axis and archetype nodes span multiple frameworks by nature, so they sit
// outside any single cluster — exactly where they belong, since they're the
// shared ground between clusters, not part of one.
export function getGraphNodeCluster(node: GraphNode): string | undefined {
  const n = node as Record<string, unknown>;
  if (n.kind === "thread") return String(n.id);
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
 *  - thread/trait/question: the color of whichever framework it came from
 *    (or, for a literal color-type trait like "red", that color itself).
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

    case "thread": {
      const gradient = FRAMEWORK_GRADIENT[String(n.id)];
      return gradient ? [{ color: gradient[0], stop: 0 }, { color: gradient[1], stop: 1 }] : null;
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

export function getGraphNodeSize(node: GraphNode) {
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
