// Adapts the app's existing per-type content (already written for the
// interactive quiz results) into static pages addressable by URL, for SEO.
// No new copy is invented here for description/strengths/challenges — it's
// the same text the results screens already show. `careers` and
// `relationships` are placeholders: nothing in the codebase has this content
// yet, and it shouldn't be fabricated, so pages render an honest "coming
// soon" for those sections until real copy is written. `famousExamples` is
// populated from src/lib/seo/famousPeopleContent.ts (Tier 0 of
// IMPROVEMENT_PROMPTS.md) — every entry there is itself sourced, editorial
// typing, not fabricated.

import type { AssessmentId, ColorId, HumanDesignType } from "@/lib/personality/types";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { MBTI_CONTENT } from "@/components/personality/mbti/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";
import { TRAIT_LABEL, TRAIT_LEVELS, ARCHETYPE_NOUN } from "@/components/personality/bigfive/content";
import type { BigFiveTrait } from "@/components/personality/bigfive/questions";
import { getFamousPeopleByTyping } from "./famousPeopleContent";

export interface TypePageContent {
  framework: AssessmentId;
  frameworkLabel: string;
  frameworkUrlSlug: string;
  /** The internal code (e.g. "INFJ", "generator", "openness-high") — used to look content back up. */
  code: string;
  /** URL-safe version of code (lowercase). */
  slug: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string[];
  /** Placeholder — see file header. Empty until real content exists. */
  careers: string[];
  /** Placeholder — see file header. Empty until real content exists. */
  relationships: string;
  /** A person's display name plus the slug of their /people/[slug] profile page. */
  famousExamples: FamousExampleRef[];
}

export interface FamousExampleRef {
  name: string;
  slug: string;
}

function famousExamplesFor(framework: AssessmentId, code: string): FamousExampleRef[] {
  return getFamousPeopleByTyping(framework, code).map((p) => ({ name: p.name, slug: p.slug }));
}

// URL uses the same slugs as the existing quiz routes (/mbti, /big-five, ...)
// so a visitor moving from a type page into the quiz sees a consistent URL
// scheme, not two different naming conventions for the same framework.
export const FRAMEWORK_URL_SLUGS: Record<AssessmentId, string> = {
  mbti: ASSESSMENT_CATALOG.mbti.slug,
  bigfive: ASSESSMENT_CATALOG.bigfive.slug,
  humandesign: ASSESSMENT_CATALOG.humandesign.slug,
  colors: ASSESSMENT_CATALOG.colors.slug,
};

const URL_SLUG_TO_FRAMEWORK: Record<string, AssessmentId> = Object.fromEntries(
  (Object.entries(FRAMEWORK_URL_SLUGS) as [AssessmentId, string][]).map(([id, slug]) => [slug, id])
);

