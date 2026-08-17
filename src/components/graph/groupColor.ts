import type { GraphNode } from "./types";

// Soft, desaturated hues that read clearly against a deep dark background
// without turning into neon. Order matters — nodes are assigned a color by
// the order their group first appears in the data, so keep this stable.
const GROUP_HUES = [235, 355, 150, 285, 40, 190, 320, 95];

export function getGroupColor(index: number): string {
  const hue = GROUP_HUES[index % GROUP_HUES.length];
  return `hsl(${hue}, 60%, 62%)`;
}

export function defaultGetNodeGroup(node: GraphNode): string | undefined {
  const kind = (node as Record<string, unknown>).kind;
  return typeof kind === "string" ? kind : undefined;
}

/** Assigns each distinct group a stable color, in order of first appearance. */
export function buildGroupColorMap(
  nodes: GraphNode[],
  getGroup: (node: GraphNode) => string | undefined
): Map<string, string> {
  const order: string[] = [];
  for (const node of nodes) {
    const group = getGroup(node) ?? "default";
    if (!order.includes(group)) order.push(group);
  }
  const map = new Map<string, string>();
  order.forEach((group, i) => map.set(group, getGroupColor(i)));
  return map;
}
