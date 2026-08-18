import { SITE_URL } from "./siteConfig";

/** Article JSON-LD for a type/combination page — headline + description mirror the on-page H1/intro exactly, per Google's structured-data guidance. */
export function articleJsonLd({ headline, description, url }: { headline: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${SITE_URL}${url}`,
    publisher: {
      "@type": "Organization",
      name: "Colevitate",
      url: SITE_URL,
    },
  };
}

/** FAQPage JSON-LD. Only pass Q&A pairs that are also rendered visibly on the page — schema for content the visitor can't actually see violates Google's FAQ guidelines. */
export function faqJsonLd(qa: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
