import type { MbtiTranslationLocale, MbtiTypeTranslation } from "./types";
import { MBTI_TRANSLATION_DE } from "./mbti.de";
import { MBTI_TRANSLATION_ES } from "./mbti.es";
import { MBTI_TRANSLATION_FR } from "./mbti.fr";
import { MBTI_TRANSLATION_ZH } from "./mbti.zh";

export const MBTI_TRANSLATIONS: Record<MbtiTranslationLocale, Record<string, MbtiTypeTranslation>> = {
  de: MBTI_TRANSLATION_DE,
  es: MBTI_TRANSLATION_ES,
  fr: MBTI_TRANSLATION_FR,
  zh: MBTI_TRANSLATION_ZH,
};

export function getMbtiTranslation(code: string, locale: string): MbtiTypeTranslation | undefined {
  return MBTI_TRANSLATIONS[locale as MbtiTranslationLocale]?.[code];
}
