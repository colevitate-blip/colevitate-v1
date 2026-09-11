import type { AssessmentId, PersonalityResults } from "@/lib/personality/types";
import { MBTI_CONTENT } from "@/components/personality/mbti/content";
import { getTopTraits, levelFor, TRAIT_LEVELS, summarizeBigFiveTranslated } from "@/components/personality/bigfive/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { computeScoringMatrix, type AxisScore, type Translator } from "./scoringMatrix";
import { getArchetype, type Archetype } from "./archetypeMatrix";

export interface CombinedThread {
  id: AssessmentId;
  label: string;
  code: string;
  name: string;
  tagline: string;
  strengths: string[];
  growth: string[];
}

export interface CombinedProfile {
  headline: string;
  subtitle: string;
  /** e.g. "Built from 3 of 4 lenses — 16 Personalities, Big Five, Human Design" — the per-framework
   *  identity, demoted to a caption now that the header leads with the archetype instead. */
  sourcesLine: string;
  narrative: string[];
  threads: CombinedThread[];
  strengths: string[];
  growth: string[];
  axes: AxisScore[];
  archetype: Archetype | null;
}

// Which shared-growth-edge theme (growth.themes.<key> for display) a
// framework's growth text matches, by English keyword — matching always
// runs against the static English source content (MBTI_CONTENT, HD_CONTENT,
// COLOR_CONTENT, bigfive's TRAIT_LEVELS below), never the translated
// display text, so it works identically regardless of the active locale.
const GROWTH_THEME_KEYWORDS: { themeKey: string; keywords: string[] }[] = [
  { themeKey: "conflict", keywords: ["conflict"] },
  { themeKey: "perfectionism", keywords: ["perfection"] },
  { themeKey: "followThrough", keywords: ["follow-through", "follow through", "routine"] },
  { themeKey: "personalizesFeedback", keywords: ["criticism", "personally"] },
  { themeKey: "overcommitment", keywords: ["overcommit", "over-give", "own needs"] },
  { themeKey: "energyManagement", keywords: ["energy", "drain", "recovery"] },
];

export function findSharedGrowthTheme(englishGrowth: Map<AssessmentId, string[]>): { themeKey: string; ids: AssessmentId[] } | null {
  for (const { themeKey, keywords } of GROWTH_THEME_KEYWORDS) {
    const matches: AssessmentId[] = [];
    for (const [id, texts] of englishGrowth) {
      if (texts.some((g) => keywords.some((k) => g.toLowerCase().includes(k)))) matches.push(id);
    }
    if (matches.length >= 2) return { themeKey, ids: matches };
  }
  return null;
}

