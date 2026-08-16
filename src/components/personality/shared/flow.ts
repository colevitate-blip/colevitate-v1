export interface FlowQuestionStep<Q> {
  kind: "question";
  question: Q;
}

export interface FlowOfferStep {
  kind: "offer";
}

export type FlowStep<Q> = FlowQuestionStep<Q> | FlowOfferStep;

interface Tiered {
  tier: "core" | "extended";
}

/**
 * Builds the ordered step sequence for a progressive survey: all core questions, then a single
 * "want higher accuracy?" offer step, then whichever extended questions are still worth asking
 * (the adaptive filter lets a framework skip extended questions for a dimension already resolved
 * by a strong core answer).
 */
export function buildFlowSteps<Q extends Tiered>(
  questions: Q[],
  includeExtended: (question: Q) => boolean = () => true
): FlowStep<Q>[] {
  const core = questions.filter((q) => q.tier === "core");
  const extended = questions.filter((q) => q.tier === "extended" && includeExtended(q));

  const steps: FlowStep<Q>[] = core.map((question) => ({ kind: "question" as const, question }));
  steps.push({ kind: "offer" });
  steps.push(...extended.map((question) => ({ kind: "question" as const, question })));
  return steps;
}
