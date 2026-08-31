import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "zh", "fr", "de"],
  defaultLocale: "en",
  // "always" (not "as-needed"): English must carry an explicit /en prefix too, so
  // every locale's content lives at its own URL. With "as-needed" the English pages
  // were unprefixed, meaning the SAME url ("/", "/mbti", ...) could render different
  // languages depending on the NEXT_LOCALE cookie alone — any URL-keyed cache (Next's
  // client router cache, browser back/forward cache, a CDN) could then replay one
  // locale's snapshot for another, which is what caused the language to randomly
  // revert to English on back-navigation and after the Google OAuth round trip.
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
