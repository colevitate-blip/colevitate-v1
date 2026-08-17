"use client";

import { useTranslations } from "next-intl";
import { ResultShell } from "@/components/personality/shared/ResultShell";
import { ResultBadge } from "@/components/personality/shared/ResultBadge";
import { TraitBar } from "@/components/personality/shared/TraitBar";
import { MiddleGroundNote } from "@/components/personality/shared/MiddleGroundNote";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { MbtiResult as MbtiResultType } from "@/lib/personality/types";

const LOW_CONFIDENCE_THRESHOLD = 60;

const DICHOTOMY_ORDER: Array<keyof MbtiResultType["scores"]> = ["EI", "SN", "TF", "JP"];
const POLES: Record<keyof MbtiResultType["scores"], [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

export function MbtiResult({ result }: { result: MbtiResultType }) {
  const { resetAssessment } = usePersonality();
  const accent = ASSESSMENT_THEME.mbti;
  const t = useTranslations("mbtiSurvey");
  const tFootnote = useTranslations("mbtiResult");
  const tTypes = useTranslations("mbti.types");
  const tLetters = useTranslations("mbti.letters");
  const strengths = [0, 1, 2, 3].map((i) => tTypes(`${result.type}.strengths.${i}`));
  const growth = [0, 1, 2].map((i) => tTypes(`${result.type}.growth.${i}`));

  const skippedCount = result.skippedQuestionIds?.length ?? 0;

  return (
    <ResultShell
      eyebrow={t("title")}
      typeName={tTypes(`${result.type}.name`)}
      tagline={tTypes(`${result.type}.tagline`)}
      description={tTypes(`${result.type}.description`)}
      strengths={strengths}
      growth={growth}
      accent={accent}
      badge={<ResultBadge code={result.type} gradient={accent.gradient} />}
      onRetake={() => resetAssessment("mbti")}
      extra={
        <div className="grid gap-5 sm:grid-cols-2">
          {DICHOTOMY_ORDER.map((d) => {
            const { pole, confidence } = result.scores[d];
            const [a, b] = POLES[d];
            return (
              <div key={d}>
                <TraitBar
                  label={tLetters(pole)}
                  value={confidence}
                  gradient={accent.gradient}
                  leftCaption={tLetters(a)}
                  rightCaption={tLetters(b)}
                />
                {confidence < LOW_CONFIDENCE_THRESHOLD ? (
                  <MiddleGroundNote poleA={tLetters(a)} poleB={tLetters(b)} accent={accent} />
                ) : null}
              </div>
            );
          })}
        </div>
      }
      footnote={tFootnote("footnoteBase") + (skippedCount > 0 ? tFootnote("footnoteSkipped", { count: skippedCount }) : "")}
    />
  );
}
