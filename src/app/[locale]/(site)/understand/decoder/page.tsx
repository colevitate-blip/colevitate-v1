import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Decoder } from "@/components/understand/Decoder";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "understand" });
  const path = "/understand/decoder";
  return {
    title: t("meta.decoder.title"),
    description: t("meta.decoder.description"),
    alternates: { canonical: path },
    openGraph: { title: t("meta.decoder.title"), description: t("meta.decoder.description"), url: path },
  };
}

export default async function DecoderPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ phrase?: string | string[] }>;
}) {
  const { locale } = await params;
  const { phrase } = await searchParams;
  const t = await getTranslations({ locale, namespace: "understand" });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:pt-16 lg:pb-12">
      <Link
        href="/understand"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("topicPage.backToHub")}
      </Link>
      <Badge variant="outline" className="mb-3 block w-fit rounded-full">
        {t("decoder.eyebrow")}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("decoder.title")}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{t("decoder.intro")}</p>
      <div className="mt-8">
        <Decoder initialPhrase={typeof phrase === "string" ? phrase : undefined} />
      </div>
    </main>
  );
}
