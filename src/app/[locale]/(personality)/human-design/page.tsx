"use client";

import { usePersonality } from "@/lib/personality/context";
import { HumanDesignSurvey } from "@/components/personality/humandesign/HumanDesignSurvey";
import { HumanDesignResult } from "@/components/personality/humandesign/HumanDesignResult";
import { AnalyzingScreen } from "@/components/personality/shared/AnalyzingScreen";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";

export default function HumanDesignPage() {
  const { mounted, results, analyzingId } = usePersonality();

  if (!mounted) return null;
  if (analyzingId === "humandesign") {
    return <AnalyzingScreen label="Human Design" accent={ASSESSMENT_THEME.humandesign} />;
  }
  if (results.humandesign) return <HumanDesignResult result={results.humandesign} />;
  return <HumanDesignSurvey />;
}
