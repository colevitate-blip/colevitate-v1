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
    return String(nodeObj.id);
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
  1: "Axes",
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
