"use client";

import { usePersonality } from "@/lib/personality/context";
import { MbtiSurvey } from "@/components/personality/mbti/MbtiSurvey";
import { MbtiResult } from "@/components/personality/mbti/MbtiResult";

export default function MbtiPage() {
  const { mounted, results } = usePersonality();

  if (!mounted) return null;
  if (results.mbti) return <MbtiResult result={results.mbti} />;
  return <MbtiSurvey />;
}
