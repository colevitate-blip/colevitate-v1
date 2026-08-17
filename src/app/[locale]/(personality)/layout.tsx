import type { Metadata } from "next";
import type { ReactNode } from "react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { PersonalityProvider } from "@/lib/personality/context";
import { Link } from "@/i18n/navigation";
import { ColevitateMark } from "@/components/brand/Logo";
import { AuthProvider } from "@/lib/supabase/AuthProvider";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

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
            <div className="relative flex flex-col items-center rounded-2xl border bg-card/60 px-4 py-5 text-center backdrop-blur-md sm:py-6">
              <div className="absolute right-3 top-3 flex items-center gap-2 sm:right-4 sm:top-4">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
                />
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                <AuthStatus />
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
