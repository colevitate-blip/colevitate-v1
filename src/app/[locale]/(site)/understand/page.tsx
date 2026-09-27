import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Briefcase, Globe2, Heart, MessagesSquare, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/seo/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/seo/structuredData";
import { DIMENSIONS } from "@/lib/understand/model";
import { UNDERSTAND_TOPICS, type UnderstandTopic } from "@/lib/understand/topics";

type Params = { locale: string };

const TOPIC_ICON: Record<UnderstandTopic, typeof Globe2> = {
  cultures: Globe2,
  "men-women": Users,
  workplace: Briefcase,
  private: Heart,
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "understand" });
  const path = "/understand";
  return {
    title: t("meta.hub.title"),
    description: t("meta.hub.description"),
    alternates: { canonical: path },
    openGraph: { title: t("meta.hub.title"), description: t("meta.hub.description"), url: path },
  };
}

export default async function UnderstandHubPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "understand" });
  const principles = t.raw("hub.principles") as string[];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <JsonLd data={articleJsonLd({ headline: t("hub.title"), description: t("meta.hub.description"), url: "/understand" })} />

      <Badge variant="outline" className="mb-3 rounded-full">
        {t("hub.eyebrow")}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("hub.title")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{t("hub.intro")}</p>

      {/* Decoder — the hub's primary action, so it gets the full-width card up top. */}
      <Link
        href="/understand/decoder"
        className="group mt-8 block rounded-3xl border bg-gradient-to-br from-primary/15 via-card to-card p-5 transition-colors hover:border-primary/50 sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MessagesSquare className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{t("hub.decoderCard.eyebrow")}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{t("hub.decoderCard.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("hub.decoderCard.body")}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              {t("hub.decoderCard.cta")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>

      <Section title={t("hub.topicsHeading")}>
        <div className="grid gap-3 sm:grid-cols-2">
          {UNDERSTAND_TOPICS.map((topic) => {
            const Icon = TOPIC_ICON[topic];
            return (
              <Link
                key={topic}
                href={`/understand/${topic}`}
                className="group flex gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    {t(`hub.topics.${topic}.title`)}
                    <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {t(`hub.topics.${topic}.blurb`)}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title={t("hub.principlesHeading")}>
        <ol className="grid gap-3 sm:grid-cols-2">
          {principles.map((principle, i) => {
            const [lead, ...rest] = principle.split(". ");
            return (
              <li key={i} className="rounded-2xl border p-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{lead}.</span> {rest.join(". ")}
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title={t("hub.dimensionsHeading")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("hub.dimensionsIntro")}</p>
        <dl className="mt-4 divide-y rounded-2xl border">
          {DIMENSIONS.map((d) => (
            <div key={d} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold">
                {t(`dimensions.${d}.label`)}
                <span className="block text-xs font-normal text-muted-foreground">
                  {t(`dimensions.${d}.left`)} ↔ {t(`dimensions.${d}.right`)}
                </span>
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{t(`dimensions.${d}.description`)}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </main>
  );
}
