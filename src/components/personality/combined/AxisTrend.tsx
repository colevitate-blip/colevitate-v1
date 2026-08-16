import type { AxisScore } from "./scoringMatrix";
import type { CombinedSnapshot } from "@/lib/personality/types";

const VIEW_WIDTH = 300;
const VIEW_HEIGHT = 56;
const PAD_X = 6;

function xFor(index: number, count: number) {
  if (count <= 1) return VIEW_WIDTH / 2;
  return PAD_X + (index / (count - 1)) * (VIEW_WIDTH - PAD_X * 2);
}

function yFor(score: number) {
  const clamped = Math.max(-100, Math.min(100, score));
  return VIEW_HEIGHT / 2 - (clamped / 100) * (VIEW_HEIGHT / 2 - 8);
}

export function AxisTrend({ axis, history }: { axis: AxisScore; history: CombinedSnapshot[] }) {
  const points = history
    .map((snapshot) => snapshot.axes.find((a) => a.id === axis.id)?.score)
    .filter((score): score is number => typeof score === "number");

  if (points.length < 2) return null;

  const path = points
    .map((score, i) => `${i === 0 ? "M" : "L"}${xFor(i, points.length)},${yFor(score)}`)
    .join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const delta = Math.round(last - first);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{axis.label}</span>
        <span className="text-xs text-muted-foreground">
          {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta} since your first snapshot`}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-14 w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <line
          x1={0}
          y1={VIEW_HEIGHT / 2}
          x2={VIEW_WIDTH}
          y2={VIEW_HEIGHT / 2}
          className="stroke-border"
          strokeWidth={1}
        />
        <path d={path} fill="none" stroke="url(#axisTrendGradient)" strokeWidth={2} strokeLinecap="round" />
        {points.map((score, i) => (
          <circle
            key={i}
            cx={xFor(i, points.length)}
            cy={yFor(score)}
            r={i === points.length - 1 ? 3.5 : 2.5}
            className={i === points.length - 1 ? "fill-[#37e0c4]" : "fill-muted-foreground"}
          />
        ))}
        <defs>
          <linearGradient id="axisTrendGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c8cff" />
            <stop offset="100%" stopColor="#37e0c4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{axis.leftPole}</span>
        <span>{axis.rightPole}</span>
      </div>
    </div>
  );
}
