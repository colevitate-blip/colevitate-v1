import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/seo/Section";
import { QuizCta } from "@/components/seo/QuizCta";
import { DetailToggle } from "@/components/seo/DetailToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/structuredData";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { FRAMEWORK_URL_SLUGS } from "@/lib/seo/typeContent";
import { AXES, AGREEMENT_SPREAD_THRESHOLDS } from "@/components/personality/combined/scoringMatrix";
import { ARCHETYPE_KEYS } from "@/components/personality/combined/archetypeMatrix";
import { COMPATIBILITY_BUCKET_THRESHOLDS } from "@/components/personality/combined/computeCompatibility";
import {
  MATCH_GAUGE_WEIGHTS,
  DEFINING_AXIS_GATE,
  DEFINING_AXIS,
  RELATIONSHIP_TYPE_ORDER,
  relationshipFramingFor,
} from "@/components/personality/compatibility/relationshipFraming";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  const path = "/methodology";

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: { canonical: path },
    openGraph: { title: t("meta.title"), description: t("meta.description"), url: path },
  };
}

const FRAMEWORK_WEIGHT_KEYS = ["mbti", "bigfive", "humandesign", "colors"] as const;

export default async function MethodologyPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  const tScoring = await getTranslations({ locale, namespace: "scoring" });
  const tArchetypes = await getTranslations({ locale, namespace: "archetypes" });
  const path = "/methodology";

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <JsonLd
        data={articleJsonLd({
          headline: t("hero.title"),
          description: t("meta.description"),
          url: path,
        })}
      />
      <JsonLd
        data={faqJsonLd([
          { question: t("hero.title"), answer: t("hero.intro") },
          { question: t("archetypes.heading"), answer: t("archetypes.intro") },
        ])}
      />

      <Badge variant="outline" className="mb-3 rounded-full">
        {t("hero.eyebrow")}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("hero.title")}</h1>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">{t("hero.intro")}</p>

      {/* ---------- The four frameworks ---------- */}
      <Section title={t("frameworks.heading")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("frameworks.intro")}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ASSESSMENT_ORDER.map((id) => {
            const catalog = ASSESSMENT_CATALOG[id];
            const theme = ASSESSMENT_THEME[id];
            const Icon = catalog.icon;
            return (
              <div key={id} className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2.5">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${theme.softBg}`}>
                    <Icon className={`size-4 ${theme.text}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{catalog.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t("frameworks.questionCount", { count: catalog.questionCount })}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {t(`frameworks.${id}.mechanic`)}
                </p>
                <Link
                  href={`/learn/${FRAMEWORK_URL_SLUGS[id]}`}
                  className="mt-3 inline-block text-xs font-medium text-primary underline underline-offset-2"
                >
                  {t("frameworks.fullWriteUp")} →
                </Link>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------- Combined axis system ---------- */}
      <Section title={t("combine.heading")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("combine.intro")}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("combine.axesIntro")}</p>

        <h3 className="mt-5 text-sm font-semibold">{t("combine.weightsHeading")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{t("combine.weightsNote")}</p>
        <div className="mt-3 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">{t("labels.axis")}</th>
                {FRAMEWORK_WEIGHT_KEYS.map((key) => (
                  <th key={key} className="px-3 py-2 font-medium">
                    {ASSESSMENT_CATALOG[key].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AXES.map((axis) => (
                <tr key={axis.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-medium">
                    {tScoring(`axes.${axis.id}.label`)}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {tScoring(`axes.${axis.id}.leftPole`)} ↔ {tScoring(`axes.${axis.id}.rightPole`)}
                    </span>
                  </td>
                  {FRAMEWORK_WEIGHT_KEYS.map((key) => (
                    <td key={key} className="px-3 py-2 text-muted-foreground">
                      {Math.round(axis.weights[key] * 100)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("combine.renormalization")}</p>

        <h3 className="mt-6 text-sm font-semibold">{t("combine.agreementHeading")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {t("combine.agreement", {
            agree: AGREEMENT_SPREAD_THRESHOLDS.agree,
            mixed: AGREEMENT_SPREAD_THRESHOLDS.mixed,
          })}
        </p>
      </Section>

      {/* ---------- 16 archetypes ---------- */}
      <Section title={t("archetypes.heading")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("archetypes.intro")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("archetypes.tableNote")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ARCHETYPE_KEYS.map((key) => (
            <div key={key} className="rounded-2xl border bg-card p-3.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full font-mono text-[10px]">
                  {key}
                </Badge>
                <h3 className="text-sm font-semibold">{tArchetypes(`${key}.name`)}</h3>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tArchetypes(`${key}.description`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Two-profile comparison ---------- */}
      <Section title={t("compare.heading")}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("compare.intro")}</p>

        <h3 className="mt-5 text-sm font-semibold">{t("compare.similarityHeading")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("compare.similarity")}</p>

        <h3 className="mt-5 text-sm font-semibold">{t("compare.bucketsHeading")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {t("compare.buckets", {
            aligned: COMPATIBILITY_BUCKET_THRESHOLDS.aligned,
            different: COMPATIBILITY_BUCKET_THRESHOLDS.different,
          })}
        </p>

        <h3 className="mt-5 text-sm font-semibold">{t("compare.matchGaugeHeading")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("compare.matchGauge")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("compare.matchGaugeTableNote")}</p>
        <div className="mt-3 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">{t("labels.axis")}</th>
                {RELATIONSHIP_TYPE_ORDER.map((type) => (
                  <th key={type} className="px-3 py-2 font-medium">
                    {t(`labels.${type}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AXES.map((axis) => (
                <tr key={axis.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-medium">{tScoring(`axes.${axis.id}.label`)}</td>
                  {RELATIONSHIP_TYPE_ORDER.map((type) => (
                    <td key={type} className="px-3 py-2 text-muted-foreground">
                      {Math.round(MATCH_GAUGE_WEIGHTS[type][axis.id] * 100)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-sm font-semibold">{t("compare.definingAxisHeading")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("compare.definingAxis")}</p>
        <ul className="mt-3 space-y-1.5">
          {RELATIONSHIP_TYPE_ORDER.map((type) => {
            const definingAxis = AXES.find((axis) => axis.id === DEFINING_AXIS[type]);
            return (
              <li key={type} className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">{relationshipFramingFor(type).label}</span>
                <span className="text-muted-foreground">{definingAxis ? tScoring(`axes.${definingAxis.id}.label`) : ""}</span>
              </li>
            );
          })}
        </ul>

        <DetailToggle label={t("compare.curious")} hideLabel={t("ui.hideDetail")}>
          <p>
            {t("compare.curiousDetail", {
              aligned: DEFINING_AXIS_GATE.aligned,
              different: DEFINING_AXIS_GATE.different,
              opposite: DEFINING_AXIS_GATE.opposite,
            })}
          </p>
        </DetailToggle>

        <div className="mt-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{t("ui.ctaCompare")}</p>
          <Link
            href="/pair"
            className="mt-1.5 inline-block text-sm font-medium text-primary underline underline-offset-2"
          >
            {t("ui.ctaCompareLink")} →
          </Link>
        </div>
      </Section>

      <QuizCta href="/mbti" label="Start with 16 Personalities" />
    </article>
  );
}
