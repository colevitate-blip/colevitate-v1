import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FRAMEWORK_CONTENT, FRAMEWORK_ORDER, getFrameworkContent } from "@/lib/seo/frameworkContent";
import { getAllCodesForFramework, getTypeContent } from "@/lib/seo/typeContent";
import { FrameworkPageTemplate } from "@/components/seo/FrameworkPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/structuredData";

type Params = { locale: string; framework: string };

export function generateStaticParams() {
  const slugs = FRAMEWORK_ORDER.map((id) => FRAMEWORK_CONTENT[id].slug);
  return routing.locales.flatMap((locale) => slugs.map((framework) => ({ locale, framework })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { framework } = await params;
  const content = getFrameworkContent(framework);
  if (!content) return {};

  const title = `${content.label} Explained — Origin, Traits & Validity | Colevitate`;
  const path = `/learn/${content.slug}`;

  return {
    title,
    description: content.intro,
    alternates: { canonical: path },
    openGraph: { title, description: content.intro, url: path },
  };
}

export default async function FrameworkLearnPage({ params }: { params: Promise<Params> }) {
  const { locale, framework } = await params;
  const content = getFrameworkContent(framework);
  if (!content) notFound();

  const path = `/learn/${content.slug}`;

  // This framework's own type pages, which now sit directly below this one at
  // /learn/<framework>/<type>. Same derivation the /learn hub uses for its
  // pills, narrowed to the one framework being explained.
  const typeLinks = getAllCodesForFramework(content.id)
    .map((code) => {
      const typeContent = getTypeContent(content.slug, code.toLowerCase(), locale);
      if (!typeContent) return null;
      return { href: `/learn/${content.slug}/${typeContent.slug}`, label: typeContent.name };
    })
    .filter((link) => link !== null);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: `${content.label} Explained`,
          description: content.intro,
          url: path,
        })}
      />
      <JsonLd
        data={faqJsonLd([
          { question: `What does ${content.label} measure?`, answer: content.whatItMeasures },
          { question: `How scientifically valid is ${content.label}?`, answer: content.standing.detail },
        ])}
      />
      <FrameworkPageTemplate content={content} typeLinks={typeLinks} />
    </>
  );
}
