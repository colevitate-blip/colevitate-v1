import { getGraphNodeExplanation, getGraphNodeKindTag, getGraphNodeLabel } from "./graphAppearance";
import type { GraphNode } from "@/components/graph/types";

const TOOLTIP_WIDTH = 256;
const CURSOR_GAP = 16;

/**
 * Follows the cursor rather than anchoring to a fixed corner of the card —
 * fired straight from GraphView's own hover hit-testing (see
 * onNodeHover), so it works for whichever dot the mouse is actually over
 * without a second, separately-timed hit-test of its own. Position is in
 * viewport coordinates (`fixed`), flipped away from whichever edge the
 * cursor is closest to so it never runs off-screen.
 */
export function GraphNodeTooltip({ node, clientX, clientY }: { node: GraphNode; clientX: number; clientY: number }) {
  const explanation = getGraphNodeExplanation(node);
  const flipX = typeof window !== "undefined" && clientX + CURSOR_GAP + TOOLTIP_WIDTH > window.innerWidth;
  const flipY = typeof window !== "undefined" && clientY > window.innerHeight * 0.6;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-xl border border-border bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150"
      style={{
        width: TOOLTIP_WIDTH,
        left: flipX ? clientX - CURSOR_GAP : clientX + CURSOR_GAP,
        top: flipY ? clientY - CURSOR_GAP : clientY + CURSOR_GAP,
        transform: `translate(${flipX ? "-100%" : "0"}, ${flipY ? "-100%" : "0"})`,
      }}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {getGraphNodeKindTag(node)}
      </p>
      <p className="mt-0.5 text-sm font-semibold">{getGraphNodeLabel(node)}</p>
      {explanation ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{explanation}</p> : null}
    </div>
  );
}
