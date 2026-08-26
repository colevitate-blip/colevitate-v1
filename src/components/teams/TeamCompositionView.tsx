import { Lightbulb } from "lucide-react";
import { positionOf } from "@/lib/personality/axisBar";
import { AXES } from "@/components/personality/combined/scoringMatrix";
import { getGroupColor } from "@/components/graph/groupColor";
import { computeTeamInsights, type SharedMemberAxes } from "./teamInsights";

export function TeamCompositionView({
  members,
  title = "Team Composition",
}: {
  members: SharedMemberAxes[];
  title?: string;
}) {
  const insights = computeTeamInsights(members);

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
      <h2 className="mb-1 font-semibold">{title}</h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Where each member who opted in lands on the four axes.
      </p>

      <div className="space-y-7">
        {AXES.map((axis) => (
          <div key={axis.id}>
            <div className="mb-2 text-sm font-medium">{axis.label}</div>
            <div className="relative h-2 rounded-full bg-muted">
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
              {members.map((member, i) => {
                const score = member.axes.find((a) => a.id === axis.id)?.score;
                if (typeof score !== "number") return null;
                return (
                  <div
                    key={member.displayName + i}
                    title={`${member.displayName}: ${Math.round(score)}`}
                    className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
                    style={{ left: `${positionOf(score)}%`, backgroundColor: getGroupColor(i) }}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{axis.leftPole}</span>
              <span>{axis.rightPole}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-4">
        {members.map((member, i) => (
          <div key={member.displayName + i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: getGroupColor(i) }} />
            <span>{member.displayName}</span>
          </div>
        ))}
      </div>

      {insights.length > 0 && (
        <div className="mt-6 space-y-2.5 border-t pt-4">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
