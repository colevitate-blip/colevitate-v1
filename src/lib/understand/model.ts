// The "Understand" decoder model: a pre-built, weighted matrix that turns
// "who said it, where, and how" into ranked readings of what a sentence most
// likely means. Deliberately probabilistic — it never returns one verdict,
// always 2-3 readings with a share, the drivers behind the top one, and a
// question to check it with. People beat averages: when the user knows how
// the other person individually comes across, that input outweighs any
// group tendency (culture, gender) the model carries.
//
// Text lives in messages/<locale>/understand.json; this file only holds ids
// and numbers, the same split scoringMatrix.ts uses for the personality axes.

import type { AxisId } from "@/lib/personality/types";
import { PHRASES, type Phrase, type Reading } from "./phrases";

/* ------------------------------------------------------------------ */
/* Communication dimensions                                            */
/* ------------------------------------------------------------------ */

/** Seven communication dimensions, each -1 (left pole) .. +1 (right pole).
 * Adapted from Hall's high/low-context model and Erin Meyer's Culture Map
 * scales (communicating, evaluating, disagreeing, trusting, leading,
 * scheduling), plus emotional expressiveness. */
export const DIMENSIONS = ["context", "feedback", "confront", "trust", "hierarchy", "time", "expressive"] as const;
export type DimensionId = (typeof DIMENSIONS)[number];
export type StyleVector = Record<DimensionId, number>;

export const ZERO_STYLE: StyleVector = {
  context: 0,
  feedback: 0,
  confront: 0,
  trust: 0,
  hierarchy: 0,
  time: 0,
  expressive: 0,
};

/* ------------------------------------------------------------------ */
/* Culture clusters                                                    */
/* ------------------------------------------------------------------ */

// Approximate positions of each cluster's *workplace norm* on the seven
// dimensions. These are population-level tendencies drawn from published
// cross-cultural research, not facts about any individual — a direct person
// from Japan or a very indirect person from the Netherlands is common.
// Signs: context  -1 low-context (explicit) .. +1 high-context (implied)
//        feedback -1 direct negative feedback .. +1 indirect
//        confront -1 open debate is fine .. +1 avoids open disagreement
//        trust    -1 task-based .. +1 relationship-based
//        hierarchy -1 egalitarian .. +1 hierarchical
//        time     -1 linear/punctual .. +1 flexible
//        expressive -1 emotionally reserved .. +1 expressive
export const CULTURE_IDS = [
  "de",
  "nl",
  "nordic",
  "uk",
  "us",
  "anz",
  "fr",
  "southEu",
  "eastEu",
  "israel",
  "turkey",
  "arab",
  "india",
  "china",
  "japan",
  "korea",
  "latam",
  "africa",
] as const;
export type CultureId = (typeof CULTURE_IDS)[number];

export const CULTURE_STYLE: Record<CultureId, StyleVector> = {
  de: { context: -0.8, feedback: -0.7, confront: -0.6, trust: -0.6, hierarchy: 0.0, time: -0.8, expressive: -0.4 },
  nl: { context: -0.8, feedback: -0.9, confront: -0.7, trust: -0.5, hierarchy: -0.8, time: -0.6, expressive: -0.3 },
  nordic: { context: -0.6, feedback: 0.0, confront: 0.4, trust: -0.5, hierarchy: -0.9, time: -0.6, expressive: -0.6 },
  uk: { context: -0.2, feedback: 0.4, confront: 0.2, trust: -0.4, hierarchy: -0.3, time: -0.5, expressive: -0.5 },
  us: { context: -0.9, feedback: -0.1, confront: -0.2, trust: -0.8, hierarchy: -0.4, time: -0.6, expressive: 0.4 },
  anz: { context: -0.7, feedback: -0.3, confront: -0.2, trust: -0.3, hierarchy: -0.8, time: -0.3, expressive: 0.0 },
  fr: { context: 0.2, feedback: -0.4, confront: -0.6, trust: 0.2, hierarchy: 0.4, time: 0.1, expressive: 0.3 },
  southEu: { context: 0.3, feedback: -0.1, confront: -0.3, trust: 0.6, hierarchy: 0.4, time: 0.5, expressive: 0.8 },
  eastEu: { context: 0.2, feedback: -0.7, confront: -0.4, trust: 0.4, hierarchy: 0.7, time: 0.3, expressive: 0.1 },
  israel: { context: -0.4, feedback: -0.8, confront: -0.9, trust: 0.0, hierarchy: -0.9, time: 0.3, expressive: 0.6 },
  turkey: { context: 0.5, feedback: 0.3, confront: 0.2, trust: 0.7, hierarchy: 0.7, time: 0.6, expressive: 0.6 },
  arab: { context: 0.7, feedback: 0.6, confront: 0.2, trust: 0.8, hierarchy: 0.8, time: 0.7, expressive: 0.7 },
  india: { context: 0.7, feedback: 0.6, confront: 0.5, trust: 0.7, hierarchy: 0.8, time: 0.8, expressive: 0.4 },
  china: { context: 0.8, feedback: 0.8, confront: 0.8, trust: 0.8, hierarchy: 0.8, time: 0.5, expressive: -0.4 },
  japan: { context: 1.0, feedback: 0.9, confront: 0.9, trust: 0.5, hierarchy: 0.8, time: -0.7, expressive: -0.8 },
  korea: { context: 0.8, feedback: 0.7, confront: 0.7, trust: 0.7, hierarchy: 0.9, time: 0.1, expressive: -0.1 },
  latam: { context: 0.5, feedback: 0.5, confront: 0.4, trust: 0.8, hierarchy: 0.6, time: 0.7, expressive: 0.8 },
  africa: { context: 0.6, feedback: 0.5, confront: 0.5, trust: 0.8, hierarchy: 0.7, time: 0.7, expressive: 0.5 },
};