const BIG_FIVE_TRAITS: BigFiveTrait[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
const BIG_FIVE_LEVELS = ["high", "low"] as const;

function mbtiContent(code: string): TypePageContent | null {
  const c = MBTI_CONTENT[code];
  if (!c) return null;
  return {
    framework: "mbti",
    frameworkLabel: ASSESSMENT_CATALOG.mbti.label,
    frameworkUrlSlug: FRAMEWORK_URL_SLUGS.mbti,
    code: c.code,
    slug: c.code.toLowerCase(),
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    strengths: c.strengths,
    challenges: c.growth,
    careers: [],
    relationships: "",
    famousExamples: famousExamplesFor("mbti", c.code),
  };
}

function humanDesignContent(code: string): TypePageContent | null {
  const c = HD_CONTENT[code as HumanDesignType];
  if (!c) return null;
  return {
    framework: "humandesign",
    frameworkLabel: ASSESSMENT_CATALOG.humandesign.label,
    frameworkUrlSlug: FRAMEWORK_URL_SLUGS.humandesign,
    code,
    slug: code,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    strengths: c.strengths,
    challenges: c.growth,
    careers: [],
    relationships: "",
    famousExamples: famousExamplesFor("humandesign", code),
  };
}

function colorsContent(code: string): TypePageContent | null {
  const c = COLOR_CONTENT[code as ColorId];
  if (!c) return null;
  return {
    framework: "colors",
    frameworkLabel: ASSESSMENT_CATALOG.colors.label,
    frameworkUrlSlug: FRAMEWORK_URL_SLUGS.colors,
    code,
    slug: code,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    strengths: c.strengths,
    challenges: c.growth,
    careers: [],
    relationships: "",
    famousExamples: famousExamplesFor("colors", code),
  };
}

// Big Five has no fixed "types" — results are continuous per trait. For
// static, crawlable pages we cover each trait at its high and low pole
// (5 traits × 2 = 10 pages), reusing the same level copy the dynamic
// results summary (summarizeBigFive) draws from.
function bigFiveContent(code: string): TypePageContent | null {
  const [trait, level] = code.split("-") as [BigFiveTrait, "high" | "low"];
  if (!BIG_FIVE_TRAITS.includes(trait) || !BIG_FIVE_LEVELS.includes(level)) return null;
  const data = TRAIT_LEVELS[trait][level];
  const traitLabel = TRAIT_LABEL[trait];
  const poleLabel = level === "high" ? "High" : "Low";
  return {
    framework: "bigfive",
    frameworkLabel: ASSESSMENT_CATALOG.bigfive.label,
    frameworkUrlSlug: FRAMEWORK_URL_SLUGS.bigfive,
    code,
    slug: code,
    name: `${poleLabel} ${traitLabel} — The ${ARCHETYPE_NOUN[trait][level]}`,
    tagline: `${traitLabel} · ${poleLabel} scorer`,
    description: data.blurb,
    strengths: [data.strength],
    challenges: [data.growth],
    careers: [],
    relationships: "",
    famousExamples: famousExamplesFor("bigfive", code),
  };
}

const CONTENT_BY_FRAMEWORK: Record<AssessmentId, (code: string) => TypePageContent | null> = {
  mbti: mbtiContent,
  humandesign: humanDesignContent,
  colors: colorsContent,
  bigfive: bigFiveContent,
};

/** All valid (code) values for a framework, in a stable order — drives generateStaticParams and the sitemap. */
export function getAllCodesForFramework(framework: AssessmentId): string[] {
  switch (framework) {
    case "mbti":
      return Object.keys(MBTI_CONTENT);
    case "humandesign":
      return Object.keys(HD_CONTENT);
    case "colors":
      return Object.keys(COLOR_CONTENT);
    case "bigfive":
      return BIG_FIVE_TRAITS.flatMap((trait) => BIG_FIVE_LEVELS.map((level) => `${trait}-${level}`));
  }
}

/** Every {frameworkUrlSlug, slug} pair that should get a static page — the flat list generateStaticParams/sitemap.ts iterate over. */
export function getAllTypePageParams(): Array<{ frameworkUrlSlug: string; slug: string }> {
  return (Object.keys(FRAMEWORK_URL_SLUGS) as AssessmentId[]).flatMap((framework) =>
    getAllCodesForFramework(framework).map((code) => ({
      frameworkUrlSlug: FRAMEWORK_URL_SLUGS[framework],
      slug: CONTENT_BY_FRAMEWORK[framework](code)!.slug,
    }))
  );
}

/** Looks up a type page by its URL segments. Returns null on an unknown framework slug or type slug (→ the route calls notFound()). */
export function getTypeContent(frameworkUrlSlug: string, slug: string): TypePageContent | null {
  const framework = URL_SLUG_TO_FRAMEWORK[frameworkUrlSlug];
  if (!framework) return null;

  // mbti/humandesign/colors codes are stored uppercase-or-as-is; slugs are
  // always lowercase, so try the slug as-is first, then its uppercase form.
  const resolve = CONTENT_BY_FRAMEWORK[framework];
  return resolve(slug) ?? resolve(slug.toUpperCase()) ?? null;
}
