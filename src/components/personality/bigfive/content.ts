import type { BigFiveResult } from "@/lib/personality/types";
import type { BigFiveTrait } from "./questions";

export const TRAIT_LABEL: Record<BigFiveTrait, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Emotional Sensitivity",
};

export const TRAIT_CODE: Record<BigFiveTrait, string> = {
  openness: "OP",
  conscientiousness: "CO",
  extraversion: "EX",
  agreeableness: "AG",
  neuroticism: "ES",
};

interface Level {
  blurb: string;
  strength: string;
  growth: string;
}

const TRAIT_LEVELS: Record<BigFiveTrait, { high: Level; low: Level }> = {
  openness: {
    high: {
      blurb: "You're drawn to novel ideas, art, and abstract thinking over routine and convention.",
      strength: "You bring fresh, unconventional angles to problems everyone else sees the same way.",
      growth: "Can chase the next interesting idea before finishing the current one.",
    },
    low: {
      blurb: "You favor the practical and proven over the abstract and untested.",
      strength: "You stay grounded in what's concrete and demonstrably reliable.",
      growth: "May dismiss an unconventional idea before really considering it.",
    },
  },
  conscientiousness: {
    high: {
      blurb: "You plan ahead, follow through, and hold yourself to a high standard.",
      strength: "People can count on you to deliver on what you said you would.",
      growth: "Standards can tip into perfectionism that slows things down.",
    },
    low: {
      blurb: "You prefer to stay flexible and adapt in the moment rather than plan in detail.",
      strength: "You adapt quickly when plans change and rarely feel boxed in.",
      growth: "Deadlines and routine follow-through can slip without more structure.",
    },
  },
  extraversion: {
    high: {
      blurb: "You draw energy from people and tend to think out loud in a group.",
      strength: "You build momentum and warmth in a room quickly.",
      growth: "May need to consciously build in quieter, low-stimulation time.",
    },
    low: {
      blurb: "You recharge in quieter settings and prefer depth over breadth in conversation.",
      strength: "You bring calm, focused attention to one-on-one conversations.",
      growth: "Can be overlooked in loud group settings unless you push to be heard.",
    },
  },
  agreeableness: {
    high: {
      blurb: "You prioritize harmony and genuinely enjoy helping the people around you.",
      strength: "You build trust and cooperation with people quickly and sincerely.",
      growth: "Can avoid necessary conflict to keep the peace.",
    },
    low: {
      blurb: "You're comfortable prioritizing your own judgment over group consensus.",
      strength: "You'll say the hard, honest thing that keeps a group from fooling itself.",
      growth: "Directness can land as blunt when warmth would land better.",
    },
  },
  neuroticism: {
    high: {
      blurb: "You feel emotions intensely and stay alert to what could go wrong.",
      strength: "Your vigilance catches risks that more relaxed people miss entirely.",
      growth: "Worry can spend energy on things that never end up happening.",
    },
    low: {
      blurb: "You tend to stay calm and emotionally steady, even under real pressure.",
      strength: "You stay level-headed in moments that would rattle most people.",
      growth: "Low urgency can mean real risks get underestimated.",
    },
  },
};

const TRAIT_ORDER: BigFiveTrait[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

export interface BigFiveSummary {
  code: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  growth: string[];
}

export function summarizeBigFive(result: BigFiveResult): BigFiveSummary {
  const ranked = [...TRAIT_ORDER].sort(
    (a, b) => Math.abs(result.scores[b] - 50) - Math.abs(result.scores[a] - 50)
  );
  const top = ranked.slice(0, 3);

  const levelFor = (trait: BigFiveTrait): "high" | "low" =>
    result.scores[trait] >= 50 ? "high" : "low";

  const [primary, secondary] = top;
  const primaryLevel = TRAIT_LEVELS[primary][levelFor(primary)];
  const secondaryLevel = TRAIT_LEVELS[secondary][levelFor(secondary)];

  const code = top.slice(0, 2).map((t) => TRAIT_CODE[t][0]).join("");
  const name = `The ${ARCHETYPE_NOUN[primary][levelFor(primary)]}`;
  const tagline = `${TRAIT_LABEL[primary]} · ${TRAIT_LABEL[secondary]}-led`;

  const description = `${primaryLevel.blurb} ${secondaryLevel.blurb}`;

  const strengths = top.map((t) => TRAIT_LEVELS[t][levelFor(t)].strength);
  const growth = top.map((t) => TRAIT_LEVELS[t][levelFor(t)].growth);

  return { code, name, tagline, description, strengths, growth };
}

const ARCHETYPE_NOUN: Record<BigFiveTrait, { high: string; low: string }> = {
  openness: { high: "Explorer", low: "Realist" },
  conscientiousness: { high: "Organizer", low: "Improviser" },
  extraversion: { high: "Connector", low: "Observer" },
  agreeableness: { high: "Collaborator", low: "Challenger" },
  neuroticism: { high: "Feeler", low: "Anchor" },
};
