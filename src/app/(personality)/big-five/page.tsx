"use client";

import { usePersonality } from "@/lib/personality/context";
import { BigFiveSurvey } from "@/components/personality/bigfive/BigFiveSurvey";
import { BigFiveResult } from "@/components/personality/bigfive/BigFiveResult";
import { AnalyzingScreen } from "@/components/personality/shared/AnalyzingScreen";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";

export default function BigFivePage() {
  const { mounted, results, analyzingId } = usePersonality();

  if (!mounted) return null;
  if (analyzingId === "bigfive") {
    return <AnalyzingScreen label="Big Five (OCEAN)" accent={ASSESSMENT_THEME.bigfive} />;
  }
  if (results.bigfive) return <BigFiveResult result={results.bigfive} />;
  return <BigFiveSurvey />;
}