/* ------------------------------------------------------------------ */
/* Gender                                                              */
/* ------------------------------------------------------------------ */

export type Gender = "woman" | "man" | "unspecified";

// Average gender differences in communication style are real but small
// (most meta-analytic effect sizes sit around d = 0.1-0.3, and they shrink
// further once role and status are held constant). They're kept small here
// on purpose, and weighted lower than culture or the individual. The larger,
// better-documented gender effects are about *reception* — e.g. women's
// direct speech at work being judged more harshly, which makes hedging a
// strategy rather than uncertainty — and those live as reading-level
// weights ("womanAtWork"), not as a shift in style.
const GENDER_STYLE: Record<Exclude<Gender, "unspecified">, Partial<StyleVector>> = {
  woman: { feedback: 0.25, trust: 0.25, expressive: 0.25, confront: 0.15 },
  man: { feedback: -0.25, trust: -0.25, expressive: -0.25, confront: -0.15 },
};

/* ------------------------------------------------------------------ */
/* Individual style (Colevitate's four axes)                           */
/* ------------------------------------------------------------------ */

/** -1..1 per axis; 0 = unknown. Maps onto the same four axes as the combined
 * personality profile so a user's own profile can be dropped straight in. */
export type IndividualStyle = Record<AxisId, number>;
export const UNKNOWN_INDIVIDUAL: IndividualStyle = { energy: 0, structure: 0, people: 0, novelty: 0 };

function individualToStyle(ind: IndividualStyle): StyleVector {
  const { energy: e, structure: s, people: p, novelty: n } = ind;
  return {
    // Outward people say more out loud and imply less.
    context: -0.3 * e,
    // People-focused people soften criticism more; task-focused people say it straight.
    feedback: 0.5 * p,
    confront: 0.4 * p - 0.2 * n,
    trust: 0.8 * p,
    hierarchy: -0.2 * n,
    time: -0.8 * s,
    expressive: 0.8 * e,
  };
}

export function isIndividualKnown(ind: IndividualStyle): boolean {
  return Object.values(ind).some((v) => v !== 0);
}

/** Converts combined-profile axis scores (-100..100) into an IndividualStyle. */
export function individualFromAxisScores(scores: { id: AxisId; score: number }[]): IndividualStyle {
  const out: IndividualStyle = { ...UNKNOWN_INDIVIDUAL };
  for (const s of scores) out[s.id] = Math.max(-1, Math.min(1, s.score / 100));
  return out;
}

/* ------------------------------------------------------------------ */
/* Blending sources                                                    */
/* ------------------------------------------------------------------ */

export type SourceId = "culture" | "individual" | "gender";

// Fixed (not renormalized) source weights: a missing source contributes a
// neutral 0 instead of letting the remaining sources grow to fill the gap —
// otherwise "gender only" would inflate gender to 100% of the reading.
function sourceWeights(individualKnown: boolean): Record<SourceId, number> {
  return individualKnown
    ? { culture: 0.45, individual: 0.45, gender: 0.1 }
    : { culture: 0.8, individual: 0, gender: 0.2 };
}

export interface PersonInput {
  culture: CultureId | null;
  gender: Gender;
  individual: IndividualStyle;
}

