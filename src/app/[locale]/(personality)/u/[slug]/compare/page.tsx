"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { loadResults, loadRemoteResults } from "@/lib/personality/storage";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { computeCompatibility, type Compatibility } from "@/components/personality/combined/computeCompatibility";
import { CompatibilityView } from "@/components/personality/compatibility/CompatibilityView";
import type { PersonalityResults } from "@/lib/personality/types";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "need-more" }
  | { status: "ready"; compatibility: Compatibility; targetName: string };

export default function ComparePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, authLoading } = useAuth();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const { data: target, error } = await supabase
        .from("profiles")
        .select("display_name, is_public, results")
        .eq("share_slug", slug)
        .eq("is_public", true)
        .maybeSingle();

      if (cancelled) return;
      if (error || !target) {
        setState({ status: "not-found" });
        return;
      }

      const targetResults = (target.results as PersonalityResults) || {};
      const targetName = target.display_name || "This person";

      const myResults = user ? (await loadRemoteResults(user.id)) ?? loadResults() : loadResults();
      if (cancelled) return;

      const myProfile = generateCombinedProfile(myResults);
      const targetProfile = generateCombinedProfile(targetResults);

      if (!myProfile || !targetProfile) {
        setState({ status: "need-more" });
        return;
      }

      const myAxes = computeScoringMatrix(myResults);
      const targetAxes = computeScoringMatrix(targetResults);
      const compatibility = computeCompatibility(myAxes, targetAxes, "You", targetName);
      setState({ status: "ready", compatibility, targetName });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug, user, authLoading]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Profile Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This share link isn&apos;t public anymore, or never existed.
        </p>
      </div>
    );
  }

  if (state.status === "need-more") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Not Ready to Compare Yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Comparing needs at least 2 completed assessments on both sides. Finish a couple more
          assessments of your own, then come back to this link.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          Back to assessments
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:pt-12">
        <Link
          href={`/u/${slug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to {state.targetName}&apos;s profile
        </Link>
      </div>
      <CompatibilityView compatibility={state.compatibility} nameA="You" nameB={state.targetName} />
    </>
  );
}
