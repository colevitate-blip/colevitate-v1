"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { GitCompareArrows, LayoutDashboard, LogIn, LogOut, Settings, User, Users } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { signOut } from "@/app/auth/actions";

export function AuthStatus({ compact = false }: { compact?: boolean } = {}) {
  const { user, authLoading, profileMeta } = useAuth();
  const t = useTranslations("chrome");
  // next/navigation's usePathname (not @/i18n/navigation's, which strips the
  // locale segment) — this feeds `next=` below, and /login isn't part of
  // locale routing, so the redirect target must keep its locale prefix.
  const pathname = usePathname();

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">{t("guestNotice")}</span>
        <Button
          asChild
          size="sm"
          className="rounded-full gap-1.5 bg-gradient-to-r from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] text-[#05070f] shadow-[0_10px_24px_-8px_var(--hero-glow-1)] hover:opacity-90"
        >
          <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
            <LogIn className="size-3.5" />
            {t("signIn")}
          </Link>
        </Button>
      </div>
    );
  }

  const displayName = profileMeta?.displayName || user.email?.split("@")[0] || "Account";
  const avatarUrl = profileMeta?.avatarUrl;

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="size-5 rounded-full bg-muted object-cover"
          />
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-muted">
            <User className="size-3" />
          </div>
        )}
        <span className="max-w-[120px] truncate">{displayName}</span>
      </div>
      {/* compact: used on the slim site-wide header (marketing/content pages) where
          these in-app shortcuts would be redundant with the header's own nav links —
          full set only shown on the personality-app header where they're the only
          way to reach dashboard/pair/settings. */}
      {!compact ? (
        <>
          <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5">
            <I18nLink href="/combined">
              <LayoutDashboard className="size-3.5" />
              <span className="sr-only">Dashboard</span>
            </I18nLink>
          </Button>
          <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5">
            <I18nLink href="/teams">
              <Users className="size-3.5" />
              <span className="sr-only">Teams</span>
            </I18nLink>
          </Button>
          <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5">
            <I18nLink href="/pair">
              <GitCompareArrows className="size-3.5" />
              <span className="sr-only">Comparisons</span>
            </I18nLink>
          </Button>
          <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5">
            <I18nLink href="/settings">
              <Settings className="size-3.5" />
              <span className="sr-only">Settings</span>
            </I18nLink>
          </Button>
        </>
      ) : null}
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm" className="rounded-full gap-1.5">
          <LogOut className="size-3.5" />
          {t("signOut")}
        </Button>
      </form>
    </div>
  );
}
