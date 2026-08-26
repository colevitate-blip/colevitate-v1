"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Shown at the top of the results view for a signed-out visitor — their profile only
 * lives in this browser's storage, so it's one cleared cache or new device away from gone. */
export function GuestSaveNotice() {
  const pathname = usePathname();
  const t = useTranslations("chrome");

  return (
    <div className="mx-auto mb-6 flex w-full max-w-3xl flex-col items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
      <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-300">{t("guestSaveBanner")}</p>
      <Button
        asChild
        size="sm"
        className="shrink-0 rounded-full gap-1.5 bg-gradient-to-r from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] text-[#05070f] shadow-[0_10px_24px_-8px_var(--hero-glow-1)] hover:opacity-90"
      >
        <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
          <LogIn className="size-3.5" />
          {t("guestSaveBannerCta")}
        </Link>
      </Button>
    </div>
  );
}
