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
  /** Fired with the live simulation instance once created, and with null on teardown. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSimulationReady?: (simulation: import("d3-force").Simulation<any, any> | null) => void;
}
