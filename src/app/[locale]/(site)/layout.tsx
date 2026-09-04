import type { ReactNode } from "react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { AuthProvider } from "@/lib/supabase/AuthProvider";
import { PersonalityProvider } from "@/lib/personality/context";
import { SiteHeader } from "@/components/nav/SiteHeader";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("chrome");

  return (
    <AuthProvider>
      <PersonalityProvider>
        <div className="min-h-[100dvh] bg-background">
          <SiteHeader />
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
