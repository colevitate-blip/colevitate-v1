"use client";

import { ResultShell } from "@/components/personality/shared/ResultShell";
import { ResultBadge } from "@/components/personality/shared/ResultBadge";
import { TraitBar } from "@/components/personality/shared/TraitBar";
import { MiddleGroundNote } from "@/components/personality/shared/MiddleGroundNote";
import { usePersonality } from "@/lib/personality/context";
import { COLOR_THEME } from "@/lib/personality/theme";
import type { ColorId, ColorResult as ColorResultType } from "@/lib/personality/types";
import { COLOR_CONTENT } from "./content";

const COLOR_ORDER: ColorId[] = ["red", "blue", "green", "yellow"];

export function ColorResult({ result }: { result: ColorResultType }) {
  const { resetAssessment } = usePersonality();
  const accent = COLOR_THEME[result.dominant];
  const content = COLOR_CONTENT[result.dominant];
  const secondaryLabel = COLOR_THEME[result.secondary].label;
  const total = Math.max(1, ...Object.values(result.scores));
  const isCloseCall = result.scores[result.dominant] - result.scores[result.secondary] <= total * 0.15;

  return (
    <ResultShell
      eyebrow="4 Color Types"
      typeName={content.name}
      tagline={content.tagline}
      description={`${content.description} You also carry a real streak of ${secondaryLabel}, which shows up when ${result.dominant === result.secondary ? "you're at your most balanced." : "your primary style needs a second gear."}`}
      strengths={content.strengths}
      growth={content.growth}
      accent={accent}
      badge={<ResultBadge code={result.dominant.slice(0, 1).toUpperCase()} gradient={accent.gradient} />}
      onRetake={() => resetAssessment("colors")}
      extra={
        <div className="space-y-4">
          {isCloseCall ? (
            <MiddleGroundNote label={`${content.name.replace("The ", "")} / ${secondaryLabel}`} accent={accent} />
          ) : null}
          {COLOR_ORDER.map((color) => (
            <TraitBar
              key={color}
              label={COLOR_THEME[color].label}
              value={(result.scores[color] / total) * 100}
              gradient={COLOR_THEME[color].gradient}
            />
          ))}
        </div>
      }
      footnote={
        result.skippedQuestionIds?.length
          ? `The 4 Color Types model is a simplified behavioral-style framework meant for self-reflection and team conversations, not a clinical assessment. You skipped ${result.skippedQuestionIds.length} question${result.skippedQuestionIds.length === 1 ? "" : "s"}, which weren't counted toward any color.`
          : "The 4 Color Types model is a simplified behavioral-style framework meant for self-reflection and team conversations, not a clinical assessment."
      }
    />
  );
}
