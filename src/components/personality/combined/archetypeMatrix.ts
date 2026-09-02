import type { AxisId, AxisScore } from "./scoringMatrix";

// Maps the four combined axes onto a small set of memorable archetypes.
// Each axis is reduced to a sign bucket (score >= 0 vs < 0), giving
// 2^4 = 16 combinations — enough to cover the meaningful shapes of the
// axis space without pretending to more precision than the underlying
// scoring matrix actually has.

export interface Archetype {
  name: string;
  description: string;
}

type Bucket = 0 | 1; // 0 = left pole, 1 = right pole

function bucket(axes: AxisScore[], id: AxisId): Bucket {
  const axis = axes.find((a) => a.id === id);
  return (axis?.score ?? 0) >= 0 ? 1 : 0;
}

// Key order matches AXES order: energy, structure, people, novelty.
// Letters denote the right-pole (1) side per axis: E=outward, P=planned,
// F=people-focused, X=exploratory. Left-pole (0) uses I, M, T, G.
const ARCHETYPES: Record<string, Archetype> = {
  IMTG: {
    name: "The Quiet Craftsman",
    description:
      "You work best alone, in the moment, on things you can hold to your own standard rather than anyone else's.",
  },
  IMTX: {
    name: "The Independent Tinkerer",
    description:
      "You chase ideas on your own terms, happiest improvising your way through something new without an audience.",
  },
  IMFG: {
    name: "The Steady Confidant",
    description:
      "People trust you precisely because you're low-key and consistent — present for them without needing the spotlight.",
  },
  IMFX: {
    name: "The Gentle Wanderer",
    description:
      "You drift toward new people and new ideas at your own quiet pace, curious more than restless.",
  },
  IPTG: {
    name: "The Precise Architect",
    description:
      "You build things carefully and alone, trusting a well-made plan over improvisation or outside input.",
  },
  IPTX: {
    name: "The Methodical Innovator",
    description:
      "You bring new ideas to life through discipline, not spontaneity — structure is what lets you go somewhere genuinely new.",
  },
  IPFG: {
    name: "The Devoted Caretaker",
    description:
      "You show up reliably for the people close to you, preferring dependable routines over grand gestures.",
  },
  IPFX: {
    name: "The Thoughtful Visionary",
    description:
      "You quietly plan for people and ideas that don't exist yet, thinking ahead more than you talk ahead.",
  },
  EMTG: {
    name: "The Bold Doer",
    description:
      "You'd rather act on something real right now than plan or discuss it — momentum is how you think.",
  },
  EMTX: {
    name: "The Restless Pioneer",
    description:
      "You're pulled toward whatever's newest and most alive, moving fast and figuring out the plan later.",
  },
  EMFG: {
    name: "The Grounded Connector",
    description:
      "You bring people together around what's real and immediate, energized by others without needing a script.",
  },
  EMFX: {
    name: "The Spontaneous Catalyst",
    description:
      "You spark energy in a room and chase what's new in the same breath, rarely the same way twice.",
  },
  EPTG: {
    name: "The Driven Organizer",
    description:
      "You turn plans into results through sheer forward motion, most comfortable when there's a clear structure to push against.",
  },
  EPTX: {
    name: "The Strategic Trailblazer",
    description:
      "You chase bold new directions but back them with real planning, treating vision and structure as partners, not opposites.",
  },
  EPFG: {
    name: "The Reliable Host",
    description:
      "You keep people and plans running smoothly at once, dependable in a way that makes everyone else's life easier.",
  },
  EPFX: {
    name: "The Inspiring Ringleader",
    description:
      "You rally people around big new ideas and actually organize the follow-through, equal parts visionary and planner.",
  },
};

// Exported so other combined-profile content (e.g. career suggestions) can
// key off the same 16 buckets without recomputing the sign logic.
export function getArchetypeKey(axes: AxisScore[]): string | null {
  if (axes.length === 0) return null;
  return (
    (bucket(axes, "energy") ? "E" : "I") +
    (bucket(axes, "structure") ? "P" : "M") +
    (bucket(axes, "people") ? "F" : "T") +
    (bucket(axes, "novelty") ? "X" : "G")
  );
}

export function getArchetype(axes: AxisScore[]): Archetype | null {
  const key = getArchetypeKey(axes);
  return key ? (ARCHETYPES[key] ?? null) : null;
}

/** Looks up an archetype directly by its 4-letter bucket key (e.g. from a client that already has the key, like the daily-type-content route validating an incoming request). */
export function getArchetypeByKey(key: string): Archetype | null {
  return ARCHETYPES[key] ?? null;
}
