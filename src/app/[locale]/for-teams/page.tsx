import type { Metadata } from "next";
import { ArrowRight, Layers, Lock, Users2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ColevitateMark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Colevitate for Teams — Team Composition Insights",
  description:
    "See where your team clusters and diverges across four combined personality frameworks. Private by default — each person opts in before sharing.",
  alternates: { canonical: "/for-teams" },
};

export default async function ForTeamsPage() {
  const t = await getTranslations("forTeams");

  const features = [
    { key: "frameworks", icon: Layers },
    { key: "optIn", icon: Lock },
    { key: "anySize", icon: Users2 },
  ] as const;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:py-20">
      <Link href="/" className="flex items-center gap-2">
        <ColevitateMark className="size-8" />
        <span className="text-sm font-semibold tracking-tight">Colevitate</span>
      </Link>

      <section className="mx-auto mt-12 max-w-2xl text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {t("eyebrow")}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>
      </section>

      <section className="mt-14 grid gap-5 sm:grid-cols-3">
        {features.map(({ key, icon: Icon }) => (
          <div key={key} className="rounded-2xl border bg-card p-5">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted">
              <Icon className="size-4" />
            </div>
            <h2 className="mt-3 text-sm font-semibold">{t(`features.${key}.title`)}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t(`features.${key}.body`)}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-14 text-center">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/teams">
            {t("cta")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/teams" className="underline underline-offset-2 hover:text-foreground">
            {t("secondary")}
          </Link>
        </p>
      </section>
    </main>
  );
}
