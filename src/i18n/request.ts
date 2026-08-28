import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

async function loadMessages(locale: string) {
  const [common, mbti, discovery] = await Promise.all([
    import(`../messages/${locale}/common.json`).then((m) => m.default),
    import(`../messages/${locale}/mbti.json`).then((m) => m.default),
    import(`../messages/${locale}/discovery.json`).then((m) => m.default),
  ]);
  return { ...common, mbti, discovery };
}

// Deep-merges `overrides` onto `base`, keeping base values for any key the
// override doesn't define — this is how a locale that only has partial
// translations (e.g. during the phased rollout, or for namespaces outside
// phase 1 scope) still falls back to English instead of throwing/missing text.
function deepMerge(base: unknown, overrides: unknown): unknown {
  if (
    typeof base === "object" &&
    base !== null &&
    !Array.isArray(base) &&
    typeof overrides === "object" &&
    overrides !== null &&
    !Array.isArray(overrides)
  ) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(overrides as Record<string, unknown>)) {
      result[key] = deepMerge(
        (base as Record<string, unknown>)[key],
        (overrides as Record<string, unknown>)[key]
      );
    }
    return result;
  }
  return overrides ?? base;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const englishMessages = locale === routing.defaultLocale ? null : await loadMessages(routing.defaultLocale);
  const localeMessages = await loadMessages(locale);
  const messages = englishMessages ? deepMerge(englishMessages, localeMessages) : localeMessages;

  return {
    locale,
    messages: messages as Record<string, unknown>,
  };
});
