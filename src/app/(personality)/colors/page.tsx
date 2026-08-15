"use client";

import { usePersonality } from "@/lib/personality/context";
import { ColorSurvey } from "@/components/personality/colors/ColorSurvey";
import { ColorResult } from "@/components/personality/colors/ColorResult";

export default function ColorsPage() {
  const { mounted, results } = usePersonality();

  if (!mounted) return null;
  if (results.colors) return <ColorResult result={results.colors} />;
  return <ColorSurvey />;
}
