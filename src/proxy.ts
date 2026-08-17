import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

// Flat static slugs under src/app/[locale]/(personality)/** ("" = the landing page).
// Everything else (/login, /auth/**, /experiments/**) stays outside locale routing.
const PERSONALITY_SLUGS = new Set(["", "big-five", "colors", "combined", "human-design", "mbti", "settings"]);

function isPersonalityPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const rest = (routing.locales as readonly string[]).includes(maybeLocale) ? segments.slice(1) : segments;
  const path = rest.join("/");
  // Allow dynamic user share paths under /u/*
  if (rest[0] === "u") return true;
  return PERSONALITY_SLUGS.has(path);
}

export function proxy(request: NextRequest) {
  if (isPersonalityPath(request.nextUrl.pathname)) {
    const intlResponse = intlMiddleware(request);
    return updateSession(request, intlResponse);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
