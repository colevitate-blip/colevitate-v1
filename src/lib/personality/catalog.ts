import { Brain, Waves, Orbit, Palette } from "lucide-react";
import type { AssessmentId } from "./types";

export const ASSESSMENT_CATALOG: Record<
  AssessmentId,
  {
    label: string;
    tagline: string;
    description: string;
    icon: typeof Brain;
    slug: string;
    questionCount: number;
  }
> = {
  mbti: {
    label: "16 Personalities",
    tagline: "Cognitive style & type",
    description:
      "A 4-letter typology across how you focus your energy, take in information, make decisions, and structure your life.",
    icon: Brain,
    slug: "mbti",
    questionCount: 12,
  },
  bigfive: {
    label: "Big Five",
    tagline: "The OCEAN model",
    description:
      "The most research-backed model in personality science — five broad traits scored on a continuous spectrum.",
    icon: Waves,
    slug: "big-five",
    questionCount: 10,
  },
  humandesign: {
    label: "Human Design",
    tagline: "Energy type & strategy",
    description:
      "A simplified self-reflection quiz inspired by Human Design's energy types, decision strategy, and inner authority.",
    icon: Orbit,
    slug: "human-design",
    questionCount: 10,
  },
  colors: {
    label: "4 Color Types",
    tagline: "Red · Blue · Green · Yellow",
    description:
      "A fast, visual read on your dominant behavioral style — driven, analytical, supportive, or expressive.",
    icon: Palette,
    slug: "colors",
    questionCount: 12,
  },
};

export const ASSESSMENT_ORDER: AssessmentId[] = ["mbti", "bigfive", "humandesign", "colors"];
