import type { GraphNode } from "@/components/graph/types";
import type { AxisId } from "@/lib/personality/types";
import { axisSentenceFor, pronounsFor, type PronounSet, type Subject } from "./scoringMatrix";

export type { Subject };

// Module-level so identity stays stable across re-renders — GraphView keys
// its simulation-setup effect off these, and a fresh function reference on
// every render would tear down and rebuild the simulation constantly.
export function getGraphNodeLabel(node: GraphNode) {
  const nodeObj = node as Record<string, unknown>;
  if (nodeObj.kind === "question") {
    return `Q: ${String(nodeObj.prompt).substring(0, 20)}...`;
  }
  if (nodeObj.kind === "trait") {
    return String(nodeObj.label);
  }
  if (nodeObj.kind === "axis") {
    return String(nodeObj.label ?? nodeObj.id);
  }
  if (nodeObj.kind === "archetype") {
    return String(nodeObj.label);
  }
  return String(nodeObj.id);
}

// Floating on-canvas label — deliberately narrower than getGraphNodeLabel
// above, which is also used for the click/hover detail panels where the
// full text is wanted. On the canvas itself: a question node's "Q: ..."
// prompt is too noisy at this density (the hover tooltip and click panel
// already surface it). Axis nodes get their own label here — outside
// quadrant mode there's no crosshair heading naming the spectrum, so
// without this an axis node was the only dot on the whole graph with no
// text anywhere near it, reading as broken/uninitialized rather than
// intentional. (In quadrant mode, use getGraphNodeCanvasLabelQuadrant
// below instead — the crosshair already carries that name.) GraphView's
// label-collision pass prioritizes larger nodes (see getNodeRadius sort in
// GraphView.tsx), so this rarely fights with a nearby trait label for space.
export function getGraphNodeCanvasLabel(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "question") return "";
  return getGraphNodeLabel(node);
}

// Quadrant mode already prints the spectrum's name as the crosshair heading
// (see getGraphQuadrantLabel) right next to the axis dot, so labeling the
// dot itself with that same name a few pixels away is pure repetition —
// this variant drops it there while keeping every other kind's label (and
// the non-quadrant behavior above, where the crosshair heading doesn't
// exist and the axis dot needs its own label or it reads as broken).
export function getGraphNodeCanvasLabelQuadrant(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "axis") return "";
  return getGraphNodeCanvasLabel(node);
}

// Concentric ring per node kind — 0 is dead center. This mirrors the real
// hierarchy the data represents: your archetype sits at the center because
// everything else feeds it, radiating out through the axes it's computed
// from, the specific traits each spectrum is measured by, and finally the
// raw answers behind them.
const KIND_RING: Record<string, number> = {
  archetype: 0,
  axis: 1,
  trait: 2,
  question: 3,
};

export function getGraphNodeRing(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  return KIND_RING[typeof kind === "string" ? kind : ""] ?? 3;
}

const RING_LABELS: Record<number, string> = {
  1: "Spectrums",
  2: "Traits",
  3: "Answers",
};

export function getGraphRingLabel(ring: number) {
  return RING_LABELS[ring] ?? "";
}

// In "key" label mode, always label the landmark nodes (archetype, axes)
// regardless of how many connections they happen to have — degree alone
// under-labels these since a single trait node can easily out-degree an
// axis. Traits/questions still fall back to the degree heuristic so the
// densest layer doesn't get labeled all at once.
export function getGraphNodeImportance(node: GraphNode, degree: number) {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "archetype" || kind === "axis") return true;
  return degree >= 3;
}

// "archetype" isn't here — its tag is built from the subject's own
// possessive pronoun below ("Your archetype" / "His archetype" / "Her
// archetype") instead of a fixed string.
const KIND_TAGS: Record<string, string> = {
  axis: "Spectrum — a core personality scale",
  trait: "Trait",
  question: "Your answer",
};

/** Short "what kind of thing is this" tag shown at the top of the click-to-explain panel. */
export function getGraphNodeKindTag(node: GraphNode, subject: Subject = "you"): string {
  const kind = (node as Record<string, unknown>).kind;
  if (kind === "archetype") return `${pronounsFor(subject).Poss} archetype`;
  return KIND_TAGS[typeof kind === "string" ? kind : ""] ?? "";
}

