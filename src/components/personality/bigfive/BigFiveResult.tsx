"use client";

import { ResultShell } from "@/components/personality/shared/ResultShell";
import { ResultBadge } from "@/components/personality/shared/ResultBadge";
import { TraitBar } from "@/components/personality/shared/TraitBar";
import { MiddleGroundNote } from "@/components/personality/shared/MiddleGroundNote";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { BigFiveResult as BigFiveResultType } from "@/lib/personality/types";
import { TRAIT_LABEL, summarizeBigFive } from "./content";
import type { BigFiveTrait } from "./questions";

const MIDDLE_RANGE: [number, number] = [40, 60];

const TRAIT_ORDER: BigFiveTrait[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

export function BigFiveResult({ result }: { result: BigFiveResultType }) {
  const { resetAssessment } = usePersonality();
  const accent = ASSESSMENT_THEME.bigfive;
  const summary = summarizeBigFive(result);

  return (
    <ResultShell
      eyebrow="Big Five (OCEAN)"
      typeName={summary.name}
      tagline={summary.tagline}
      description={summary.description}
      strengths={summary.strengths}
      growth={summary.growth}
      accent={accent}
      badge={<ResultBadge code={summary.code} gradient={accent.gradient} />}
      onRetake={() => resetAssessment("bigfive")}
      extra={
        <div className="space-y-5">
          {TRAIT_ORDER.map((trait) => {
            const score = result.scores[trait];
            const isMiddle = score >= MIDDLE_RANGE[0] && score <= MIDDLE_RANGE[1];
            return (
              <div key={trait}>
                <TraitBar label={TRAIT_LABEL[trait]} value={score} gradient={accent.gradient} />
                {isMiddle ? <MiddleGroundNote label={TRAIT_LABEL[trait]} accent={accent} /> : null}
              </div>
            );
          })}
        </div>
      }
      footnote={
        result.skippedQuestionIds?.length
          ? `Big Five (OCEAN) is the personality model with the strongest scientific backing, though this quick quiz is a simplified reflection tool rather than a validated psychometric instrument. You skipped ${result.skippedQuestionIds.length} question${result.skippedQuestionIds.length === 1 ? "" : "s"}, so those traits leaned on a typical average instead.`
          : "Big Five (OCEAN) is the personality model with the strongest scientific backing, though this quick quiz is a simplified reflection tool rather than a validated psychometric instrument."
      }
    />
  );
}
