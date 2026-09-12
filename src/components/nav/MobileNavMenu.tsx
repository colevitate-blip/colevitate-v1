"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  ChevronRight,
  Compass,
  GitCompareArrows,
  LayoutDashboard,
  LayoutGrid,
  Menu,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ColevitateMark } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/language-switcher";

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
  const [open, setOpen] = useState(false);

  // Full-screen overlay would otherwise let the page scroll behind it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={menuLabel}
        className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
      >
        <Menu className="size-4" />
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
                aria-hidden
                onClick={() => setOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l bg-card shadow-2xl animate-in slide-in-from-right duration-200 ease-out">
                <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
                  <div className="flex items-center gap-2">
                    <ColevitateMark className="size-6" />
                    <span className="text-sm font-semibold tracking-tight">{menuLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
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
                      onClick={() => setOpen(false)}
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
                    instead of requiring a stretch to the top of the screen. */}
                {accountItems.length > 0 || languageLabel ? (
                  <div className="shrink-0 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    {accountItems.length > 0 ? (
                      <nav className="flex flex-col gap-1">
                        {accountItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
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
                ) : null}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
