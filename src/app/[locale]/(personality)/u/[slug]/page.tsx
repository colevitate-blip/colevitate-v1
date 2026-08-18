import { notFound } from "next/navigation";
import { GitCompareArrows } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { CombinedProfile } from "@/components/personality/combined/CombinedProfile";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import type { PersonalityResults } from "@/lib/personality/types";

export default async function PublicSharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_public, results")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (error || !profile || !profile.is_public) {
    notFound();
  }

  const results = (profile.results as PersonalityResults) || {};
  const completedCount = Object.values(results).filter((r) => r !== undefined && r !== null).length;

  // Need at least 2 completed assessments to generate a combined profile
  if (completedCount < 2) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Profile Not Ready</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This profile needs at least 2 completed assessments to generate a combined view.
          </p>
        </div>
      </div>
    );
  }

  const combinedProfile = generateCombinedProfile(results);
  if (!combinedProfile) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          {profile.display_name || "Someone"}'s Personality Profile
        </p>
        <Link
          href={`/u/${slug}/compare`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <GitCompareArrows className="size-4" />
          Compare with your profile
        </Link>
      </div>
      <CombinedProfile profile={combinedProfile} results={results} recordHistory={false} />
    </div>
  );
}
