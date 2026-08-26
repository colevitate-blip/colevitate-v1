"use client";

import { SlidersHorizontal } from "lucide-react";
import { AxisAgreement } from "@/components/personality/shared/AxisAgreement";
import { PersonalityGraphCard } from "@/components/personality/combined/PersonalityGraphCard";
import type { PersonalityResults } from "@/lib/personality/types";
import type { CombinedProfile } from "@/components/personality/combined/generateCombinedProfile";

/** Same axis-agreement bars and connected graph shown on a real user's /combined page — reused here against a famous person's derived, editorial results. */
export function FamousPersonInsights({
  name,
  profile,
  results,
}: {
  name: string;
  profile: CombinedProfile;
  results: PersonalityResults;
}) {
  return (
    <>
      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <SlidersHorizontal className="size-4" />
          </div>
          <h2 className="font-semibold">Where Our Lenses Agree</h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          The same view we give everyone on their own combined result — except every value here is
          Colevitate&apos;s editorial estimate for {name}, not a measurement. Where the frameworks land close
          together, that&apos;s a well-corroborated read; where they pull apart, it&apos;s us being honest
          that a single public figure doesn&apos;t reduce cleanly to one number.
        </p>
        <div className="space-y-7">
          {profile.axes.map((axis) => (
            <AxisAgreement key={axis.id} axis={axis} results={results} />
          ))}
        </div>
      </div>

      <PersonalityGraphCard profile={profile} results={results} progress={{}} />
    </>
  );
}
