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
  /**
   * Groups nodes into visual clusters — nodes sharing the same key get an
   * extra pull toward their group's live centroid, on top of whatever the
   * link/charge forces already do. Without this, two nodes with no direct
   * edge only end up near each other by physics coincidence, which reads as
   * "these are related" even when they aren't. Return undefined for nodes
   * that shouldn't be pulled into any single cluster (e.g. a hub that
   * legitimately sits between several groups).
   */
  getNodeCluster?: (node: GraphNode) => string | undefined;
  /** Overrides the shape used to draw a node (falls back to its "kind"). Return anything unrecognized to get a plain circle. */
  getNodeShape?: (node: GraphNode) => string;
  /** Draws every node the same neutral color instead of coloring by group — an Obsidian-style monochrome look. */
  monochrome?: boolean;
  /** "pill" (default) draws labels on a solid background chip; "plain" draws bare text, Obsidian-style. */
  labelStyle?: "pill" | "plain";
  /** Fired on a real click (not a drag) — the clicked node, or null when clicking empty canvas. */
  onNodeClick?: (node: GraphNode | null) => void;
  /**
   * Fired whenever the hovered node changes — the newly-hovered node (or
   * null when the cursor leaves every node, including on mouse-leave) plus
   * the cursor's viewport position at that moment. Lets a caller show a
   * tooltip without needing its own hit-testing or a second mousemove
   * listener racing this one.
   */
  onNodeHover?: (node: GraphNode | null, clientPos: { x: number; y: number } | null) => void;
  /** Node id to draw with a persistent highlight ring, independent of hover. */
  selectedNodeId?: string | number | null;
  /**
   * Color stops for the selected node's stroke gradient (2+ stops, each
   * 0-1). Return null/undefined to fall back to the plain highlight ring.
   * This is meant to carry real information about the node — e.g. its
   * source framework's accent color, or a two-color mix whose stop
   * positions shift with an actual score — not just a decorative accent.
   */
  getNodeGradient?: (node: GraphNode) => Array<{ color: string; stop: number }> | null;
  /** Fired with the live simulation instance once created, and with null on teardown. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSimulationReady?: (simulation: import("d3-force").Simulation<any, any> | null) => void;
  /** "card" (default) draws the usual bordered/filled canvas; "none" leaves it fully transparent with no border or radius, for floating over arbitrary backgrounds. */
  background?: "card" | "none";
  /** Draws a faint crosshair (one vertical + one horizontal line) through the canvas center, splitting it into four quadrants. No labels, no box — just the two lines. */
  quadrantGuide?: boolean;
  /**
   * Quadrant index (0 = top-left, 1 = top-right, 2 = bottom-left, 3 =
   * bottom-right) a node belongs to. When provided, the simulation pulls
   * every assigned node toward its quadrant instead of free-floating or
   * ringing outward — so the four regions the quadrantGuide crosshair draws
   * actually mean something, instead of being purely decorative. Nodes with
   * no quadrant (return undefined) stay near the shared center, which is
   * correct for anything that spans more than one quadrant's grouping
   * rather than belonging to just one.
   */
  getNodeQuadrant?: (node: GraphNode) => number | undefined;
  /**
   * How far toward its quadrant's outer edge an assigned node should sit,
   * from 0 (a dead-neutral score — stays close to center) to 1 (a maximally
   * leaning score — sits near the edge). Omit to pull every assigned node
   * out to the same fixed distance regardless of its data. This is what
   * lets each quadrant's shape reflect the actual scores behind it instead
   * of every quadrant fanning out identically.
   */
  getNodeQuadrantPull?: (node: GraphNode) => number;
  /** Label drawn on the crosshair itself for a given quadrant (0-3, same indexing as getNodeQuadrant) — lets a spectrum's name live on the line instead of floating next to its node. Ignored unless quadrantGuide is on. */
  getQuadrantLabel?: (quadrant: number) => string;
}
