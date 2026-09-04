// Reconstructs a PersonalityResults/CombinedProfile shape from a famous
// person's editorial typings (famousPeopleContent.ts), so the person page
// can reuse the exact same axis-scoring, archetype, and graph components
// built for a real user's combined result — instead of a parallel,
// bespoke visualization.
//
// Editorial typings only ever record one code per framework (a whole MBTI
// type, a single dominant color, one standout Big Five trait) — not the
// graded, per-question scores a real assessment produces. The functions
// below assign a fixed, moderate confidence/magnitude to every stated
// trait so the shared components have something numeric to work with,
// without pretending to more precision than an editorial call actually has.
// Unmentioned Big Five traits default to neutral (50).

import type { BigFiveResult, ColorId, ColorResult, Dichotomy, MbtiLetter, MbtiResult, PersonalityResults } from "@/lib/personality/types";
import { generateCombinedProfile, type CombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import type { FamousPersonTyping } from "@/lib/seo/famousPeopleContent";

/** The only shape these derivations need — satisfied by both a roster FamousPersonContent and an ad-hoc AI-audit result (same typings shape, see audit-person/route.ts). */
export interface TypingsSource {
  typings: FamousPersonTyping[];
}

const MBTI_CONFIDENCE = 72;
const BIG_FIVE_TRAIT_MAGNITUDE = 32; // stated trait -> 82 (high) or 18 (low)
const MBTI_DICHOTOMIES: Dichotomy[] = ["EI", "SN", "TF", "JP"];

function mbtiResultFromCode(code: string): MbtiResult {
  const letters = code.toUpperCase().split("") as MbtiLetter[];
  const scores = {} as MbtiResult["scores"];
  MBTI_DICHOTOMIES.forEach((dichotomy, i) => {
    scores[dichotomy] = { pole: letters[i], confidence: MBTI_CONFIDENCE };
  });
  return { type: code.toUpperCase(), scores, completedAt: "" };
}

function colorResultFromCode(code: ColorId): ColorResult {
  const scores = { red: 10, blue: 10, green: 10, yellow: 10 } as Record<ColorId, number>;
  scores[code] = 70;
  return { scores, dominant: code, secondary: code, completedAt: "" };
}

function bigFiveResultFromCodes(codes: string[]): BigFiveResult {
  const scores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  for (const code of codes) {
    const [trait, level] = code.split("-") as [keyof typeof scores, "high" | "low"];
    scores[trait] = level === "high" ? 50 + BIG_FIVE_TRAIT_MAGNITUDE : 50 - BIG_FIVE_TRAIT_MAGNITUDE;
  }
  return { scores, completedAt: "" };
}

/** Human Design is never present for famous people — see famousPeopleContent.ts for why. */
export function deriveFamousPersonResults(content: TypingsSource): PersonalityResults {
  const results: PersonalityResults = {};

  const mbtiTyping = content.typings.find((t) => t.framework === "mbti");
  if (mbtiTyping) results.mbti = mbtiResultFromCode(mbtiTyping.code);

  const colorsTyping = content.typings.find((t) => t.framework === "colors");
  if (colorsTyping) results.colors = colorResultFromCode(colorsTyping.code as ColorId);

  const bigFiveCodes = content.typings.filter((t) => t.framework === "bigfive").map((t) => t.code);
  if (bigFiveCodes.length > 0) results.bigfive = bigFiveResultFromCodes(bigFiveCodes);

  return results;
}

export function deriveFamousPersonProfile(content: TypingsSource): CombinedProfile | null {
  return generateCombinedProfile(deriveFamousPersonResults(content));
}
