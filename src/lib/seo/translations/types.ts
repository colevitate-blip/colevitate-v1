// Real (human-quality, not machine-translated placeholder) translations for
// type-page content — Tier 4.3 of IMPROVEMENT_PROMPTS.md, phase 1: the 16
// MBTI type pages only, into de/es/fr/zh. See mbti.<locale>.ts for the
// actual content and typeContent.ts for how this gets applied.
export interface MbtiTypeTranslation {
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string[];
  careers: string[];
  relationships: string;
}

export type MbtiTranslationLocale = "de" | "es" | "fr" | "zh";

// Tier 4.3 phase 3: combination pages (81) and people-profile pages (34).
// Combination pages have no fixed "code" to key off of (see combinationContent.ts)
// so translations are keyed by the page's own `slug`.
export interface CombinationTranslation {
  headline: string;
  summary: string;
  reinforcements: string[];
  contrasts: string[];
}

// People-profile pages: `bio` is the person's own summary; `rationales` covers
// each typing's rationale text, keyed by `${framework}-${code}` (e.g.
// "mbti-INTJ") since a person's typings array varies in length and order
// shouldn't be relied on. A person/locale entry may omit a key if untranslated
// (falls back to English for just that rationale).
export interface PersonTranslation {
  bio: string;
  rationales: Partial<Record<string, string>>;
}