// Big Five trait phrasing, tiered by the actual 0-100 score — the
// personalized half of a trait's explanation, appended after the generic
// description so a click answers both "what is this" and "where does this
// person land on it." Each entry is a function of the subject's pronoun
// set so the exact same tier reads as "You're drawn to..." on the self
// profile graph and "She's drawn to..." on a famous person's.
const BIG_FIVE_TEXT: Record<string, { high: (p: PronounSet) => string; mid: (p: PronounSet) => string; low: (p: PronounSet) => string }> = {
  openness: {
    high: (p) => `${p.ContractIs} drawn to new ideas, unconventional thinking, and exploring the unfamiliar.`,
    mid: (p) => `${p.ContractIs} about equally comfortable with the familiar and the untested, without a strong pull either way.`,
    low: (p) => `${p.Subj} ${p.subj === "you" ? "gravitate" : "gravitates"} toward the practical and familiar over the abstract or untested.`,
  },
  conscientiousness: {
    high: (p) => `${p.Subj} ${p.subj === "you" ? "lean" : "leans"} organized and goal-directed, and ${p.subj === "you" ? "tend" : "tends"} to follow through once ${p.subj} ${p.subj === "you" ? "commit" : "commits"}.`,
    mid: (p) => `${p.Subj} ${p.subj === "you" ? "balance" : "balances"} structure and spontaneity about evenly.`,
    low: (p) => `${p.Subj} ${p.subj === "you" ? "favor" : "favors"} flexibility over rigid plans, and ${p.subj === "you" ? "adapt" : "adapts"} as ${p.subj} ${p.subj === "you" ? "go" : "goes"}.`,
  },
  extraversion: {
    high: (p) => `Social engagement and stimulation genuinely energize ${p.obj}.`,
    mid: (p) => `${p.ContractIs} comfortable both around people and on ${p.poss} own, depending on the moment.`,
    low: (p) => `Time alone recharges ${p.obj} more reliably than social stimulation does.`,
  },
  agreeableness: {
    high: (p) => `${p.Subj} ${p.subj === "you" ? "prioritize" : "prioritizes"} cooperation and how a decision lands on other people.`,
    mid: (p) => `${p.Subj} ${p.subj === "you" ? "weigh" : "weighs"} ${p.poss} own read on things and others' feelings about evenly.`,
    low: (p) => `${p.Subj} ${p.subj === "you" ? "prioritize" : "prioritizes"} ${p.poss} own read on a situation over managing how it lands on others.`,
  },
  neuroticism: {
    high: (p) => `Stress and emotional swings register strongly and quickly for ${p.obj}.`,
    mid: (p) => `${p.Subj} ${p.subj === "you" ? "feel" : "feels"} stress like anyone does, without it dominating how ${p.subj} ${p.subj === "you" ? "operate" : "operates"}.`,
    low: (p) => `${p.Subj} ${p.subj === "you" ? "stay" : "stays"} even-keeled under pressure more reliably than most.`,
  },
};

function bigFiveText(trait: string, score: number, subject: Subject): string {
  const phrases = BIG_FIVE_TEXT[trait];
  if (!phrases) return "";
  const p = pronounsFor(subject);
  if (score >= 70) return phrases.high(p);
  if (score <= 30) return phrases.low(p);
  return phrases.mid(p);
}

const MBTI_POLE_NAME: Record<string, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
};

function mbtiText(pole: string, confidence: number, subject: Subject): string {
  const poleName = MBTI_POLE_NAME[pole];
  if (!poleName) return "";
  const p = pronounsFor(subject);
  const lean = subject === "you" ? "lean" : "leans";
  return `${p.Subj} ${lean} toward ${poleName} — ${Math.round(confidence)}% in that direction based on ${p.poss} answers.`;
}

