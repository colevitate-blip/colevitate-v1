import type { Metadata } from "next";
import type { ReactNode } from "react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { PersonalityProvider } from "@/lib/personality/context";
import { Link } from "@/i18n/navigation";
import { Compass, LayoutGrid, Star, Users } from "lucide-react";
import { ColevitateMark } from "@/components/brand/Logo";
import { AuthProvider } from "@/lib/supabase/AuthProvider";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNavMenu } from "@/components/nav/MobileNavMenu";

const NAV_LINK_CLASS =
  "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground";

export const metadata: Metadata = {
  title: "Colevitate — Personality Studio",
  description:
    "Colevitate combines 16 Personalities, Big Five, Human Design, and 4 Color Type assessments into one personality profile.",
  openGraph: {
    siteName: "Colevitate",
    title: "Colevitate — Personality Studio",
    description:
      "Colevitate combines 16 Personalities, Big Five, Human Design, and 4 Color Type assessments into one personality profile.",
  },
};

export default async function PersonalityLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("chrome");

  return (
    <AuthProvider>
      <PersonalityProvider>
        <div className="relative min-h-[100dvh] overflow-x-hidden bg-background">
          <div aria-hidden className="spatial-grid-bg" />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--hero-glow-1),transparent),radial-gradient(ellipse_60%_50%_at_100%_0%,var(--hero-glow-2),transparent)]"
          />
          <header className="sticky top-2 z-20 mx-auto mb-2 w-full max-w-6xl px-3 sm:top-4 sm:px-4">
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card/60 px-4 py-4 text-center backdrop-blur-md sm:gap-4 sm:py-5">
              {/* Real flow (not absolute) so this row wraps instead of overlapping the
                  brand block below on narrow screens — it grows over time (auth state
                  plus a handful of nav pills) and absolute positioning had no way to
                  reserve space for that growth. */}
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <AuthStatus />
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span
                    aria-hidden
                    className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
                  />
                  {/* sm: and up — full-label pills, room for all three */}
                  <div className="hidden items-center gap-2 sm:flex">
                    <Link href="/discover" className={NAV_LINK_CLASS}>
                      <Compass className="size-3.5" />
                      {t("discoverLink")}
                    </Link>
                    <Link href="/people" className={NAV_LINK_CLASS}>
                      <Star className="size-3.5" />
                      {t("peopleLink")}
                    </Link>
                    <Link href="/types" className={NAV_LINK_CLASS}>
                      <LayoutGrid className="size-3.5" />
                      {t("typesLink")}
                    </Link>
                    <Link href="/teams" className={NAV_LINK_CLASS}>
                      <Users className="size-3.5" />
                      {t("teamsLink")}
                    </Link>
                  </div>
                  <LanguageSwitcher />
                  <ThemeToggle />
                  {/* Below sm: the three links above collapse into this menu instead of
                      shrinking to unlabeled icons — that's what made "People" easy to miss. */}
                  <MobileNavMenu
                    menuLabel={t("menuLabel")}
                    discoverLabel={t("discoverLink")}
                    peopleLabel={t("peopleLink")}
                    typesLabel={t("typesLink")}
                    teamsLabel={t("teamsLink")}
                  />
                </div>
              </div>
              <Link href="/" className="flex flex-col items-center gap-2">
                <ColevitateMark className="size-12 shrink-0 sm:size-14" />
                <span className="leading-tight">
                  <span className="block text-xl font-bold tracking-tight sm:text-2xl">{t("brand")}</span>
                  <span className="block text-xs text-muted-foreground sm:text-sm">{t("tagline")}</span>
                </span>
              </Link>
            </div>
          </header>
          {children}
          <footer className="mx-auto mt-16 flex w-full max-w-6xl flex-col items-center gap-3 px-4 pb-10 text-center text-xs text-muted-foreground">
            <p>{t("footerTagline")}</p>
            <div className="flex gap-4">
              <NextLink href="/privacy" className="hover:text-foreground hover:underline">
                Privacy Policy
              </NextLink>
              <NextLink href="/terms" className="hover:text-foreground hover:underline">
                Terms of Service
              </NextLink>
            </div>
          </footer>
        </div>
      </PersonalityProvider>
    </AuthProvider>
  );
}
