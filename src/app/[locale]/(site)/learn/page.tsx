import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { FRAMEWORK_CONTENT, FRAMEWORK_ORDER } from "@/lib/seo/frameworkContent";

export const metadata: Metadata = {
  title: "Personality Test Knowledge Base | Colevitate",
  description:
    "What 16 Personalities, Big Five, Human Design, and 4 Color Types actually measure, where each one comes from, how it's scored here, and how much scientific backing it has.",
  alternates: { canonical: "/learn" },
};

export default function LearnIndexPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Personality Test Knowledge Base</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Four very different tools live on this site — one is the most evidence-backed model in personality
        science, and one has no scientific basis at all. Here&rsquo;s where each one came from, what it actually
        measures, how it&rsquo;s scored on this site, and how much weight to give the result.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FRAMEWORK_ORDER.map((id) => {
          const content = FRAMEWORK_CONTENT[id];
          return (
            <Link
              key={id}
              href={`/learn/${content.slug}`}
              className="flex flex-col rounded-3xl border bg-card p-6 transition-colors hover:bg-muted/50"
            >
              <Badge variant="outline" className="w-fit rounded-full">
                {content.tagline}
              </Badge>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">{content.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.intro}</p>
              <span className="mt-4 text-sm font-medium text-primary">{content.standing.summary} →</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
