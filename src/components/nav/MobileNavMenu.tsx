"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  ChevronRight,
  Compass,
  GitCompareArrows,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ColevitateMark } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { signOut } from "@/app/auth/actions";

/** sm:hidden hamburger menu — the inline pill row (rendered separately in the layout)
 * takes over at sm: and up, where there's room for full labels without a menu. Icons are
 * imported here rather than passed in as props: component references aren't serializable
 * across the server/client boundary, only the translated label strings are.
 *
 * Opens as a full-screen panel rather than a small anchored dropdown: the two call sites
 * (SiteHeader's fixed-height bar, the personality layout's variable-height floating card)
 * don't share a header height to dock a panel against, and a full-screen overlay carries
 * its own header row (brand mark + close button) so it doesn't need one.
 *
 * Portaled to document.body rather than rendered in place: both headers set
 * backdrop-blur-*, and backdrop-filter on an ancestor makes it the containing block for
 * `position: fixed` descendants — without the portal, "fixed inset-0" collapses to the
 * header's own (56px-ish) box instead of the viewport. */
export function MobileNavMenu({
  menuLabel,
  closeMenuLabel,
  discoverLabel,
  peopleLabel,
  typesLabel,
  learnLabel,
  teamsLabel,
  dashboardLabel,
  comparisonsLabel,
  settingsLabel,
  languageLabel,
}: {
  menuLabel: string;
  closeMenuLabel: string;
  discoverLabel: string;
  peopleLabel: string;
  typesLabel: string;
  learnLabel: string;
  teamsLabel: string;
  /** Account shortcuts (dashboard/comparisons/settings) that used to live as
   * always-visible icon buttons in the personality-app header's top bar —
   * pinned to the bottom of this panel instead so they land in the thumb's
   * natural reach zone rather than requiring a reach to the top of the
   * screen. Omitted entirely by the marketing/content SiteHeader, which
   * never showed those shortcuts on mobile in the first place. */
  dashboardLabel?: string;
  comparisonsLabel?: string;
  settingsLabel?: string;
  /** Same reasoning: only the personality-app header needs a mobile home for
   * language switching, since SiteHeader already hides it on mobile with no
   * replacement. */
  languageLabel?: string;
}) {
  // "closing" keeps the panel mounted for one more frame so its slide-out-to-right
  // animation (mirroring the slide-in it opened with) actually gets to play — a
  // plain boolean would unmount it the instant a link or the close button fires.
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const mounted = state !== "closed";
  const close = () => setState("closing");

  const t = useTranslations("chrome");
  const { user, authLoading, profileMeta } = useAuth();
  const pathname = usePathname();
  const displayName = profileMeta?.displayName || user?.email?.split("@")[0] || "Account";
  const avatarUrl = profileMeta?.avatarUrl;

  // Full-screen overlay would otherwise let the page scroll behind it.
  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  const items = [
    { href: "/discover" as const, label: discoverLabel, icon: Compass },
    { href: "/people" as const, label: peopleLabel, icon: Star },
    { href: "/types" as const, label: typesLabel, icon: LayoutGrid },
    { href: "/learn" as const, label: learnLabel, icon: BookOpen },
    { href: "/teams" as const, label: teamsLabel, icon: Users },
  ];

  const accountItems = [
    dashboardLabel ? { href: "/combined" as const, label: dashboardLabel, icon: LayoutDashboard } : null,
    comparisonsLabel ? { href: "/pair" as const, label: comparisonsLabel, icon: GitCompareArrows } : null,
    settingsLabel ? { href: "/settings" as const, label: settingsLabel, icon: Settings } : null,
  ].filter((item) => item !== null);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setState("open")}
        aria-expanded={mounted}
        aria-label={menuLabel}
        className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
      >
        <Menu className="size-4" />
      </button>

      {mounted
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <div
                className={
                  state === "closing"
                    ? "absolute inset-0 bg-background/70 backdrop-blur-sm animate-out fade-out-0 duration-300"
                    : "absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
                }
                aria-hidden
                onClick={close}
              />
              {/* Closing mirrors the opening slide-in — same distance, reverse
                  direction — and runs at the page transition's own duration
                  (globals.css, .page-exit-forward/.page-enter-forward) rather
                  than the snappier open, so the drawer's retreat and the page
                  push it hands off to read as one continuous motion instead
                  of the drawer visibly finishing before the page moves. */}
              <div
                onAnimationEnd={() => {
                  if (state === "closing") setState("closed");
                }}
                className={
                  state === "closing"
                    ? "absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l bg-card shadow-2xl animate-out slide-out-to-right fade-out-0 duration-300 ease-out"
                    : "absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l bg-card shadow-2xl animate-in slide-in-from-right duration-200 ease-out"
                }
              >
                <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
                  <div className="flex items-center gap-2">
                    <ColevitateMark className="size-6" />
                    <span className="text-sm font-semibold tracking-tight">{menuLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label={closeMenuLabel}
                    className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <item.icon className="size-4" />
                      </span>
                      {item.label}
                      <ChevronRight className="ml-auto size-4 text-muted-foreground/60" />
                    </Link>
                  ))}
                </nav>

                {/* Not inside the scrollable nav above (which grows via flex-1)
                    — this sits right after it, so it's pushed to the bottom
                    edge of the panel regardless of how many primary items
                    there are, landing in the thumb's natural reach zone
                    instead of requiring a stretch to the top of the screen.
                    Always rendered (not gated on accountItems/languageLabel
                    like the two blocks inside it) because the sign-in/sign-out
                    row below is relevant on every call site — SiteHeader's
                    menu has no account shortcuts or language switcher but
                    still needs somewhere to put auth now that AuthStatus
                    hides it below sm. */}
                <div className="shrink-0 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  {!authLoading ? (
                    <div className="mb-1">
                      {user ? (
                        <div className="flex items-center gap-2 rounded-xl px-3 py-2">
                          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={displayName}
                                className="size-8 shrink-0 rounded-full bg-muted object-cover"
                              />
                            ) : (
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                <User className="size-4" />
                              </span>
                            )}
                            <span className="truncate font-medium text-foreground">{displayName}</span>
                          </div>
                          <form action={signOut}>
                            <button
                              type="submit"
                              onClick={close}
                              className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <LogOut className="size-3.5" />
                              {t("signOut")}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <NextLink
                          href={`/login?next=${encodeURIComponent(pathname)}`}
                          onClick={close}
                          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] px-3 py-3 text-sm font-semibold text-[#05070f] shadow-[0_10px_24px_-8px_var(--hero-glow-1)]"
                        >
                          <LogIn className="size-4" />
                          {t("signIn")}
                        </NextLink>
                      )}
                    </div>
                  ) : null}
                  {accountItems.length > 0 ? (
                    <nav className="flex flex-col gap-1">
                      {accountItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <item.icon className="size-4" />
                          </span>
                          {item.label}
                          <ChevronRight className="ml-auto size-4 text-muted-foreground/60" />
                        </Link>
                      ))}
                    </nav>
                  ) : null}
                  {languageLabel ? (
                    <div className="mt-1 flex items-center justify-between gap-3 rounded-xl px-3 py-2">
                      <span className="text-sm font-medium text-muted-foreground">{languageLabel}</span>
                      <LanguageSwitcher />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
