"use client";

import { usePersonality } from "@/lib/personality/context";
import { BigFiveSurvey } from "@/components/personality/bigfive/BigFiveSurvey";
import { BigFiveResult } from "@/components/personality/bigfive/BigFiveResult";

export default function BigFivePage() {
  const { mounted, results } = usePersonality();

  if (!mounted) return null;
  if (results.bigfive) return <BigFiveResult result={results.bigfive} />;
  return <BigFiveSurvey />;
}
