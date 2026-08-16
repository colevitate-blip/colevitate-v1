import type { AssessmentId, ColorId, PersonalityResults } from "./types";

export interface AccentTheme {
  gradient: string;
  softBg: string;
  ring: string;
  text: string;
  solid: string;
  border: string;
}

export const ASSESSMENT_THEME: Record<AssessmentId, AccentTheme> = {
  mbti: {
    gradient: "from-violet-500 via-indigo-500 to-blue-500",
    softBg: "bg-violet-500/10",
    ring: "ring-violet-500/30",
    text: "text-violet-600 dark:text-violet-400",
    solid: "bg-violet-500",
    border: "border-violet-500/30",
  },
  bigfive: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    softBg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    solid: "bg-emerald-500",
    border: "border-emerald-500/30",
  },
  humandesign: {
    gradient: "from-fuchsia-500 via-purple-500 to-rose-500",
    softBg: "bg-fuchsia-500/10",
    ring: "ring-fuchsia-500/30",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    solid: "bg-fuchsia-500",
    border: "border-fuchsia-500/30",
  },
  colors: {
    gradient: "from-red-500 via-yellow-500 to-blue-500",
    softBg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    solid: "bg-amber-500",
    border: "border-amber-500/30",
  },
};

export const COLOR_THEME: Record<
  ColorId,
  { label: string; gradient: string; solid: string; text: string; softBg: string; ring: string; border: string }
> = {
  red: {
    label: "Red",
    gradient: "from-red-500 to-rose-600",
    solid: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    softBg: "bg-red-500/10",
    ring: "ring-red-500/30",
    border: "border-red-500/30",
  },
  blue: {
    label: "Blue",
    gradient: "from-blue-500 to-indigo-600",
    solid: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    softBg: "bg-blue-500/10",
    ring: "ring-blue-500/30",
    border: "border-blue-500/30",
  },
  green: {
    label: "Green",
    gradient: "from-emerald-500 to-green-600",
    solid: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
    border: "border-emerald-500/30",
  },
  yellow: {
    label: "Yellow",
    gradient: "from-amber-400 to-yellow-500",
    solid: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-400/10",
    ring: "ring-amber-400/30",
    border: "border-amber-400/30",
  },
};

// The 4 Color Types framework's accent should reflect the user's actual
// dominant color, not a generic "colors" gradient — every other framework
// has a single fixed accent regardless of the user's result.
export function accentForFramework(id: AssessmentId, results: PersonalityResults): AccentTheme {
  if (id === "colors" && results.colors) return COLOR_THEME[results.colors.dominant];
  return ASSESSMENT_THEME[id];
}
