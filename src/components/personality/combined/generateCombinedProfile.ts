import type { AssessmentId, PersonalityResults } from "@/lib/personality/types";
import { MBTI_CONTENT } from "@/components/personality/mbti/content";
import { summarizeBigFive } from "@/components/personality/bigfive/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { computeScoringMatrix, type AxisScore } from "./scoringMatrix";
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
  narrative: string[];
  threads: CombinedThread[];
  strengths: string[];
  growth: string[];
  axes: AxisScore[];
  archetype: Archetype | null;
}

const GROWTH_THEMES: { theme: string; keywords: string[] }[] = [
  { theme: "avoiding necessary conflict", keywords: ["conflict"] },
  { theme: "letting perfectionism slow you down", keywords: ["perfection"] },
  { theme: "follow-through on the unglamorous parts of a plan", keywords: ["follow-through", "follow through", "routine"] },
  { theme: "taking feedback more personally than intended", keywords: ["criticism", "personally"] },
  { theme: "overcommitting to other people's needs", keywords: ["overcommit", "over-give", "own needs"] },
  { theme: "energy management", keywords: ["energy", "drain", "recovery"] },
];

export function findSharedGrowthTheme(threads: CombinedThread[]): { theme: string; ids: AssessmentId[] } | null {
  for (const { theme, keywords } of GROWTH_THEMES) {
    const matches = threads.filter((t) =>
      t.growth.some((g) => keywords.some((k) => g.toLowerCase().includes(k)))
    );
    if (matches.length >= 2) {
      return { theme, ids: matches.map((m) => m.id) };
    }
  }
  return null;
}

export function generateCombinedProfile(results: PersonalityResults): CombinedProfile | null {
  const threads: CombinedThread[] = [];

  if (results.mbti) {
    const c = MBTI_CONTENT[results.mbti.type];
    threads.push({
      id: "mbti",
      label: ASSESSMENT_CATALOG.mbti.label,
      code: c.code,
      name: c.name,
      tagline: c.tagline,
      strengths: c.strengths,
      growth: c.growth,
    });
  }
  if (results.bigfive) {
    const s = summarizeBigFive(results.bigfive);
    threads.push({
      id: "bigfive",
      label: ASSESSMENT_CATALOG.bigfive.label,
      code: s.code,
      name: s.name,
      tagline: s.tagline,
      strengths: s.strengths,
      growth: s.growth,
    });
  }
  if (results.humandesign) {
    const c = HD_CONTENT[results.humandesign.type];
    threads.push({
      id: "humandesign",
      label: ASSESSMENT_CATALOG.humandesign.label,
      code: c.code,
      name: c.name,
      tagline: c.tagline,
      strengths: c.strengths,
      growth: c.growth,
    });
  }
  if (results.colors) {
    const c = COLOR_CONTENT[results.colors.dominant];
    threads.push({
      id: "colors",
      label: ASSESSMENT_CATALOG.colors.label,
      code: results.colors.dominant.slice(0, 1).toUpperCase(),
      name: c.name,
      tagline: c.tagline,
      strengths: c.strengths,
      growth: c.growth,
    });
  }

  if (threads.length < 2) return null;

  const headline = threads.map((t) => t.name.replace(/^The /, "")).join(" · ");
  const subtitle = `Woven from ${threads.length} of 4 assessments`;

  const openingClauses = threads.map((t) => {
    switch (t.id) {
      case "mbti":
        return `show up as ${t.name} (${t.code})`;
      case "bigfive":
        return `carry ${t.name}'s temperament in day-to-day behavior`;
      case "humandesign":
        return `run on ${t.name} energy, built to ${HD_CONTENT[results.humandesign!.type].strategy.toLowerCase().replace(/\.$/, "")}`;
      case "colors":
        return `lead with ${t.name.split("—")[0].trim()} energy in how you operate with other people`;
      default:
        return "";
    }
  });

  const opening = `Put together, you ${joinClauses(openingClauses)}.`;

  const paragraphs = [opening];

  // The scoring matrix combines every completed framework's values, per
  // axis, into a single weighted composite (see scoringMatrix.ts). Lead
  // the narrative with whichever axis has the strongest signal — that's
  // the most defining, best-corroborated trait across your results.
  const axes = computeScoringMatrix(results);
  const strongestAxis = [...axes].sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];
  if (strongestAxis) {
    paragraphs.push(strongestAxis.sentence);
  }

  const sharedGrowth = findSharedGrowthTheme(threads);
  if (sharedGrowth) {
    const labels = sharedGrowth.ids.map((id) => threads.find((t) => t.id === id)!.label);
    paragraphs.push(
      `Across ${labels.join(" and ")}, the same growth edge keeps surfacing: ${sharedGrowth.theme}. When two independent frameworks point at the same thing, it's usually the highest-leverage place to focus.`
    );
  }

  const strengths = dedupeTop(threads.flatMap((t) => t.strengths.slice(0, 1)), 4);
  const growth = dedupeTop(threads.flatMap((t) => t.growth.slice(0, 1)), 4);
  const archetype = getArchetype(axes);

  return { headline, subtitle, narrative: paragraphs, threads, strengths, growth, axes, archetype };
}

function joinClauses(clauses: string[]) {
  const filtered = clauses.filter(Boolean);
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(", ")}, and ${filtered[filtered.length - 1]}`;
}

function dedupeTop(items: string[], max: number) {
  return Array.from(new Set(items)).slice(0, max);
}
