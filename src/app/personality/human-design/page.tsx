"use client";

import { usePersonality } from "@/lib/personality/context";
import { HumanDesignSurvey } from "@/components/personality/humandesign/HumanDesignSurvey";
import { HumanDesignResult } from "@/components/personality/humandesign/HumanDesignResult";

export default function HumanDesignPage() {
  const { mounted, results } = usePersonality();

  if (!mounted) return null;
  if (results.humandesign) return <HumanDesignResult result={results.humandesign} />;
  return <HumanDesignSurvey />;
}
