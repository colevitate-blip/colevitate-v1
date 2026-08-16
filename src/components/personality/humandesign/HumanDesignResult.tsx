"use client";

import { Compass } from "lucide-react";
import { ResultShell } from "@/components/personality/shared/ResultShell";
import { ResultBadge } from "@/components/personality/shared/ResultBadge";
import { TraitBar } from "@/components/personality/shared/TraitBar";
import { MiddleGroundNote } from "@/components/personality/shared/MiddleGroundNote";
import { usePersonality } from "@/lib/personality/context";
import { ASSESSMENT_THEME } from "@/lib/personality/theme";
import { cn } from "@/lib/utils";
import type { HumanDesignResult as HdResultType, HumanDesignType } from "@/lib/personality/types";
import { HD_CONTENT } from "./content";

const TYPE_ORDER: HumanDesignType[] = [
  "generator",
  "manifesting-generator",
  "manifestor",
  "projector",
  "reflector",
];

export function HumanDesignResult({ result }: { result: HdResultType }) {
  const { resetAssessment } = usePersonality();
  const accent = ASSESSMENT_THEME.humandesign;
  const content = HD_CONTENT[result.type];
  const maxScore = Math.max(1, ...Object.values(result.scores));
  const ranked = [...TYPE_ORDER].sort((a, b) => result.scores[b] - result.scores[a]);
  const isCloseCall = ranked.length > 1 && maxScore - result.scores[ranked[1]] <= maxScore * 0.15;

  return (
    <ResultShell
      eyebrow="Human Design"
      typeName={content.name}
      tagline={content.tagline}
      description={content.description}
      strengths={content.strengths}
      growth={content.growth}
      accent={accent}
      badge={<ResultBadge code={content.code} gradient={accent.gradient} />}
      onRetake={() => resetAssessment("humandesign")}
      extra={
        <div className="space-y-6">
          <div className={cn("flex items-start gap-3 rounded-2xl border p-4", accent.border)}>
            <Compass className={cn("mt-0.5 size-5 shrink-0", accent.text)} />
            <p className="text-sm leading-relaxed">{content.strategy}</p>
          </div>
          {isCloseCall ? (
            <MiddleGroundNote
              label={`${content.name.replace("The ", "")} / ${HD_CONTENT[ranked[1]].name.replace("The ", "")}`}
              accent={accent}
            />
          ) : null}
          <div className="space-y-4">
            {TYPE_ORDER.map((type) => (
              <TraitBar
                key={type}
                label={HD_CONTENT[type].name.replace("The ", "")}
                value={(result.scores[type] / maxScore) * 100}
                gradient={accent.gradient}
              />
            ))}
          </div>
        </div>
      }
      footnote={
        result.skippedQuestionIds?.length
          ? `Traditional Human Design charts are calculated from an exact birth date, time, and location. This is a simplified self-reflection quiz inspired by its energy types and strategies — not a calculated bodygraph. You skipped ${result.skippedQuestionIds.length} question${result.skippedQuestionIds.length === 1 ? "" : "s"}, which weren't counted toward any type.`
          : "Traditional Human Design charts are calculated from an exact birth date, time, and location. This is a simplified self-reflection quiz inspired by its energy types and strategies — not a calculated bodygraph."
      }
    />
  );
}
