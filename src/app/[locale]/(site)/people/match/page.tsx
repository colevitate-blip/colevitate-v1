import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";
import { getAllFamousPeopleSlugs, getFamousPerson } from "@/lib/seo/famousPeopleContent";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { deriveFamousPersonResults } from "@/components/seo/famousPersonResults";
import { CompatibilityReportView } from "@/components/personality/compatibility/CompatibilityReportView";
import { RELATIONSHIP_TYPE_ORDER, type RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import { CelebrityMatchPicker, type MatchRosterEntry, type YouOption } from "@/components/match/CelebrityMatchPicker";
import { PersonVersusHeader } from "@/components/match/PersonVersusHeader";
import { VsMeRelationshipToggle } from "@/components/match/VsMeRelationshipToggle";
import type { PersonalityResults } from "@/lib/personality/types";

type Params = { locale: string };
type SearchParams = { a?: string; b?: string; type?: string; vs?: string };

const DEFAULT_RELATIONSHIP_TYPE: RelationshipType = "friend";

function resolveRelationshipType(type: string | undefined): RelationshipType {
  return (RELATIONSHIP_TYPE_ORDER as string[]).includes(type ?? "")
    ? (type as RelationshipType)
    : DEFAULT_RELATIONSHIP_TYPE;
}

// Mirrors the vs=me branch's own "logged in with a completed combined
// profile" check, just without redirecting — the picker shows a CTA instead
// of the "compare with your own results" affordance when either condition
// fails.
async function resolveYouOption(): Promise<YouOption> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    return {
      available: false,
      ctaLabel: "Log in to compare your own results",
      ctaHref: await loginRedirectTarget("/people/match"),
    };
  }

  const { data: profile } = await supabase.from("profiles").select("results").eq("id", user.id).maybeSingle();
  const results = (profile?.results as PersonalityResults) || {};
  const combinedProfile = generateCombinedProfile(results);

  if (!combinedProfile) {
    return {
      available: false,
      ctaLabel: "Complete 2+ assessments to compare your own results",
      ctaHref: "/combined",
    };
  }

  return { available: true, name: "You" };
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
  const { a, b, vs } = await searchParams;
  const personA = a ? getFamousPerson(a, locale) : null;
  const personB = b ? getFamousPerson(b, locale) : null;

  if (vs === "me" && personA) {
    const title = `You & ${personA.name}: Personality Compatibility | Colevitate`;
    const description = `How your personality compares to ${personA.name}'s, based on Colevitate's editorial typings across MBTI, Big Five, and Color Type.`;
    return { title, description, robots: { index: false, follow: true } };
  }

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
  const { a, b, type, vs } = await searchParams;

  const relationshipType = resolveRelationshipType(type);
  const personA = a ? getFamousPerson(a, locale) : null;

  if (vs === "me" && personA) {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      redirect(await loginRedirectTarget(`/people/match?a=${a}&vs=me`));
    }

    const { data: profile } = await supabase.from("profiles").select("results").eq("id", user.id).maybeSingle();
    const results = (profile?.results as PersonalityResults) || {};
    const combinedProfile = generateCombinedProfile(results);

    let report: React.ReactNode;
    if (!combinedProfile) {
      report = (
        <p className="mx-auto mt-8 max-w-md text-center text-sm text-muted-foreground">
          Complete at least two assessments to compare your own results with {personA.name}.
        </p>
      );
    } else {
      const viewerAxes = computeScoringMatrix(results);
      const celebAxes = computeScoringMatrix(deriveFamousPersonResults(personA));
      const compatibility = computeCompatibility(viewerAxes, celebAxes, "You", personA.name);
      report = (
        <CompatibilityReportView
          compatibility={compatibility}
          nameA="You"
          nameB={personA.name}
          relationshipType={relationshipType}
          shareLevel="axes"
        />
      );
    }

    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          You vs. {personA.name}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          How your own personality results compare with {personA.name}&apos;s editorial typing.
        </p>

        <div className="mt-8">
          <PersonVersusHeader personA={null} personB={personA} />
        </div>

        <div className="mt-6 flex justify-center">
          <VsMeRelationshipToggle slug={personA.slug} value={relationshipType} />
        </div>

        {report}

        <p className="mt-8 text-center">
          <Link
            href={`/people/match?a=${personA.slug}`}
            className="text-sm font-medium text-muted-foreground underline underline-offset-2"
          >
            Or compare {personA.name} with someone else instead
          </Link>
        </p>
      </div>
    );
  }

  const roster = buildRoster(locale);
  const you = await resolveYouOption();
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
        <>
          <div className="mt-8">
            <PersonVersusHeader personA={personA} personB={personB} />
          </div>
          <CompatibilityReportView
            compatibility={compatibility}
            nameA={personA.name}
            nameB={personB.name}
            relationshipType={relationshipType}
            shareLevel="axes"
          />
        </>
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
          you={you}
        />
      </div>

      {report}
    </div>
  );
}
