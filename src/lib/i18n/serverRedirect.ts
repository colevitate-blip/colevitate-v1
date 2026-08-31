import { getLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";

// /login lives outside the [locale] route tree (see src/app/login/page.tsx)
// and must never be locale-prefixed itself, but any in-app path we build at
// runtime (a `next=` redirect target, an id/code-resolved destination) is a
// locale-scoped page and needs the current locale applied explicitly — a
// bare path resolves to a mid-navigation redirect to the default locale
// (localePrefix: "always" in src/i18n/routing.ts), silently dropping a
// non-English visitor back into English.
export async function localizedPath(href: string): Promise<string> {
  const locale = await getLocale();
  return getPathname({ href, locale });
}

export async function loginRedirectTarget(next: string): Promise<string> {
  return `/login?next=${encodeURIComponent(await localizedPath(next))}`;
}
