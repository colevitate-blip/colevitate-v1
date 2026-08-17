"use client";

import { useTranslations } from "next-intl";
import { usePersonality } from "@/lib/personality/context";
import { MbtiSurvey } from "@/components/personality/mbti/MbtiSurvey";
import { MbtiResult } from "@/components/personality/mbti/MbtiResult";
import { AnalyzingScreen } from "@/components/personality/shared/AnalyzingScreen";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";

export default function MbtiPage() {
  const { mounted, results, analyzingId } = usePersonality();
  const t = useTranslations("mbtiSurvey");

  if (!mounted) return null;
  if (analyzingId === "mbti") {
    return <AnalyzingScreen label={t("title")} accent={ASSESSMENT_THEME.mbti} />;
  }
  if (results.mbti) return <MbtiResult result={results.mbti} />;
  return <MbtiSurvey />;
}
