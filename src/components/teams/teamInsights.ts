import { AXES, type AxisId } from "@/components/personality/combined/scoringMatrix";

export interface SharedMemberAxes {
  displayName: string;
  axes: { id: AxisId; score: number }[];
}

/**
 * Pure, rule-based sentences over the distribution of shared members'
 * scores per axis — no AI/ML, same spirit as the axis growth prompts on
 * the individual combined profile. Returns at most one sentence per axis,
 * skipping axes with no notably clustered or spread-out pattern.
 */
export function computeTeamInsights(members: SharedMemberAxes[]): string[] {
  const insights: string[] = [];

  for (const axis of AXES) {
    const scores = members
      .map((m) => m.axes.find((a) => a.id === axis.id)?.score)
      .filter((s): s is number => typeof s === "number");
    if (scores.length < 2) continue;

    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const spread = max - min;

    if (spread <= 25) {
      insights.push(`The team is closely aligned on ${axis.label.toLowerCase()} — little natural push-pull here.`);
    } else if (spread >= 120) {
      insights.push(
        `This team spans nearly the full range on ${axis.label.toLowerCase()}, from strongly ${axis.leftPole.toLowerCase()} to strongly ${axis.rightPole.toLowerCase()}.`
      );
    } else if (max < 20) {
      insights.push(
        `No one on this team leans strongly toward ${axis.rightPole.toLowerCase()} on ${axis.label.toLowerCase()} — worth someone deliberately covering that ground.`
      );
    } else if (min > -20) {
      insights.push(
        `No one on this team leans strongly toward ${axis.leftPole.toLowerCase()} on ${axis.label.toLowerCase()} — worth someone deliberately covering that ground.`
      );
    }
  }

  return insights;
}