interface BlendedStyle {
  style: StyleVector;
  /** Each source's weighted share of every dimension, for the "why" breakdown. */
  parts: Record<SourceId, StyleVector>;
}

function blend(person: PersonInput): BlendedStyle {
  const w = sourceWeights(isIndividualKnown(person.individual));
  const culture = person.culture ? CULTURE_STYLE[person.culture] : ZERO_STYLE;
  const individual = individualToStyle(person.individual);
  const gender = person.gender === "unspecified" ? {} : GENDER_STYLE[person.gender];

  const parts: Record<SourceId, StyleVector> = {
    culture: { ...ZERO_STYLE },
    individual: { ...ZERO_STYLE },
    gender: { ...ZERO_STYLE },
  };
  const style: StyleVector = { ...ZERO_STYLE };
  for (const d of DIMENSIONS) {
    parts.culture[d] = w.culture * culture[d];
    parts.individual[d] = w.individual * individual[d];
    parts.gender[d] = w.gender * (gender[d] ?? 0);
    style[d] = parts.culture[d] + parts.individual[d] + parts.gender[d];
  }
  return { style, parts };
}

/* ------------------------------------------------------------------ */
/* Situation                                                           */
/* ------------------------------------------------------------------ */

export type Setting = "work" | "private";
export const WORK_RELATIONS = ["senior", "peer", "junior", "client"] as const;
export const PRIVATE_RELATIONS = ["partner", "family", "friend", "newContact"] as const;
export type Relation = (typeof WORK_RELATIONS)[number] | (typeof PRIVATE_RELATIONS)[number];
export const CUES = ["public", "written", "curt", "delayed", "repeated", "warm"] as const;
export type Cue = (typeof CUES)[number];

export interface Situation {
  setting: Setting;
  /** Relative to the user: "senior" = they are above you, "junior" = they report to you. */
  relation: Relation | null;
  cues: Cue[];
}

/** Every input a reading can weight. Dimension features are the speaker's blended style. */
export type FeatureId =
  | DimensionId
  | "work"
  | "speakerSenior"
  | "speakerJunior"
  | "client"
  | "partner"
  | "family"
  | "friend"
  | "newContact"
  | Cue
  | "juniorDeference"
  | "woman"
  | "man"
  | "womanAtWork";

type FeatureGroup = "style" | "situation" | "cue" | "gender";
function featureGroup(f: FeatureId): FeatureGroup {
  if ((DIMENSIONS as readonly string[]).includes(f)) return "style";
  if ((CUES as readonly string[]).includes(f)) return "cue";
  if (f === "woman" || f === "man" || f === "womanAtWork") return "gender";
  return "situation";
}

function situationFeatures(sit: Situation, speaker: StyleVector, gender: Gender): Partial<Record<FeatureId, number>> {
  const f: Partial<Record<FeatureId, number>> = {};
  f.work = sit.setting === "work" ? 1 : 0;
  const rel = sit.relation;
  if (rel === "senior") f.speakerSenior = 1;
  if (rel === "junior") f.speakerJunior = 1;
  if (rel === "client") f.client = 1;
  if (rel === "partner" || rel === "family" || rel === "friend" || rel === "newContact") f[rel] = 1;
  for (const c of sit.cues) f[c] = 1;
  // Someone below you in a hierarchical norm is the classic "yes means I heard you" case.
  f.juniorDeference = rel === "junior" || rel === "newContact" ? Math.max(0, speaker.hierarchy) : 0;
  if (gender === "woman") {
    f.woman = 1;
    f.womanAtWork = f.work;
  }
  if (gender === "man") f.man = 1;
  return f;
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

const TEMPERATURE = 1.6;
// Blend a little uniform probability back in so no reading ever shows as 0%
// or ~100%: the model works on averages, and a person can always be the
// exception. With 3 readings this caps any reading at ~91% and floors it at ~4%.
const HUMILITY = 0.12;

export type DriverKind =
  | { kind: "style"; source: SourceId; dimension: DimensionId; pole: "left" | "right" }
  | { kind: "situation" | "cue" | "gender"; feature: FeatureId };

export interface Driver {
  key: string;
  info: DriverKind;
  /** How much this factor pushed the top reading ahead of the others (logit units). */
  amount: number;
}

export interface ReadingResult {
  id: string;
  probability: number; // 0..1
}

export interface DecodeResult {
  phraseId: string;
  readings: ReadingResult[];
  drivers: Driver[];
  confidence: "low" | "medium" | "high";
  /** Set when the listener's own norms would pick a different top reading. */
  ownFilterReading: string | null;
}

function logits(readings: Reading[], features: Partial<Record<FeatureId, number>>): number[] {
  return readings.map((r) => {
    let z = r.prior ?? 0;
    for (const [f, w] of Object.entries(r.weights) as [FeatureId, number][]) {
      z += w * (features[f] ?? 0);
    }
    return z;
  });
}

function softmax(zs: number[]): number[] {
  const m = Math.max(...zs);
  const ex = zs.map((z) => Math.exp((z - m) * TEMPERATURE));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => (1 - HUMILITY) * (e / sum) + HUMILITY / zs.length);
}

