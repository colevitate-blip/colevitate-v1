import { MBTI_CONTENT } from "@/components/personality/mbti/content";
import { summarizeBigFive } from "@/components/personality/bigfive/content";
import { HD_CONTENT } from "@/components/personality/humandesign/content";
import { COLOR_CONTENT } from "@/components/personality/colors/content";
import type {
  BigFiveResult,
  ColorResult,
  HumanDesignResult,
  MbtiResult,
} from "@/lib/personality/types";

// Normalizes each framework's differently-shaped result into one common
// view model so every design concept only needs to build ONE themed
// result screen, not four.
export interface ResultView {
  code: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  growth: string[];
  traits: { label: string; value: number; caption?: string }[];
}

export function mbtiResultView(result: MbtiResult): ResultView {
  const c = MBTI_CONTENT[result.type];
  return {
    code: c.code,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    strengths: c.strengths,
    growth: c.growth,
    traits: (Object.entries(result.scores) as [string, { pole: string; confidence: number }][]).map(
      ([dichotomy, s]) => ({
        label: dichotomy,
        value: Math.round(s.confidence),
        caption: s.pole,
      })
    ),
  };
}

export function bigFiveResultView(result: BigFiveResult): ResultView {
  const s = summarizeBigFive(result);
  return {
    code: s.code,
    name: s.name,
    tagline: s.tagline,
    description: s.description,
    strengths: s.strengths,
    growth: s.growth,
    traits: Object.entries(result.scores).map(([trait, value]) => ({
      label: trait,
      value: Math.round(value),
    })),
  };
}

export function humanDesignResultView(result: HumanDesignResult): ResultView {
  const c = HD_CONTENT[result.type];
  const max = Math.max(1, ...Object.values(result.scores));
  return {
    code: c.code,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    strengths: c.strengths,
    growth: c.growth,
    traits: Object.entries(result.scores).map(([type, value]) => ({
      label: type,
      value: Math.round((value / max) * 100),
    })),
  };
}

export function colorResultView(result: ColorResult): ResultView {
  const c = COLOR_CONTENT[result.dominant];
  const max = Math.max(1, ...Object.values(result.scores));
  return {
    code: result.dominant.slice(0, 1).toUpperCase(),
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    strengths: c.strengths,
    growth: c.growth,
    traits: Object.entries(result.scores).map(([color, value]) => ({
      label: color,
      value: Math.round((value / max) * 100),
    })),
  };
}
