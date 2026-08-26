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
