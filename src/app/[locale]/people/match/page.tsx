import type { Metadata } from "next";
import { getAllFamousPeopleSlugs, getFamousPerson } from "@/lib/seo/famousPeopleContent";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import { deriveFamousPersonResults } from "@/components/seo/famousPersonResults";
import { CompatibilityReportView } from "@/components/personality/compatibility/CompatibilityReportView";
import { RELATIONSHIP_TYPE_ORDER, type RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import { CelebrityMatchPicker, type MatchRosterEntry } from "@/components/match/CelebrityMatchPicker";

type Params = { locale: string };
type SearchParams = { a?: string; b?: string; type?: string };

const DEFAULT_RELATIONSHIP_TYPE: RelationshipType = "friend";

function resolveRelationshipType(type: string | undefined): RelationshipType {
  return (RELATIONSHIP_TYPE_ORDER as string[]).includes(type ?? "")
    ? (type as RelationshipType)
    : DEFAULT_RELATIONSHIP_TYPE;
}

function buildRoster(locale: string): MatchRosterEntry[] {
  return getAllFamousPeopleSlugs()
    .map((slug) => getFamousPerson(slug, locale))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => ({ slug: p.slug, name: p.name, category: p.category }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { a, b } = await searchParams;
  const personA = a ? getFamousPerson(a, locale) : null;
  const personB = b ? getFamousPerson(b, locale) : null;

  if (personA && personB && personA.slug !== personB.slug) {
    const title = `${personA.name} & ${personB.name}: Personality Compatibility | Colevitate`;
    const description = `How ${personA.name} and ${personB.name}'s personalities compare, based on Colevitate's editorial typings across MBTI, Big Five, and Color Type.`;
    return { title, description, robots: { index: false, follow: true } };
  }

  return {
    title: "Celebrity Personality Match | Colevitate",
    description: "Pick any two people from Colevitate's celebrity roster and see how their personalities compare.",
    alternates: { canonical: "/people/match" },
  };
}

export default async function CelebrityMatchPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const { a, b, type } = await searchParams;

  const roster = buildRoster(locale);
  const relationshipType = resolveRelationshipType(type);

  const personA = a ? getFamousPerson(a, locale) : null;
  const personB = b ? getFamousPerson(b, locale) : null;

  let report: React.ReactNode = null;
  if (a && b && personA && personB) {
    if (personA.slug === personB.slug) {
      report = (
        <p className="mx-auto mt-8 max-w-md text-center text-sm text-muted-foreground">
          Pick two different people to see a compatibility report.
        </p>
      );
    } else {
      const axesA = computeScoringMatrix(deriveFamousPersonResults(personA));
      const axesB = computeScoringMatrix(deriveFamousPersonResults(personB));
      const compatibility = computeCompatibility(axesA, axesB, personA.name, personB.name);
      report = (
        <CompatibilityReportView
          compatibility={compatibility}
          nameA={personA.name}
          nameB={personB.name}
          relationshipType={relationshipType}
          shareLevel="axes"
        />
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Celebrity Personality Match</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
        Pick any two people from our celebrity roster — a real couple, rivals, coworkers, or a totally random
        pairing — and see how their personalities line up.
      </p>

      <div className="mt-8">
        <CelebrityMatchPicker
          roster={roster}
          initialA={personA?.slug ?? null}
          initialB={personB?.slug ?? null}
          initialType={relationshipType}
        />
      </div>

      {report}
    </div>
  );
}
