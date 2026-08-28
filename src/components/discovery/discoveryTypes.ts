import { AXES, type AxisId, type AxisScore } from "@/components/personality/combined/scoringMatrix";

// computeCompatibility() only exports Compatibility/AxisCompatibility, not
// its internal ComparableAxis — src/app/[locale]/(personality)/pair/actions.ts
// redefines the same Pick locally for the same reason; mirrored here.
export type ComparableAxisSnapshot = Pick<AxisScore, "id" | "label" | "leftPole" | "rightPole" | "score">;

export type ApproachableScope = "everyone" | "intents" | "paused";
export type ApproachIntent = "friend" | "romantic" | "professional";
export const APPROACH_INTENTS: ApproachIntent[] = ["friend", "romantic", "professional"];

export type ApproachRequestStatus = "pending" | "accepted" | "declined" | "expired" | "withdrawn";

/** The slim shape stored in approachable_snapshots.axes / approach_requests.sender_axes — just {id, score}, since label/poles are static per axis (mirrors team_members.axes). */
export type StoredAxisSnapshot = { id: AxisId; score: number };

/**
 * Rehydrates a stored {id, score}[] snapshot into the full shape
 * computeCompatibility() (src/components/personality/combined/computeCompatibility.ts)
 * needs, by pulling label/leftPole/rightPole from the static AXES definition.
 * Only the viewer's own side of a comparison needs full fields at runtime,
 * but computeCompatibility's TS signature wants the full shape for both
 * sides, so both the viewer's live axes and a fetched snapshot go through this.
 */
export function hydrateAxisSnapshot(stored: StoredAxisSnapshot[]): ComparableAxisSnapshot[] {
  return stored.map((s) => {
    const def = AXES.find((a) => a.id === s.id);
    return {
      id: s.id,
      label: def?.label ?? s.id,
      leftPole: def?.leftPole ?? "",
      rightPole: def?.rightPole ?? "",
      score: s.score,
    };
  });
}

export interface DiscoverableProfile {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  axes: StoredAxisSnapshot[];
  archetypeName: string | null;
}

export interface ApproachRequestSummary {
  id: string;
  status: ApproachRequestStatus;
  intent: ApproachIntent;
  message: string;
  createdAt: string;
  respondedAt: string | null;
  counterpartId: string;
  counterpartDisplayName: string | null;
  counterpartAvatarUrl: string | null;
}
