import type { AxisId, AxisScore, Translator } from "./scoringMatrix";

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
// This registry is the key set (and the English fallback content, via
// archetypes.json's en file) — display strings are always looked up
// through `t`, never read from here directly.
export const ARCHETYPE_KEYS = [
  "IMTG", "IMTX", "IMFG", "IMFX",
  "IPTG", "IPTX", "IPFG", "IPFX",
  "EMTG", "EMTX", "EMFG", "EMFX",
  "EPTG", "EPTX", "EPFG", "EPFX",
] as const;

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

export function getArchetype(axes: AxisScore[], t: Translator): Archetype | null {
  const key = getArchetypeKey(axes);
  return key ? getArchetypeByKey(key, t) : null;
}

/** Looks up an archetype directly by its 4-letter bucket key (e.g. from a client that already has the key, like the daily-type-content route validating an incoming request). */
export function getArchetypeByKey(key: string, t: Translator): Archetype | null {
  if (!(ARCHETYPE_KEYS as readonly string[]).includes(key)) return null;
  return { name: t(`archetypes.${key}.name`), description: t(`archetypes.${key}.description`) };
}
