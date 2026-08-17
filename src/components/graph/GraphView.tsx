"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import type { GraphNode, GraphViewProps } from "./types";
import { buildGroupColorMap, defaultGetNodeGroup } from "./groupColor";

interface SimNode extends SimulationNodeDatum {
  id: string | number;
  [key: string]: unknown;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: SimNode | string | number;
  target: SimNode | string | number;
  [key: string]: unknown;
}

export interface GraphViewHandle {
  /** Unpins every node, restarts the simulation from fresh (jittered) positions. */
  resetLayout: () => void;
}

const LABEL_PADDING_X = 4;
const LABEL_PADDING_Y = 2;
const LABEL_LINE_HEIGHT = 14;

export const GraphView = forwardRef<GraphViewHandle, GraphViewProps>(function GraphView(
  { data, getNodeLabel, getNodeGroup, getNodeSize, getLinkLabel: _getLinkLabel, labelMode = "key", hiddenGroups, onSimulationReady },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | number | null>(null);
  const hoveredNodeIdRef = useRef<string | number | null>(null);
  const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);
  const degreeRef = useRef<Map<string | number, number>>(new Map());
  const groupColorsRef = useRef<Map<string, string>>(new Map());
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const dprRef = useRef(1);
  const draggingRef = useRef<{ nodeId: string | number; offsetX: number; offsetY: number } | null>(null);
  const labelModeRef = useRef(labelMode);
  const hiddenGroupsRef = useRef(hiddenGroups);
  const colorsRef = useRef({
    primary: "#7c8cff",
    card: "#0d1224",
    border: "#232a4a",
    foreground: "#dfe3ff",
    muted: "#8890b8",
  });

  const defaultGetNodeLabel = (node: GraphNode) => node.label ?? node.title ?? node.name ?? String(node.id);
  const defaultGetNodeSize = () => 5;
  const resolvedGetNodeLabel = getNodeLabel || defaultGetNodeLabel;
  const resolvedGetNodeSize = getNodeSize || defaultGetNodeSize;
  const resolvedGetNodeGroup = getNodeGroup || defaultGetNodeGroup;

  useEffect(() => {
    labelModeRef.current = labelMode;
  }, [labelMode]);

  useEffect(() => {
    hiddenGroupsRef.current = hiddenGroups;
  }, [hiddenGroups]);

  const isNodeHidden = useCallback(
    (node: SimNode) => {
      const groups = hiddenGroupsRef.current;
      if (!groups || groups.size === 0) return false;
      return groups.has(resolvedGetNodeGroup(node as GraphNode) ?? "default");
    },
    [resolvedGetNodeGroup]
  );

  const getConnectedNodeIds = useCallback((nodeId: string | number): Set<string | number> => {
    const connected = new Set<string | number>();
    connected.add(nodeId);

    linksRef.current.forEach((link) => {
      const source = typeof link.source === "object" ? (link.source as SimNode).id : link.source;
      const target = typeof link.target === "object" ? (link.target as SimNode).id : link.target;

      if (source === nodeId) connected.add(target);
      if (target === nodeId) connected.add(source);
    });

    return connected;
  }, []);

  // Radius reflects importance (degree = how many links a node has) on top of
  // the caller's base size, but the bonus is sqrt-scaled and capped so hub
  // nodes stay restrained instead of ballooning over everything else.
  const getNodeRadius = useCallback(
    (node: SimNode) => {
      const degree = degreeRef.current.get(node.id) ?? 0;
      const base = resolvedGetNodeSize(node as GraphNode);
      const bonus = Math.min(Math.sqrt(degree) * 1.4, 8);
      return base + bonus;
    },
    [resolvedGetNodeSize]
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement, nodes: SimNode[], links: SimLink[], dpr: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawShape = (
        x: number,
        y: number,
        radius: number,
        kind: string,
        fill: string,
        isHovered: boolean
      ) => {
        switch (kind) {
          case "question":
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "trait":
            ctx.fillStyle = fill;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            break;

          case "thread":
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.moveTo(x, y - radius);
            ctx.lineTo(x + radius, y + radius);
            ctx.lineTo(x - radius, y + radius);
            ctx.closePath();
            ctx.fill();
            break;

          case "axis":
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.moveTo(x, y - radius);
            ctx.lineTo(x + radius, y);
            ctx.lineTo(x, y + radius);
            ctx.lineTo(x - radius, y);
            ctx.closePath();
            ctx.fill();
            break;

          case "archetype":
            ctx.fillStyle = fill;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
              const angle = (i * Math.PI) / 5 - Math.PI / 2;
              const dist = i % 2 === 0 ? radius : radius * 0.4;
              const px = x + Math.cos(angle) * dist;
              const py = y + Math.sin(angle) * dist;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            break;

          default:
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = colorsRef.current.card;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (isHovered) {
          ctx.strokeStyle = colorsRef.current.primary;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      };

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr * zoomRef.current, dpr * zoomRef.current);

      const activeId = hoveredNodeIdRef.current;
      const connectedToActive = activeId ? getConnectedNodeIds(activeId) : new Set<string | number>();
      const dimAlpha = 0.16;

      // Links
      links.forEach((link) => {
        const source = typeof link.source === "object" ? link.source : nodes.find((n) => n.id === link.source)!;
        const target = typeof link.target === "object" ? link.target : nodes.find((n) => n.id === link.target)!;

        if (!source || !target) return;
        if (isNodeHidden(source) || isNodeHidden(target)) return;

        const isActive = activeId && (connectedToActive.has(source.id) || connectedToActive.has(target.id));
        ctx.globalAlpha = isActive ? 0.85 : activeId ? dimAlpha * 0.5 : 0.22;
        ctx.strokeStyle = isActive ? colorsRef.current.primary : colorsRef.current.border;
        ctx.lineWidth = isActive ? 1 : 0.75;
        ctx.beginPath();
        ctx.moveTo((source.x || 0) + panRef.current.x, (source.y || 0) + panRef.current.y);
        ctx.lineTo((target.x || 0) + panRef.current.x, (target.y || 0) + panRef.current.y);
        ctx.stroke();
      });

      // Nodes with geometric shapes
      const visibleNodes = nodes.filter((n) => !isNodeHidden(n));
      visibleNodes.forEach((node) => {
        const isActive = activeId ? connectedToActive.has(node.id) : true;
        const isHovered = node.id === hoveredNodeIdRef.current;
        ctx.globalAlpha = isActive ? 1 : dimAlpha;

        const x = (node.x || 0) + panRef.current.x;
        const y = (node.y || 0) + panRef.current.y;
        const radius = getNodeRadius(node);
        const group = resolvedGetNodeGroup(node as GraphNode) ?? "default";
        const fill = groupColorsRef.current.get(group) ?? colorsRef.current.muted;
        const kind = (node as Record<string, unknown>).kind ?? "default";

        drawShape(x, y, radius, String(kind), fill, isHovered);
      });

      // Labels. Three modes: "off" draws none; "key" shows only the top ~15%
      // of nodes by degree (plus the hovered node's neighbors); "all" shows
      // every visible node's label. A greedy overlap check skips any label
      // whose box would collide with one already placed this frame, so text
      // never piles up regardless of mode.
      const mode = labelModeRef.current;
      if (mode !== "off") {
        ctx.globalAlpha = 1;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const placedLabelRects: Array<{ x0: number; y0: number; x1: number; y1: number }> = [];

        const degrees = [...degreeRef.current.values()];
        const importantThreshold =
          mode === "key" && degrees.length > 0
            ? degrees.sort((a, b) => b - a)[Math.max(0, Math.min(degrees.length - 1, Math.floor(degrees.length * 0.15)))]
            : 0;

        visibleNodes.forEach((node) => {
          const degree = degreeRef.current.get(node.id) ?? 0;
          const isImportant = degree >= importantThreshold && degree > 0;
          const shouldLabel =
            mode === "all" ? true : activeId ? connectedToActive.has(node.id) : isImportant;
          if (!shouldLabel) return;

          const x = (node.x || 0) + panRef.current.x;
          const y = (node.y || 0) + panRef.current.y + getNodeRadius(node) + 6;
          const label = String(resolvedGetNodeLabel(node));
          const textWidth = ctx.measureText(label).width;
          const rect = {
            x0: x - textWidth / 2 - LABEL_PADDING_X,
            y0: y - LABEL_PADDING_Y,
            x1: x + textWidth / 2 + LABEL_PADDING_X,
            y1: y + LABEL_LINE_HEIGHT + LABEL_PADDING_Y,
          };

          const collides = placedLabelRects.some(
            (r) => rect.x0 < r.x1 && rect.x1 > r.x0 && rect.y0 < r.y1 && rect.y1 > r.y0
          );
          // Always show the hovered node's own label even if it would
          // collide — it's the one thing the user is pointing at.
          if (collides && node.id !== activeId) return;
          placedLabelRects.push(rect);

          // Pill background for contrast against overlapping links/nodes.
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = colorsRef.current.card;
          const radiusPx = 4;
          ctx.beginPath();
          ctx.moveTo(rect.x0 + radiusPx, rect.y0);
          ctx.arcTo(rect.x1, rect.y0, rect.x1, rect.y1, radiusPx);
          ctx.arcTo(rect.x1, rect.y1, rect.x0, rect.y1, radiusPx);
          ctx.arcTo(rect.x0, rect.y1, rect.x0, rect.y0, radiusPx);
          ctx.arcTo(rect.x0, rect.y0, rect.x1, rect.y0, radiusPx);
          ctx.closePath();
          ctx.fill();

          ctx.globalAlpha = 1;
          ctx.fillStyle = colorsRef.current.foreground;
          ctx.fillText(label, x, y);
        });
      }

      ctx.globalAlpha = 1;
    },
    [resolvedGetNodeLabel, resolvedGetNodeGroup, getNodeRadius, getConnectedNodeIds, isNodeHidden]
  );

  const redraw = useCallback(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, nodesRef.current, linksRef.current, dprRef.current);
    }
  }, [draw]);

  // Redraw immediately when label mode or group visibility changes — these
  // don't touch the simulation, so no tick would otherwise trigger a repaint.
  useEffect(() => {
    redraw();
  }, [labelMode, hiddenGroups, redraw]);

  const layoutNodes = useCallback((width: number, height: number) => {
    nodesRef.current.forEach((node) => {
      node.fx = null;
      node.fy = null;
      node.vx = 0;
      node.vy = 0;
      // Small random jitter around the center — starting every node on the
      // exact same point makes early ticks fight over direction and settle
      // messier than a gentle spread does.
      node.x = width / 2 + (Math.random() - 0.5) * 60;
      node.y = height / 2 + (Math.random() - 0.5) * 60;
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      resetLayout: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        layoutNodes(canvas.clientWidth, canvas.clientHeight);
        simulationRef.current?.alpha(1).restart();
      },
    }),
    [layoutNodes]
  );

  // Initialize simulation and nodes/links
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const computed = getComputedStyle(canvas);
    colorsRef.current = {
      primary: computed.getPropertyValue("--primary").trim() || colorsRef.current.primary,
      card: computed.getPropertyValue("--card").trim() || colorsRef.current.card,
      border: computed.getPropertyValue("--border").trim() || colorsRef.current.border,
      foreground: computed.getPropertyValue("--foreground").trim() || colorsRef.current.foreground,
      muted: computed.getPropertyValue("--muted-foreground").trim() || colorsRef.current.muted,
    };

    const nodes: SimNode[] = data.nodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 60,
      y: height / 2 + (Math.random() - 0.5) * 60,
    } as SimNode));
    const links: SimLink[] = data.links.map((l) => ({
      ...l,
      source: nodes.find((n) => n.id === l.source)!,
      target: nodes.find((n) => n.id === l.target)!,
    }));

    nodesRef.current = nodes;
    linksRef.current = links;

    const degree = new Map<string | number, number>();
    for (const node of nodes) degree.set(node.id, 0);
    for (const link of links) {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      degree.set(sourceId, (degree.get(sourceId) ?? 0) + 1);
      degree.set(targetId, (degree.get(targetId) ?? 0) + 1);
    }
    degreeRef.current = degree;
    groupColorsRef.current = buildGroupColorMap(data.nodes, resolvedGetNodeGroup);

    const simulation = forceSimulation(nodes)
      // Repulsion between all node pairs — the main thing that keeps the
      // graph from collapsing into a dense hairball. distanceMax caps how
      // far apart two nodes still push each other, which keeps the layout
      // local (and cheap) once it's roughly 100-300 nodes.
      .force("charge", forceManyBody().strength(-220).distanceMax(600))
      // Springs along actual edges. Distance is the *rest length* of the
      // spring (bigger = airier graph); strength is deliberately soft so
      // clusters can breathe instead of snapping into rigid triangles.
      .force("link", forceLink<SimNode, SimLink>(links).distance(100).strength(0.25))
      // Gentle pull toward the canvas center so the whole graph doesn't
      // drift or fly apart — strength < 1 keeps it a suggestion, not a leash.
      .force("center", forceCenter(width / 2, height / 2).strength(0.3))
      // Hard collision radius (node radius + padding) — this is what
      // actually guarantees nodes never overlap, regardless of what charge/
      // link end up doing.
      .force(
        "collide",
        forceCollide<SimNode>((n) => getNodeRadius(n) + 6).strength(0.85)
      )
      // Faster cooling than d3's default (0.0228) so the layout settles into
      // a clean, still picture instead of jittering forever.
      .alphaDecay(0.035)
      .velocityDecay(0.45)
      .on("tick", () => {
        draw(canvas, nodes, links, dpr);
      });

    simulationRef.current = simulation;
    onSimulationReady?.(simulation);

    return () => {
      simulation.stop();
      onSimulationReady?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, draw, getNodeRadius]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomRef.current - panRef.current.x;
    const y = (e.clientY - rect.top) / zoomRef.current - panRef.current.y;

    if (draggingRef.current) {
      if (draggingRef.current.nodeId === "_pan") {
        panRef.current.x = (e.clientX - rect.left) / zoomRef.current - draggingRef.current.offsetX;
        panRef.current.y = (e.clientY - rect.top) / zoomRef.current - draggingRef.current.offsetY;
        redraw();
        return;
      }
      const node = nodesRef.current.find((n) => n.id === draggingRef.current!.nodeId);
      if (node) {
        node.fx = x - draggingRef.current.offsetX;
        node.fy = y - draggingRef.current.offsetY;
        simulationRef.current?.alpha(0.3).restart();
      }
      return;
    }

    let hovered: string | number | null = null;
    for (const node of nodesRef.current) {
      if (isNodeHidden(node)) continue;
      const dx = (node.x || 0) - x;
      const dy = (node.y || 0) - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < getNodeRadius(node) + 5) {
        hovered = node.id;
        break;
      }
    }

    if (hovered !== hoveredNodeIdRef.current) {
      hoveredNodeIdRef.current = hovered;
      setHoveredNodeId(hovered);
      redraw();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNodeId === null) {
      // Start panning
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        draggingRef.current = {
          nodeId: "_pan",
          offsetX: (e.clientX - rect.left) / zoomRef.current - panRef.current.x,
          offsetY: (e.clientY - rect.top) / zoomRef.current - panRef.current.y,
        };
      }
      return;
    }

    const node = nodesRef.current.find((n) => n.id === hoveredNodeId);
    if (node) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const canvasX = (e.clientX - rect.left) / zoomRef.current - panRef.current.x;
        const canvasY = (e.clientY - rect.top) / zoomRef.current - panRef.current.y;
        draggingRef.current = {
          nodeId: hoveredNodeId,
          offsetX: canvasX - (node.x || 0),
          offsetY: canvasY - (node.y || 0),
        };
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingRef.current?.nodeId !== "_pan") {
      const node = nodesRef.current.find((n) => n.id === draggingRef.current?.nodeId);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
    }
    draggingRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const oldZoom = zoomRef.current;
    zoomRef.current = Math.max(0.1, Math.min(5, zoomRef.current * delta));

    panRef.current.x -= mouseX * (1 / oldZoom - 1 / zoomRef.current);
    panRef.current.y -= mouseY * (1 / oldZoom - 1 / zoomRef.current);
    redraw();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        hoveredNodeIdRef.current = null;
        setHoveredNodeId(null);
        redraw();
      }}
      onWheel={handleWheel}
      className="w-full h-full border border-border rounded-lg bg-card cursor-grab active:cursor-grabbing"
      style={{ display: "block" }}
    />
  );
});