// Same idea as BIG_FIVE_TEXT above, but for the ~10 generic trait
// descriptions (personalityResultsToGraphData's TRAIT_DESCRIPTIONS) that
// happen to be written in second person — the rest of that dictionary
// doesn't reference "you" at all, so it's reused unchanged for every
// subject and doesn't need an entry here.
const TRAIT_DESCRIPTION_THIRD: Partial<Record<string, (p: PronounSet) => string>> = {
  EI: (p) => `Whether ${p.subj} ${p.subj === "you" ? "draw" : "draws"} energy from engaging with the outer world (Extraversion) or from time alone with ${p.poss} own thoughts (Introversion).`,
  SN: (p) => `Whether ${p.subj} ${p.subj === "you" ? "trust" : "trusts"} concrete, present detail (Sensing) or patterns and possibilities (Intuition).`,
  JP: (p) => `Whether ${p.subj} ${p.subj === "you" ? "prefer" : "prefers"} things settled and planned (Judging) or open and flexible (Perceiving).`,
  openness: (p) => `How drawn ${p.subj} ${p.isAre} to new ideas and unconventional thinking versus the practical and familiar.`,
  conscientiousness: (p) => `How organized, disciplined, and goal-directed ${p.subj} ${p.subj === "you" ? "tend" : "tends"} to be.`,
  extraversion: (p) => `How much social engagement and stimulation energize ${p.obj}, versus drain ${p.obj}.`,
  agreeableness: (p) => `How much ${p.subj} ${p.subj === "you" ? "prioritize" : "prioritizes"} cooperation and others' feelings versus ${p.poss} own agenda.`,
  neuroticism: (p) => `How easily ${p.subj} ${p.subj === "you" ? "experience" : "experiences"} stress, worry, or emotional volatility.`,
  generator: (p) => `A Human Design type built to respond to what shows up, generating energy by engaging with what lights ${p.obj} up.`,
  manifestor: (p) => `A Human Design type built to initiate — ${p.subj} ${p.subj === "you" ? "act" : "acts"} first and ${p.subj === "you" ? "inform" : "informs"} others, rather than waiting to respond.`,
};

// Every archetype's description (archetypeMatrix.ts) is written in second
// person — this mirrors it for the same reason as TRAIT_DESCRIPTION_THIRD
// above, keyed by the archetype's name since that's what the graph node
// carries (there's no bucket-key id on ArchetypeNode to key off instead).
const ARCHETYPE_DESCRIPTION_THIRD: Record<string, (p: PronounSet) => string> = {
  "The Quiet Craftsman": (p) =>
    `${p.Subj} ${p.subj === "you" ? "work" : "works"} best alone, in the moment, on things ${p.subj} can hold to ${p.poss} own standard rather than anyone else's.`,
  "The Independent Tinkerer": (p) =>
    `${p.Subj} ${p.subj === "you" ? "chase" : "chases"} ideas on ${p.poss} own terms, happiest improvising ${p.poss} way through something new without an audience.`,
  "The Steady Confidant": (p) =>
    `People trust ${p.obj} precisely because ${p.contractIs} low-key and consistent — present for them without needing the spotlight.`,
  "The Gentle Wanderer": (p) =>
    `${p.Subj} ${p.subj === "you" ? "drift" : "drifts"} toward new people and new ideas at ${p.poss} own quiet pace, curious more than restless.`,
  "The Precise Architect": (p) =>
    `${p.Subj} ${p.subj === "you" ? "build" : "builds"} things carefully and alone, trusting a well-made plan over improvisation or outside input.`,
  "The Methodical Innovator": (p) =>
    `${p.Subj} ${p.subj === "you" ? "bring" : "brings"} new ideas to life through discipline, not spontaneity — structure is what lets ${p.obj} go somewhere genuinely new.`,
  "The Devoted Caretaker": (p) =>
    `${p.Subj} ${p.subj === "you" ? "show" : "shows"} up reliably for the people close to ${p.obj}, preferring dependable routines over grand gestures.`,
  "The Thoughtful Visionary": (p) =>
    `${p.Subj} quietly ${p.subj === "you" ? "plan" : "plans"} for people and ideas that don't exist yet, thinking ahead more than ${p.subj} ${p.subj === "you" ? "talk" : "talks"} ahead.`,
  "The Bold Doer": (p) =>
    `${p.Would} rather act on something real right now than plan or discuss it — momentum is how ${p.subj} ${p.subj === "you" ? "think" : "thinks"}.`,
  "The Restless Pioneer": (p) =>
    `${p.ContractIs} pulled toward whatever's newest and most alive, moving fast and figuring out the plan later.`,
  "The Grounded Connector": (p) =>
    `${p.Subj} ${p.subj === "you" ? "bring" : "brings"} people together around what's real and immediate, energized by others without needing a script.`,
  "The Spontaneous Catalyst": (p) =>
    `${p.Subj} ${p.subj === "you" ? "spark" : "sparks"} energy in a room and ${p.subj === "you" ? "chase" : "chases"} what's new in the same breath, rarely the same way twice.`,
  "The Driven Organizer": (p) =>
    `${p.Subj} ${p.subj === "you" ? "turn" : "turns"} plans into results through sheer forward motion, most comfortable when there's a clear structure to push against.`,
  "The Strategic Trailblazer": (p) =>
    `${p.Subj} ${p.subj === "you" ? "chase" : "chases"} bold new directions but ${p.subj === "you" ? "back" : "backs"} them with real planning, treating vision and structure as partners, not opposites.`,
  "The Reliable Host": (p) =>
    `${p.Subj} ${p.subj === "you" ? "keep" : "keeps"} people and plans running smoothly at once, dependable in a way that makes everyone else's life easier.`,
  "The Inspiring Ringleader": (p) =>
    `${p.Subj} ${p.subj === "you" ? "rally" : "rallies"} people around big new ideas and actually ${p.subj === "you" ? "organize" : "organizes"} the follow-through, equal parts visionary and planner.`,
};

