import type { ColorId } from "@/lib/personality/types";

export interface ColorOption {
  id: ColorId;
  label: string;
}

export interface ColorQuestion {
  id: string;
  prompt: string;
  options: ColorOption[];
  tier: "core" | "extended";
  example: string;
  /** "ranking" has the user order all 4 options instead of picking just one, for a stronger signal. */
  format?: "choice" | "ranking";
}

function opts(red: string, blue: string, green: string, yellow: string): ColorOption[] {
  return [
    { id: "red", label: red },
    { id: "blue", label: blue },
    { id: "green", label: green },
    { id: "yellow", label: yellow },
  ];
}

export const COLOR_QUESTIONS: ColorQuestion[] = [
  {
    id: "c-1",
    prompt: "In a team meeting, you're most likely to...",
    tier: "core",
    example: "Picture your last team meeting — which of these four things did you actually do?",
    options: opts(
      "push for a decision and move things along.",
      "ask clarifying questions and check the details first.",
      "make sure everyone's voice gets heard.",
      "bring energy and float a few bold new ideas."
    ),
  },
  {
    id: "c-2",
    prompt: "Rank these from most to least like you: your friends would describe you as...",
    tier: "extended",
    format: "ranking",
    example: "There's no single right answer — just order all four from the one that fits best to the one that fits least.",
    options: opts(
      "direct and results-focused.",
      "thoughtful and precise.",
      "warm and dependable.",
      "fun and spontaneous."
    ),
  },
  {
    id: "c-3",
    prompt: "When plans suddenly change, you...",
    tier: "core",
    example: "Think of the last time plans fell through last-minute — what was your actual first reaction?",
    options: opts(
      "adjust fast and refocus on the new goal.",
      "want to understand why before reacting.",
      "check in on how everyone's feeling about it.",
      "get excited about the new possibilities."
    ),
  },
  {
    id: "c-4",
    prompt: "Under pressure, you tend to...",
    tier: "extended",
    example: "Recall a genuinely stressful moment at work — how did you actually behave, not how you wish you had?",
    options: opts(
      "get more decisive and take charge.",
      "slow down and double-check everything.",
      "seek harmony and avoid escalating tension.",
      "talk it through out loud with someone."
    ),
  },
  {
    id: "c-5",
    prompt: "Your ideal weekend involves...",
    tier: "core",
    example: "If you had a totally free weekend with no obligations, what would you actually gravitate toward?",
    options: opts(
      "achieving something concrete — a project, a goal, a win.",
      "quiet time to think, read, or dig into a topic.",
      "relaxed time with close friends or family.",
      "spontaneous plans and new experiences."
    ),
  },
  {
    id: "c-6",
    prompt: "In conflict, you're most likely to...",
    tier: "extended",
    example: "Think of a recent disagreement with someone close to you — what did you actually do?",
    options: opts(
      "address it head-on, immediately.",
      "step back and think it through before responding.",
      "try to smooth things over and keep the peace.",
      "talk it out openly and move on quickly."
    ),
  },
  {
    id: "c-7",
    prompt: "What motivates you most at work?",
    tier: "core",
    example: "On your best day at work, what was actually happening that made it feel good?",
    options: opts(
      "hitting ambitious goals and winning.",
      "doing the work correctly and thoroughly.",
      "being part of a supportive, stable team.",
      "variety, recognition, and new challenges."
    ),
  },
  {
    id: "c-8",
    prompt: "Rank these from most to least like you: when making decisions, you rely most on...",
    tier: "extended",
    format: "ranking",
    example: "Order all four from the one that best describes how you actually decide, to the one that fits least.",
    options: opts(
      "quick, confident instinct.",
      "careful analysis of the facts.",
      "how the decision affects the people involved.",
      "what feels exciting and full of potential."
    ),
  },
  {
    id: "c-9",
    prompt: "Your workspace tends to be...",
    tier: "core",
    example: "Picture your actual desk or workspace right now — which of these genuinely describes it?",
    options: opts(
      "efficient — whatever helps you move fast.",
      "organized — everything has its place.",
      "personal and cozy — photos, comfortable touches.",
      "colorful and a little chaotic, full of ideas in progress."
    ),
  },
  {
    id: "c-10",
    prompt: "In a new social setting, you...",
    tier: "extended",
    example: "Picture walking into a room of strangers right now — what would you actually do in the first few minutes?",
    options: opts(
      "quickly size up who's who and get to the point.",
      "observe first before deciding to engage.",
      "look for one or two people to connect with genuinely.",
      "work the room and meet as many people as you can."
    ),
  },
  {
    id: "c-11",
    prompt: "Your biggest pet peeve is...",
    tier: "core",
    example: "Of these four, which one would genuinely irritate you the most if it happened today?",
    options: opts(
      "slow decision-making and wasted time.",
      "sloppy, inaccurate work.",
      "conflict and people being unkind to each other.",
      "boredom and rigid rules."
    ),
  },
  {
    id: "c-12",
    prompt: "When giving a presentation, you focus on...",
    tier: "extended",
    example: "Think about the last time you presented something — what did you actually spend the most prep time on?",
    options: opts(
      "the bottom line and the key ask.",
      "the data and the details that back it up.",
      "making sure it feels relatable to the audience.",
      "keeping it engaging, energetic, and memorable."
    ),
  },
];
