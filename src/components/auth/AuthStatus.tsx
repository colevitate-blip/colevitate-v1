"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogOut, Settings, User, Users } from "lucide-react";
import { Link as I18nLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { signOut } from "@/app/auth/actions";

export function AuthStatus() {
  const { user, authLoading, profileMeta } = useAuth();
  const t = useTranslations("chrome");

  if (authLoading) return null;

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className="rounded-full">
        <Link href="/login">{t("signIn")}</Link>
      </Button>
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
      <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5">
        <I18nLink href="/teams">
          <Users className="size-3.5" />
          <span className="sr-only">Teams</span>
        </I18nLink>
      </Button>
      <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5">
        <I18nLink href="/settings">
          <Settings className="size-3.5" />
          <span className="sr-only">Settings</span>
        </I18nLink>
      </Button>
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm" className="rounded-full gap-1.5">
          <LogOut className="size-3.5" />
          {t("signOut")}
        </Button>
      </form>
    </div>
  );
}