/** Plain-English explanation of a specific node, for the click-to-explain panel. */
export function getGraphNodeExplanation(node: GraphNode, subject: Subject = "you"): string {
  const n = node as Record<string, unknown>;
  switch (n.kind) {
    case "archetype": {
      if (subject === "you") return String(n.description ?? "");
      const label = String(n.label ?? "");
      const thirdPerson = ARCHETYPE_DESCRIPTION_THIRD[label];
      return thirdPerson ? thirdPerson(pronounsFor(subject)) : String(n.description ?? "");
    }
    case "axis": {
      const left = String(n.leftPole ?? "");
      const right = String(n.rightPole ?? "");
      const selfSentence = String(n.sentence ?? "");
      const sentence = axisSentenceFor(n.id as AxisId, String(n.tierLabel ?? ""), subject, selfSentence);
      return `Measures ${left} vs. ${right}. ${sentence}`;
    }
    case "trait": {
      const traitId = String(n.id ?? "");
      const description =
        subject === "you"
          ? String(n.description ?? "")
          : (TRAIT_DESCRIPTION_THIRD[traitId]?.(pronounsFor(subject)) ?? String(n.description ?? ""));
      let youText = "";
      if (typeof n.score === "number") {
        youText = bigFiveText(traitId, n.score, subject);
      } else if (typeof n.pole === "string" && typeof n.confidence === "number") {
        youText = mbtiText(n.pole, n.confidence, subject);
      }
      return youText ? `${description} ${youText}` : description;
    }
    case "question": {
      // Question nodes only exist when raw in-progress answers are cached
      // locally (see personalityResultsToGraphData) — that's never true for
      // a famous person's editorial profile, so this is unreachable with a
      // non-"you" subject in practice, but keep the pronoun right anyway.
      const prompt = String(n.prompt ?? "");
      const answer = n.answer;
      const answerText = Array.isArray(answer) ? answer.join(" > ") : String(answer);
      const p = pronounsFor(subject);
      return `"${prompt}" — ${p.poss} answer: ${answerText}`;
    }
    default:
      return "";
  }
}