function rank(phrase: Phrase, features: Partial<Record<FeatureId, number>>) {
  const probs = softmax(logits(phrase.readings, features));
  return phrase.readings
    .map((r, i) => ({ id: r.id, probability: probs[i], reading: r }))
    .sort((a, b) => b.probability - a.probability);
}

function computeDrivers(
  phrase: Phrase,
  topId: string,
  features: Partial<Record<FeatureId, number>>,
  parts: Record<SourceId, StyleVector>
): Driver[] {
  const top = phrase.readings.find((r) => r.id === topId)!;
  const others = phrase.readings.filter((r) => r.id !== topId);
  const edge = (f: FeatureId) => {
    const mean = others.reduce((s, r) => s + (r.weights[f] ?? 0), 0) / Math.max(1, others.length);
    return (top.weights[f] ?? 0) - mean;
  };

  const drivers: Driver[] = [];
  const allFeatures = new Set<FeatureId>();
  for (const r of phrase.readings) for (const f of Object.keys(r.weights) as FeatureId[]) allFeatures.add(f);

  for (const f of allFeatures) {
    const e = edge(f);
    if (e === 0) continue;
    const group = featureGroup(f);
    if (group === "style") {
      const d = f as DimensionId;
      for (const source of ["culture", "individual", "gender"] as SourceId[]) {
        const v = parts[source][d];
        const amount = e * v;
        if (amount > 0.04) {
          drivers.push({
            key: `${source}-${d}`,
            info: { kind: "style", source, dimension: d, pole: v < 0 ? "left" : "right" },
            amount,
          });
        }
      }
    } else {
      const amount = e * (features[f] ?? 0);
      if (amount > 0.04) drivers.push({ key: f, info: { kind: group, feature: f }, amount });
    }
  }
  return drivers.sort((a, b) => b.amount - a.amount).slice(0, 4);
}

export interface DecodeInput {
  phraseId: string;
  speaker: PersonInput;
  listener: PersonInput;
  situation: Situation;
}

export function decode(input: DecodeInput): DecodeResult | null {
  const phrase = PHRASES.find((p) => p.id === input.phraseId);
  if (!phrase) return null;

  const speaker = blend(input.speaker);
  const features = { ...speaker.style, ...situationFeatures(input.situation, speaker.style, input.speaker.gender) };
  const ranked = rank(phrase, features);
  const top = ranked[0];

  // Same sentence, same situation — but read through the listener's own norms.
  // If that lands on a different top reading, the user's instinct is likely to
  // misfire here, which is the single most useful thing to flag.
  let ownFilterReading: string | null = null;
  const listenerKnown = input.listener.culture !== null || isIndividualKnown(input.listener.individual);
  if (listenerKnown) {
    const listener = blend({ ...input.listener, gender: "unspecified" });
    const ownFeatures = { ...listener.style, ...situationFeatures(input.situation, listener.style, "unspecified") };
    const ownTop = rank(phrase, ownFeatures)[0];
    if (ownTop.id !== top.id) ownFilterReading = ownTop.id;
  }

  // Confidence = how much we know x how clearly one reading wins.
  const info =
    0.2 +
    (input.speaker.culture ? 0.25 : 0) +
    (isIndividualKnown(input.speaker.individual) ? 0.3 : 0) +
    (input.situation.relation ? 0.1 : 0) +
    (input.situation.cues.length > 0 ? 0.15 : 0);
  const margin = top.probability - (ranked[1]?.probability ?? 0);
  const score = info * (0.4 + margin);
  const confidence = score >= 0.5 ? "high" : score >= 0.3 ? "medium" : "low";

  return {
    phraseId: phrase.id,
    readings: ranked.map(({ id, probability }) => ({ id, probability })),
    drivers: computeDrivers(phrase, top.id, features, speaker.parts),
    confidence,
    ownFilterReading,
  };
}
