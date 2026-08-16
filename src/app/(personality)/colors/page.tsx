"use client";

import { usePersonality } from "@/lib/personality/context";
import { ColorSurvey } from "@/components/personality/colors/ColorSurvey";
import { ColorResult } from "@/components/personality/colors/ColorResult";
import { AnalyzingScreen } from "@/components/personality/shared/AnalyzingScreen";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";

export default function ColorsPage() {
  const { mounted, results, analyzingId } = usePersonality();

  if (!mounted) return null;
  if (analyzingId === "colors") {
    return <AnalyzingScreen label="4 Color Types" accent={ASSESSMENT_THEME.colors} />;
  }
  if (results.colors) return <ColorResult result={results.colors} />;
  return <ColorSurvey />;
}
