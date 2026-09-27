import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, MessagesSquare } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Section, BulletList } from "@/components/seo/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/seo/structuredData";
import { CultureMatrix } from "@/components/understand/CultureMatrix";
import { CULTURE_IDS, DIMENSIONS } from "@/lib/understand/model";
import { TOPIC_EXAMPLE_PHRASE, UNDERSTAND_TOPICS, isUnderstandTopic } from "@/lib/understand/topics";

type Params = { locale: string; topic: string };
type TopicSection = { heading: string; body: string; bullets?: string[] };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => UNDERSTAND_TOPICS.map((topic) => ({ locale, topic })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!isUnderstandTopic(topic)) return {};
  const t = await getTranslations({ locale, namespace: "understand" });
  const path = `/understand/${topic}`;
  return {
    title: t(`topics.${topic}.metaTitle`),
    description: t(`topics.${topic}.metaDescription`),
    alternates: { canonical: path },
    openGraph: { title: t(`topics.${topic}.metaTitle`), description: t(`topics.${topic}.metaDescription`), url: path },
  };
}

export default async function UnderstandTopicPage({ params }: { params: Promise<Params> }) {
  const { locale, topic } = await params;
  if (!isUnderstandTopic(topic)) notFound();
  const t = await getTranslations({ locale, namespace: "understand" });
  const sections = t.raw(`topics.${topic}.sections`) as TopicSection[];
  const examplePhrase = TOPIC_EXAMPLE_PHRASE[topic];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <JsonLd
        data={articleJsonLd({
          headline: t(`topics.${topic}.title`),
          description: t(`topics.${topic}.metaDescription`),
          url: `/understand/${topic}`,
        })}
      />

      <Link
        href="/understand"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("topicPage.backToHub")}
      </Link>

      <Badge variant="outline" className="mb-3 block w-fit rounded-full">
        {t(`topics.${topic}.eyebrow`)}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(`topics.${topic}.title`)}</h1>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">{t(`topics.${topic}.intro`)}</p>

      {sections.map((section) => (
        <Section key={section.heading} title={section.heading}>
          <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          {section.bullets && section.bullets.length > 0 ? (
            <div className="mt-3">
              <BulletList items={section.bullets} />
            </div>
          ) : null}
        </Section>
      ))}

      {topic === "cultures" ? (
        <Section title={t("topicPage.matrixHeading")}>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t("topicPage.matrixIntro")}</p>
          <CultureMatrix
            cultureLabels={Object.fromEntries(CULTURE_IDS.map((c) => [c, t(`cultures.${c}`)]))}
            dimensionLabels={Object.fromEntries(
              DIMENSIONS.map((d) => [
                d,
                { label: t(`dimensions.${d}.label`), left: t(`dimensions.${d}.left`), right: t(`dimensions.${d}.right`) },
              ])
            )}
          />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("topicPage.matrixNote")}</p>
        </Section>
      ) : null}

      <Link
        href={{ pathname: "/understand/decoder", query: { phrase: examplePhrase } }}
        className="group mt-10 flex items-center gap-3 rounded-2xl border bg-gradient-to-br from-primary/10 to-card p-4 transition-colors hover:border-primary/50"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <MessagesSquare className="size-4" />
        </span>
        <span className="min-w-0 text-sm">
          <span className="block font-semibold">{t("topicPage.tryDecoder")}</span>
          <span className="block truncate text-muted-foreground">{t(`decoder.phrases.${examplePhrase}.label`)}</span>
        </span>
        <ArrowRight className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
      </Link>

      <Section title={t("topicPage.otherGuides")}>
        <div className="flex flex-wrap gap-2">
          {UNDERSTAND_TOPICS.filter((other) => other !== topic).map((other) => (
            <Link
              key={other}
              href={`/understand/${other}`}
              className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              {t(`hub.topics.${other}.title`)}
            </Link>
          ))}
        </div>
      </Section>
    </article>
  );
}