// Which framework a node belongs to, for clustering same-source nodes
// together — a trait and any raw answers behind it share a cluster key so
// the layout visibly groups "everything that came from 16 Personalities"
// instead of leaving that relationship to chance physics. Axis and
// archetype nodes span multiple frameworks by nature, so they sit outside
// any single cluster — exactly where they belong, since they're the shared
// ground between clusters, not part of one.
export function getGraphNodeCluster(node: GraphNode): string | undefined {
  const n = node as Record<string, unknown>;
  if (n.kind === "trait" || n.kind === "question") {
    return typeof n.framework === "string" ? n.framework : undefined;
  }
  return undefined;
}

// Real hex approximations of each framework's existing accent color (see
// ASSESSMENT_THEME in lib/personality/theme.ts) — canvas gradients need
// actual color strings, not Tailwind classes, but keeping the same hues
// means a framework reads as "the same color" everywhere in the app.
const FRAMEWORK_GRADIENT: Record<string, [string, string]> = {
  mbti: ["#8b5cf6", "#3b82f6"], // violet -> blue
  bigfive: ["#10b981", "#06b6d4"], // emerald -> cyan
  humandesign: ["#d946ef", "#f43f5e"], // fuchsia -> rose
  colors: ["#ef4444", "#eab308"], // red -> yellow
};

// The 4 Color Types framework's traits *are* literal colors — use the real
// one (matching COLOR_THEME in lib/personality/theme.ts) instead of the
// generic "colors framework" gradient when we can.
const LITERAL_COLOR_GRADIENT: Record<string, [string, string]> = {
  red: ["#ef4444", "#e11d48"],
  blue: ["#3b82f6", "#4f46e5"],
  green: ["#10b981", "#16a34a"],
  yellow: ["#fbbf24", "#eab308"],
};

// Matches --spatial-glow / --spatial-glow-2, the app's signature gradient —
// already used for the axis position sliders in the Signal Matrix, so
// reusing it here ties the graph back to the same visual language.
const SPECTRUM_LEFT = "#6366f1";
const SPECTRUM_RIGHT = "#0d9488";

/**
 * Gradient stops for a clicked node's stroke — see GraphViewProps.getNodeGradient.
 * Each kind encodes a real fact about the node, not just a decorative accent:
 *  - axis: the app's two-tone spectrum gradient, but the color switch is
 *    shifted by the *actual score* — lean hard toward one pole and the
 *    stroke is mostly that pole's color, not an even 50/50 split.
 *  - trait/question: the color of whichever framework it came from (or,
 *    for a literal color-type trait like "red", that color itself).
 *  - archetype: every contributing framework's color in sequence — visually
 *    "this archetype is made of these frameworks."
 */
export function getGraphNodeGradient(node: GraphNode): Array<{ color: string; stop: number }> | null {
  const n = node as Record<string, unknown>;

  switch (n.kind) {
    case "axis": {
      const score = typeof n.score === "number" ? n.score : 0;
      // score -100 (fully leftPole) -> t=1 (left color dominates the
      // stroke); score +100 (fully rightPole) -> t=0.
      const t = Math.min(1, Math.max(0, (100 - score) / 200));
      const feather = 0.12;
      return [
        { color: SPECTRUM_LEFT, stop: 0 },
        { color: SPECTRUM_LEFT, stop: Math.max(0, t - feather) },
        { color: SPECTRUM_RIGHT, stop: Math.min(1, t + feather) },
        { color: SPECTRUM_RIGHT, stop: 1 },
      ];
    }

    case "trait": {
      const literal = typeof n.id === "string" ? LITERAL_COLOR_GRADIENT[n.id] : undefined;
      const gradient = literal ?? (typeof n.framework === "string" ? FRAMEWORK_GRADIENT[n.framework] : undefined);
      return gradient ? [{ color: gradient[0], stop: 0 }, { color: gradient[1], stop: 1 }] : null;
    }

    case "question": {
      const gradient = typeof n.framework === "string" ? FRAMEWORK_GRADIENT[n.framework] : undefined;
      return gradient ? [{ color: gradient[0], stop: 0 }, { color: gradient[1], stop: 1 }] : null;
    }

    case "archetype": {
      const frameworks = Array.isArray(n.frameworks) ? (n.frameworks as string[]) : [];
      const stops = frameworks
        .map((framework, i) => {
          const gradient = FRAMEWORK_GRADIENT[framework];
          if (!gradient) return null;
          const stop = frameworks.length === 1 ? 0 : i / (frameworks.length - 1);
          return { color: gradient[0], stop };
        })
        .filter((s): s is { color: string; stop: number } => s !== null);
      return stops.length >= 2 ? stops : null;
    }

    default:
      return null;
  }
}

