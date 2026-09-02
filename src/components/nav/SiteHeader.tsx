import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ColevitateMark } from "@/components/brand/Logo";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNavMenu } from "@/components/nav/MobileNavMenu";

const NAV_LINK_CLASS = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

/** Slim single-row top nav for content/marketing pages (/people, /types,
 * /for-teams, ...) that sit outside the (personality) route group and its
 * big hero-style header — those pages need real navigation too, just without
 * the tall centered brand block that only makes sense on the quiz pages. */
export async function SiteHeader() {
  const t = await getTranslations("chrome");

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <ColevitateMark className="size-6" />
          <span className="text-sm font-semibold tracking-tight">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/discover" className={NAV_LINK_CLASS}>
            {t("discoverLink")}
          </Link>
          <Link href="/people" className={NAV_LINK_CLASS}>
            {t("peopleLink")}
          </Link>
          <Link href="/types" className={NAV_LINK_CLASS}>
            {t("typesLink")}
          </Link>
          <Link href="/teams" className={NAV_LINK_CLASS}>
            {t("teamsLink")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <MobileNavMenu
            menuLabel={t("menuLabel")}
            discoverLabel={t("discoverLink")}
            peopleLabel={t("peopleLink")}
            typesLabel={t("typesLink")}
            teamsLabel={t("teamsLink")}
          />
          <AuthStatus compact />
        </div>
      </div>
    </header>
  );
}
