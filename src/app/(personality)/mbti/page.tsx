"use client";

import { usePersonality } from "@/lib/personality/context";
import { MbtiSurvey } from "@/components/personality/mbti/MbtiSurvey";
import { MbtiResult } from "@/components/personality/mbti/MbtiResult";
import { AnalyzingScreen } from "@/components/personality/shared/AnalyzingScreen";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";

export default function MbtiPage() {
  const { mounted, results, analyzingId } = usePersonality();

  if (!mounted) return null;
  if (analyzingId === "mbti") {
    return <AnalyzingScreen label="16 Personalities" accent={ASSESSMENT_THEME.mbti} />;
  }
  if (results.mbti) return <MbtiResult result={results.mbti} />;
  return <MbtiSurvey />;
}
