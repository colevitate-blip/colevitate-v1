export interface GraphNode {
  id: string | number;
  [key: string]: unknown;
}

export interface GraphLink {
  source: string | number;
  target: string | number;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type LabelMode = "off" | "key" | "all";

export interface GraphViewProps {
  data: GraphData;
  getNodeLabel?: (node: GraphNode) => string;
  getNodeGroup?: (node: GraphNode) => string | undefined;
  getNodeSize?: (node: GraphNode) => number;
  getLinkLabel?: (link: GraphLink) => string | undefined;
  /** "off" = no labels, "key" = top ~15% by degree (default), "all" = every visible node. */
  labelMode?: LabelMode;
  /** Node groups (by getNodeGroup) to hide from rendering and hit-testing. */
  hiddenGroups?: Set<string>;
  /**
   * Concentric ring index (0 = center) a node belongs to. When provided, the
   * simulation switches from free-floating force-directed layout to a
   * radial one: nodes are pulled to their ring's radius from the canvas
   * center, so the graph reads as a hierarchy (e.g. root → category → leaf)
   * radiating outward instead of an undifferentiated cloud.
   */
  getNodeRing?: (node: GraphNode) => number;
  /** Label drawn at the top of each ring (ring index, 1+) when in radial mode — e.g. ring 1 → "Axes". */
  getRingLabel?: (ring: number) => string;
  /**
   * Overrides which nodes count as "important" in labelMode "key" (default:
   * top ~15% by degree). Use this when degree alone doesn't reflect which
   * nodes are the meaningful landmarks — e.g. always labeling category nodes
   * even if a handful of leaves happen to have more connections.
   */
  getNodeImportance?: (node: GraphNode, degree: number) => boolean;
  /** Overrides the shape used to draw a node (falls back to its "kind"). Return anything unrecognized to get a plain circle. */
  getNodeShape?: (node: GraphNode) => string;
  /** Draws every node the same neutral color instead of coloring by group — an Obsidian-style monochrome look. */
  monochrome?: boolean;
  /** "pill" (default) draws labels on a solid background chip; "plain" draws bare text, Obsidian-style. */
  labelStyle?: "pill" | "plain";
  /** Fired with the live simulation instance once created, and with null on teardown. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSimulationReady?: (simulation: import("d3-force").Simulation<any, any> | null) => void;
}
