import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllFamousPeopleSlugs, getFamousPerson } from "@/lib/seo/famousPeopleContent";
import { PersonPageTemplate } from "@/components/seo/PersonPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/seo/structuredData";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  const slugs = getAllFamousPeopleSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const content = getFamousPerson(slug, locale);
  if (!content) return {};

  const title = `What Personality Type Is ${content.name}? | Colevitate`;
  const description = `Colevitate's editorial take on ${content.name}'s personality type across MBTI, Big Five, and Color Type — based on public behavior and biography, not a factual claim.`;
  const path = `/people/${content.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function PersonPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const content = getFamousPerson(slug, locale);
  if (!content) notFound();

  const path = `/people/${content.slug}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: `What personality type is ${content.name}?`,
          description: content.bio,
          url: path,
        })}
      />
      <PersonPageTemplate content={content} />
    </>
  );
}
