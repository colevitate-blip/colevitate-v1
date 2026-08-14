"use client";

import { ResultShell } from "@/components/personality/shared/ResultShell";
import { ResultBadge } from "@/components/personality/shared/ResultBadge";
import { TraitBar } from "@/components/personality/shared/TraitBar";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import type { MbtiResult as MbtiResultType } from "@/lib/personality/types";
import { MBTI_CONTENT, MBTI_LETTER_NAMES } from "./content";

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
  const content = MBTI_CONTENT[result.type];

  return (
    <ResultShell
      eyebrow="16 Personalities"
      typeName={`${content.name}`}
      tagline={content.tagline}
      description={content.description}
      strengths={content.strengths}
      growth={content.growth}
      accent={accent}
      badge={<ResultBadge code={result.type} gradient={accent.gradient} />}
      onRetake={() => resetAssessment("mbti")}
      extra={
        <div className="grid gap-5 sm:grid-cols-2">
          {DICHOTOMY_ORDER.map((d) => {
            const { pole, confidence } = result.scores[d];
            const [a, b] = POLES[d];
            return (
              <TraitBar
                key={d}
                label={MBTI_LETTER_NAMES[pole]}
                value={confidence}
                gradient={accent.gradient}
                leftCaption={MBTI_LETTER_NAMES[a]}
                rightCaption={MBTI_LETTER_NAMES[b]}
              />
            );
          })}
        </div>
      }
      footnote="This is a self-report reflection tool inspired by Jungian typology, meant for self-insight and conversation — not a clinical or scientific instrument."
    />
  );
}