export function generateCombinedProfile(results: PersonalityResults, t: Translator, locale: string): CombinedProfile | null {
  const threads: CombinedThread[] = [];
  // English-only growth text per framework, used solely to detect a shared
  // growth theme (see findSharedGrowthTheme) — kept separate from the
  // translated `growth` field threads carry for display.
  const englishGrowth = new Map<AssessmentId, string[]>();

  if (results.mbti) {
    const type = results.mbti.type;
    const c = MBTI_CONTENT[type];
    threads.push({
      id: "mbti",
      label: ASSESSMENT_CATALOG.mbti.label,
      code: c.code,
      name: t(`mbti.types.${type}.name`),
      tagline: t(`mbti.types.${type}.tagline`),
      strengths: [0, 1, 2, 3].map((i) => t(`mbti.types.${type}.strengths.${i}`)),
      growth: [0, 1, 2].map((i) => t(`mbti.types.${type}.growth.${i}`)),
    });
    englishGrowth.set("mbti", c.growth);
  }
  if (results.bigfive) {
    const s = summarizeBigFiveTranslated(results.bigfive, t);
    threads.push({
      id: "bigfive",
      label: ASSESSMENT_CATALOG.bigfive.label,
      code: s.code,
      name: s.name,
      tagline: s.tagline,
      strengths: s.strengths,
      growth: s.growth,
    });
    const top = getTopTraits(results.bigfive);
    englishGrowth.set("bigfive", top.map((trait) => TRAIT_LEVELS[trait][levelFor(results.bigfive!, trait)].growth));
  }
  if (results.humandesign) {
    const type = results.humandesign.type;
    const c = HD_CONTENT[type];
    threads.push({
      id: "humandesign",
      label: ASSESSMENT_CATALOG.humandesign.label,
      code: c.code,
      name: t(`humandesign.types.${type}.name`),
      tagline: t(`humandesign.types.${type}.tagline`),
      strengths: [0, 1, 2, 3].map((i) => t(`humandesign.types.${type}.strengths.${i}`)),
      growth: [0, 1, 2].map((i) => t(`humandesign.types.${type}.growth.${i}`)),
    });
    englishGrowth.set("humandesign", c.growth);
  }
  if (results.colors) {
    const dominant = results.colors.dominant;
    const c = COLOR_CONTENT[dominant];
    threads.push({
      id: "colors",
      label: ASSESSMENT_CATALOG.colors.label,
      code: dominant.slice(0, 1).toUpperCase(),
      name: t(`colors.types.${dominant}.name`),
      tagline: t(`colors.types.${dominant}.tagline`),
      strengths: [0, 1, 2, 3].map((i) => t(`colors.types.${dominant}.strengths.${i}`)),
      growth: [0, 1, 2].map((i) => t(`colors.types.${dominant}.growth.${i}`)),
    });
    englishGrowth.set("colors", c.growth);
  }

  if (threads.length < 2) return null;

  const listFormat = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });

  const headline = threads.map((th) => th.name).join(" · ");
  const subtitle = t("combined.narrative.subtitle", { count: threads.length });
  const sourcesLine = t("combined.narrative.sourcesLine", {
    count: threads.length,
    list: listFormat.format(threads.map((th) => th.label)),
  });

  const openingClauses = threads.map((th) => {
    switch (th.id) {
      case "mbti":
        return t("combined.narrative.openingClause.mbti", { name: th.name, code: th.code });
      case "bigfive":
        return t("combined.narrative.openingClause.bigfive", { name: th.name });
      case "humandesign":
        return t("combined.narrative.openingClause.humandesign", {
          name: th.name,
          strategy: t(`humandesign.types.${results.humandesign!.type}.strategy`).toLowerCase().replace(/\.$/, ""),
        });
      case "colors":
        return t("combined.narrative.openingClause.colors", { name: th.name.split("—")[0].trim() });
      default:
        return "";
    }
  });

  const opening = t("combined.narrative.opening", { clauses: listFormat.format(openingClauses.filter(Boolean)) });

  const paragraphs = [opening];

  // The scoring matrix combines every completed framework's values, per
  // axis, into a single weighted composite (see scoringMatrix.ts). Lead
  // the narrative with whichever axis has the strongest signal — that's
  // the most defining, best-corroborated trait across your results.
  const axes = computeScoringMatrix(results, t);
  const strongestAxis = [...axes].sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];
  if (strongestAxis) {
    paragraphs.push(strongestAxis.sentence);
  }

  const sharedGrowth = findSharedGrowthTheme(englishGrowth);
  if (sharedGrowth) {
    const labels = sharedGrowth.ids.map((id) => threads.find((th) => th.id === id)!.label);
    paragraphs.push(
      t("combined.narrative.sharedGrowth", {
        labels: listFormat.format(labels),
        theme: t(`growth.themes.${sharedGrowth.themeKey}`),
      })
    );
  }

  const strengths = dedupeTop(threads.flatMap((th) => th.strengths.slice(0, 1)), 4);
  const growth = dedupeTop(threads.flatMap((th) => th.growth.slice(0, 1)), 4);
  const archetype = getArchetype(axes, t);

  return { headline, subtitle, sourcesLine, narrative: paragraphs, threads, strengths, growth, axes, archetype };
}

function dedupeTop(items: string[], max: number) {
  return Array.from(new Set(items)).slice(0, max);
}
