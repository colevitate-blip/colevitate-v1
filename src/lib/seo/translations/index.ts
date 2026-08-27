import type { MbtiTranslationLocale, MbtiTypeTranslation, CombinationTranslation, PersonTranslation } from "./types";
import { MBTI_TRANSLATION_DE } from "./mbti.de";
import { MBTI_TRANSLATION_ES } from "./mbti.es";
import { MBTI_TRANSLATION_FR } from "./mbti.fr";
import { MBTI_TRANSLATION_ZH } from "./mbti.zh";
import { COLORS_TRANSLATION_DE } from "./colors.de";
import { COLORS_TRANSLATION_ES } from "./colors.es";
import { COLORS_TRANSLATION_FR } from "./colors.fr";
import { COLORS_TRANSLATION_ZH } from "./colors.zh";
import { HD_TRANSLATION_DE } from "./humandesign.de";
import { HD_TRANSLATION_ES } from "./humandesign.es";
import { HD_TRANSLATION_FR } from "./humandesign.fr";
import { HD_TRANSLATION_ZH } from "./humandesign.zh";
import { BIGFIVE_TRANSLATION_DE } from "./bigfive.de";
import { BIGFIVE_TRANSLATION_ES } from "./bigfive.es";
import { BIGFIVE_TRANSLATION_FR } from "./bigfive.fr";
import { BIGFIVE_TRANSLATION_ZH } from "./bigfive.zh";
import { COMBINATION_TRANSLATION_DE } from "./combinations.de";
import { COMBINATION_TRANSLATION_ES } from "./combinations.es";
import { COMBINATION_TRANSLATION_FR } from "./combinations.fr";
import { COMBINATION_TRANSLATION_ZH } from "./combinations.zh";
import { PERSON_TRANSLATION_DE } from "./people.de";
import { PERSON_TRANSLATION_ES } from "./people.es";
import { PERSON_TRANSLATION_FR } from "./people.fr";
import { PERSON_TRANSLATION_ZH } from "./people.zh";

export const MBTI_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, MbtiTypeTranslation>> = {
  de: MBTI_TRANSLATION_DE,
  es: MBTI_TRANSLATION_ES,
  fr: MBTI_TRANSLATION_FR,
  zh: MBTI_TRANSLATION_ZH,
};

export const COLORS_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, MbtiTypeTranslation>> = {
  de: COLORS_TRANSLATION_DE,
  es: COLORS_TRANSLATION_ES,
  fr: COLORS_TRANSLATION_FR,
  zh: COLORS_TRANSLATION_ZH,
};

export const HD_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, MbtiTypeTranslation>> = {
  de: HD_TRANSLATION_DE,
  es: HD_TRANSLATION_ES,
  fr: HD_TRANSLATION_FR,
  zh: HD_TRANSLATION_ZH,
};

export const BIGFIVE_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, MbtiTypeTranslation>> = {
  de: BIGFIVE_TRANSLATION_DE,
  es: BIGFIVE_TRANSLATION_ES,
  fr: BIGFIVE_TRANSLATION_FR,
  zh: BIGFIVE_TRANSLATION_ZH,
};

function lookup(
  table: Record<MbtiTranslationLocale, Record<string, MbtiTypeTranslation>>,
  code: string,
  locale: string
): MbtiTypeTranslation | undefined {
  return table[locale as MbtiTranslationLocale]?.[code];
}

export function getMbtiTranslation(code: string, locale: string): MbtiTypeTranslation | undefined {
  return lookup(MBTI_TRANSLATIONS, code, locale);
}

export function getColorsTranslation(code: string, locale: string): MbtiTypeTranslation | undefined {
  return lookup(COLORS_TRANSLATIONS, code, locale);
}

export function getHdTranslation(code: string, locale: string): MbtiTypeTranslation | undefined {
  return lookup(HD_TRANSLATIONS, code, locale);
}

export function getBigFiveTranslation(code: string, locale: string): MbtiTypeTranslation | undefined {
  return lookup(BIGFIVE_TRANSLATIONS, code, locale);
}

export const COMBINATION_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, CombinationTranslation>> = {
  de: COMBINATION_TRANSLATION_DE,
  es: COMBINATION_TRANSLATION_ES,
  fr: COMBINATION_TRANSLATION_FR,
  zh: COMBINATION_TRANSLATION_ZH,
};

export const PERSON_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, PersonTranslation>> = {
  de: PERSON_TRANSLATION_DE,
  es: PERSON_TRANSLATION_ES,
  fr: PERSON_TRANSLATION_FR,
  zh: PERSON_TRANSLATION_ZH,
};

export function getCombinationTranslation(slug: string, locale: string): CombinationTranslation | undefined {
  return COMBINATION_TRANSLATIONS[locale as MbtiTranslationLocale]?.[slug];
}

export function getPersonTranslation(slug: string, locale: string): PersonTranslation | undefined {
  return PERSON_TRANSLATIONS[locale as MbtiTranslationLocale]?.[slug];
}