// Each of the app's 4 spectrums gets its own quadrant (0 top-left, 1
// top-right, 2 bottom-left, 3 bottom-right) — matches the order they're
// generated in scoringMatrix.ts (energy, structure, people, novelty), just
// arranged so no two adjacent-feeling spectrums share an edge.
const AXIS_QUADRANT: Record<AxisId, number> = {
  energy: 0,
  novelty: 1,
  people: 2,
  structure: 3,
};

// Axis nodes carry their spectrum as their own id; trait and question nodes
// carry it as an explicit axisId (see personalityResultsToGraphData.ts).
// The archetype node returns undefined — it spans every spectrum, not just
// one, so it belongs in the shared center rather than any single quadrant.
export function getGraphNodeQuadrant(node: GraphNode): number | undefined {
  const n = node as Record<string, unknown>;
  if (n.kind === "axis") return AXIS_QUADRANT[n.id as AxisId];
  if (typeof n.axisId === "string") return AXIS_QUADRANT[n.axisId as AxisId];
  return undefined;
}

// Same spectrum names as scoringMatrix.ts's AXIS_DEFINITIONS — duplicated
// here (like RING_LABELS above) since this is presentation, not scoring.
const AXIS_LABEL: Record<AxisId, string> = {
  energy: "Inward / Outward Focus",
  novelty: "Openness to Novelty",
  people: "People Orientation",
  structure: "Structure & Pace",
};

const QUADRANT_AXIS = (Object.keys(AXIS_QUADRANT) as AxisId[]).reduce<Record<number, AxisId>>((acc, axisId) => {
  acc[AXIS_QUADRANT[axisId]] = axisId;
  return acc;
}, {});

/** The spectrum name to draw on the crosshair for a given quadrant index — see GraphViewProps.getQuadrantLabel. */
export function getGraphQuadrantLabel(quadrant: number): string {
  const axisId = QUADRANT_AXIS[quadrant];
  return axisId ? AXIS_LABEL[axisId] : "";
}

/**
 * How strongly a node's own data leans away from neutral, 0 (dead-even) to
 * 1 (fully leaning toward one pole) — see GraphViewProps.getNodeQuadrantPull.
 * Without this every trait in a quadrant sits at the same fixed distance
 * from center, so all four quadrants fan out into identical-looking
 * mirrored shapes regardless of what your actual scores are. Feeding real
 * score magnitude in here is what makes a strongly-leaning trait visibly
 * push out toward the edge while a near-toss-up trait stays close to the
 * middle, so the shape of each quadrant is a real (if rough) picture of how
 * decisively you land on the traits inside it.
 */
export function getGraphNodeQuadrantPull(node: GraphNode): number {
  const n = node as Record<string, unknown>;
  if (n.kind === "axis" && typeof n.score === "number") {
    // -100..100, neutral at 0.
    return Math.min(1, Math.abs(n.score) / 100);
  }
  if (n.kind === "trait") {
    if (typeof n.score === "number") {
      // Big Five: 0-100, neutral at 50.
      return Math.min(1, Math.abs(n.score - 50) / 50);
    }
    if (typeof n.confidence === "number") {
      // MBTI: 50-100 (a dead-even split between the pole's questions lands at 50).
      return Math.min(1, Math.max(0, (n.confidence - 50) / 50));
    }
    // Human Design type / color type — categorical, no numeric lean to scale by.
    return 1;
  }
  return 1;
}

export function getGraphNodeSize(node: GraphNode) {
  const kind = (node as Record<string, unknown>).kind;
  switch (kind) {
    case "archetype":
      return 10;
    case "axis":
      return 8;
    case "trait":
      return 5;
    case "question":
      return 3;
    default:
      return 4;
  }
}
