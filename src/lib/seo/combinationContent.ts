// Combination pages are Colevitate's actual differentiator over
// single-framework sites — this is a *seed set* proving the pipeline
// (routing, static generation, structured data, sitemap) end to end with a
// handful of real, carefully-written pairings. The brief calls for the top
// 50-100 combinations by search volume; picking those requires real keyword
// research (Search Console / a keyword tool) that isn't available in this
// environment, so this list is illustrative, not the final prioritized set.
// Expand `COMBINATIONS` once that research exists — everything downstream
// (routes, sitemap, generateStaticParams) reads from this list automatically.

import type { AssessmentId } from "@/lib/personality/types";
import { getTypeContent, FRAMEWORK_URL_SLUGS } from "./typeContent";

export interface TypeRef {
  framework: AssessmentId;
  code: string;
}

export interface CombinationPageContent {
  slug: string;
  a: TypeRef;
  b: TypeRef;
  headline: string;
  summary: string;
  reinforcements: string[];
  contrasts: string[];
}

export const COMBINATIONS: CombinationPageContent[] = [
  {
    slug: "infj-and-high-openness",
    a: { framework: "mbti", code: "INFJ" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "INFJ + High Openness: Insight Meets Imagination",
    summary:
      "INFJ already leans toward seeing the meaning behind a situation before others do. Paired with a high Openness score, that instinct extends outward into a genuine pull toward novel ideas, art, and unconventional thinking — not just reading people accurately, but reading whole situations for what's possible, not only what's proven.",
    reinforcements: [
      "Both signals point toward abstract, pattern-first thinking rather than starting from concrete detail",
      "High Openness reinforces INFJ's tendency to connect a specific decision to a larger, less obvious meaning",
      "Together they suggest someone who gets restless inside purely conventional, by-the-book environments",
    ],
    contrasts: [
      "INFJ's insight is usually anchored to a firm internal value system; high Openness pulls toward exploring ideas even when they haven't been value-tested yet — that tension can show up as feeling torn between staying principled and staying curious",
    ],
  },
  {
    slug: "human-design-projector-and-infp",
    a: { framework: "humandesign", code: "projector" },
    b: { framework: "mbti", code: "INFP" },
    headline: "Human Design Projector + INFP: Quiet Depth, Waiting to Be Seen",
    summary:
      "Projector energy is built to see systems and people clearly from the outside, with guidance that lands best when it's invited rather than volunteered. INFP is guided by a private, values-driven sense of what's true and meaningful, and would rather show what it means than argue the case. Both types carry real depth that doesn't announce itself — it has to be noticed.",
    reinforcements: [
      "Neither type is built around constant self-promotion or forcing output to prove worth",
      "Both do their best work with focus and space, rather than under external pressure to constantly produce",
      "Each reads people and underlying dynamics with more accuracy than they typically get credit for",
    ],
    contrasts: [
      "Projector's strategy is explicitly about waiting for outside recognition and invitation, while INFP tends to be self-contained and doesn't need external validation to feel its values are true — one type's growth edge (needing to be seen) can sit awkwardly next to the other's instinct (not needing to perform)",
    ],
  },
  {
    slug: "entj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ENTJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ENTJ + High Conscientiousness: Speed Meets Discipline",
    summary:
      "ENTJ turns ambiguity into a plan and moves on it fast. High Conscientiousness adds real staying power to that — the discipline to follow the plan through to the unglamorous finish, not just call the shot. Together they point toward someone who both decides quickly and actually delivers.",
    reinforcements: [
      "Both traits favor clear structure and forward momentum over open-ended exploration",
      "High Conscientiousness reinforces ENTJ's natural tendency to hold people (including themselves) accountable to what was agreed",
      "Each independently produces someone who's genuinely reliable under a deadline, not just decisive in the moment",
    ],
    contrasts: [
      "ENTJ's bias is toward speed and treating setbacks as data to move past quickly; high Conscientiousness's perfectionist streak can pull the other way, slowing things down to get every detail right — worth watching for tension between shipping fast and shipping thorough",
    ],
  },
  {
    slug: "green-and-enfj",
    a: { framework: "colors", code: "green" },
    b: { framework: "mbti", code: "ENFJ" },
    headline: "Green + ENFJ: Steady Support Meets Active Guidance",
    summary:
      "Green energy is motivated by connection and stability — a calm, dependable presence a team can lean on. ENFJ reads a room and actively works to bring out the best in the people in it, often through a clearly articulated shared vision. Both are people-first, but one leads by steadiness and the other by active mobilization.",
    reinforcements: [
      "Both prioritize the wellbeing of the people around them over pure task efficiency",
      "Each builds trust quickly and is the person others bring problems to",
      "Both find real satisfaction in group harmony and cooperative outcomes",
    ],
    contrasts: [
      "Green tends to support quietly and prefers a steady pace; ENFJ is more likely to step forward and actively push a group toward a vision — one instinct is to hold space, the other is to lead it, and knowing which mode you're in can matter in group settings",
    ],
  },
];

export function getAllCombinationSlugs(): string[] {
  return COMBINATIONS.map((c) => c.slug);
}

export function getCombinationContent(slug: string): CombinationPageContent | null {
  return COMBINATIONS.find((c) => c.slug === slug) ?? null;
}

/** Combinations that feature a given type — used for "related pages" internal linking from a single-type page. */
export function getCombinationsForType(framework: AssessmentId, code: string): CombinationPageContent[] {
  return COMBINATIONS.filter(
    (c) =>
      (c.a.framework === framework && c.a.code.toLowerCase() === code.toLowerCase()) ||
      (c.b.framework === framework && c.b.code.toLowerCase() === code.toLowerCase())
  );
}

/** Resolves a TypeRef's own content + URL, for rendering a link/card to it from a combination page. */
export function resolveTypeRef(ref: TypeRef) {
  const content = getTypeContent(FRAMEWORK_URL_SLUGS[ref.framework], ref.code.toLowerCase());
  return content;
}
