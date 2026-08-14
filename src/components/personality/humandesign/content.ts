import type { HumanDesignType } from "@/lib/personality/types";

export interface HdTypeContent {
  code: string;
  name: string;
  tagline: string;
  strategy: string;
  description: string;
  strengths: string[];
  growth: string[];
}

export const HD_CONTENT: Record<HumanDesignType, HdTypeContent> = {
  generator: {
    code: "GEN",
    name: "The Generator",
    tagline: "Strategy: Respond",
    strategy: "Respond to what's already in front of you, rather than forcing something new into motion.",
    description:
      "Generators carry steady, renewable energy. You're built to do work you genuinely love for long stretches, and you find your way not by chasing plans but by responding honestly to what life puts in front of you.",
    strengths: [
      "Sustains focused effort far longer than most once genuinely engaged",
      "Brings a steady, grounded energy that others can build on",
      "Masters a craft through sheer accumulated, satisfying repetition",
      "Knows almost immediately whether something is a genuine 'yes'",
    ],
    growth: [
      "Staying in work that doesn't spark a real 'yes' drains energy fast",
      "Can default to 'yes' out of habit rather than genuine desire",
      "Frustration builds when initiating instead of responding",
    ],
  },
  "manifesting-generator": {
    code: "MG",
    name: "The Multi-Passionate",
    tagline: "Strategy: Respond, Then Move",
    strategy: "Respond to what excites you, then move fast — skipping steps is often correct for you.",
    description:
      "Manifesting Generators combine a Generator's sustainable energy with a faster, more multi-track pace. You're rarely doing just one thing, and you often reach the destination by an efficient, non-obvious route others wouldn't take.",
    strengths: [
      "Moves quickly between projects without losing overall momentum",
      "Finds efficient shortcuts that purely linear thinkers miss",
      "Masters multiple, seemingly unrelated skills in parallel",
      "Adapts plans mid-course without losing motivation",
    ],
    growth: [
      "Skipping steps can create gaps that surface later",
      "Boredom sets in fast once the novelty of a project fades",
      "Overcommitting across too many fronts can dilute focus",
    ],
  },
  manifestor: {
    code: "MAN",
    name: "The Initiator",
    tagline: "Strategy: Inform, Then Act",
    strategy: "Act on your own initiative, and inform the people affected before you move.",
    description:
      "Manifestors are built to initiate. You don't need permission or a spark from outside to get moving — you generate your own momentum, and things tend to happen because you decided they would.",
    strengths: [
      "Starts things from nothing, without needing outside validation",
      "Moves decisively once your own clarity is set",
      "Unafraid to take an unpopular but necessary first step",
      "Naturally independent in how you plan and execute",
    ],
    growth: [
      "Skipping the 'inform' step creates unnecessary friction with others",
      "Resistance to being told what to do can read as combative",
      "Bursts of intense output need real recovery time after",
    ],
  },
  projector: {
    code: "PRJ",
    name: "The Guide",
    tagline: "Strategy: Wait for the Invitation",
    strategy: "Wait to be recognized and invited before stepping into a role or offering deep guidance.",
    description:
      "Projectors are built to see systems and people clearly from the outside, not to grind through constant output. Your gift is insight and direction — it lands best when it's genuinely invited rather than volunteered.",
    strengths: [
      "Sees the efficient path through a system others are stuck inside",
      "Offers guidance that reliably improves how others work",
      "Reads people and group dynamics with real accuracy",
      "Focuses deeply without needing constant external motion",
    ],
    growth: [
      "Unsolicited advice tends to land poorly, however accurate",
      "Energy runs out faster than non-Projector types around you",
      "Waiting for recognition can feel passive if it isn't paired with visibility",
    ],
  },
  reflector: {
    code: "REF",
    name: "The Mirror",
    tagline: "Strategy: Wait a Lunar Cycle",
    strategy: "Give big decisions real time — traditionally a full lunar cycle — before committing.",
    description:
      "Reflectors are rare and deeply sensitive to their environment, absorbing and reflecting the health of the people and spaces around them. Your clarity comes with time and the right surroundings, not in the pressure of the moment.",
    strengths: [
      "Offers an unusually honest read on a group's or environment's health",
      "Adapts and takes in genuinely different perspectives with ease",
      "Notices what's really going on beneath a surface that looks fine",
      "Brings a rare, wide-lens objectivity to situations others are inside of",
    ],
    growth: [
      "Snap decisions under pressure rarely hold up later",
      "Surroundings affect mood and energy more than most people realize",
      "Can absorb others' emotional state as if it were your own",
    ],
  },
};
