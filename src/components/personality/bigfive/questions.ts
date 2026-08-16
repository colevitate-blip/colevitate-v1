export type BigFiveTrait =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

export interface BigFiveQuestion {
  id: string;
  trait: BigFiveTrait;
  statement: string;
  reverse?: boolean;
  tier: "core" | "extended";
  example: string;
  /** "slider" renders a continuous 1-5 control instead of the default 5-button scale. */
  format?: "scale" | "slider";
}

// Statements are written as concrete situations to agree/disagree with, rather than abstract
// self-ratings ("I am creative") — easier to answer accurately and less prone to social-desirability bias.
export const BIG_FIVE_QUESTIONS: BigFiveQuestion[] = [
  {
    id: "o-1",
    trait: "openness",
    statement:
      "When a coworker floats a completely unconventional idea in a meeting, you're the one who gets curious and wants to dig into it further.",
    tier: "core",
    example:
      "Someone on your team pitches an idea that sounds a little out there. Do you lean in and start asking questions, or quietly hope the conversation moves on?",
  },
  {
    id: "o-2",
    trait: "openness",
    statement:
      "Given a free Saturday, you're more likely to return to a routine you already know works than to try something you've never done before.",
    reverse: true,
    tier: "extended",
    example: "Think about your last few free weekends — were they mostly familiar routines, or new experiences?",
  },
  {
    id: "c-1",
    trait: "conscientiousness",
    statement:
      "Before starting a big project, you map out the steps in detail rather than diving in and figuring it out as you go.",
    tier: "core",
    example:
      "A new project lands on your desk with a loose deadline. Is your first move to sketch a plan, or just to start working and adjust as you go?",
  },
  {
    id: "c-2",
    trait: "conscientiousness",
    statement: "More than once, you've realized at 11pm that something due the next morning still isn't done.",
    reverse: true,
    tier: "extended",
    example: "Think honestly about the last few deadlines you had — how often did this actually happen?",
  },
  {
    id: "e-1",
    trait: "extraversion",
    statement: "After hosting or attending a lively get-together, you feel more energized than tired.",
    tier: "core",
    format: "slider",
    example:
      "Picture the end of a long, social night out. Do you feel wired and ready for more, or drained and craving quiet?",
  },
  {
    id: "e-2",
    trait: "extraversion",
    statement: "Halfway through a loud party, you're scanning for the door or a quiet spot to recover.",
    reverse: true,
    tier: "extended",
    example: "At a crowded, noisy event, how long does it usually take before you're looking for an exit or a quieter corner?",
  },
  {
    id: "a-1",
    trait: "agreeableness",
    statement: "When a friend is upset, you'll rearrange your evening to make sure they're okay.",
    tier: "core",
    example: "A close friend texts that they're having a rough night. How readily do you drop your plans to check on them?",
  },
  {
    id: "a-2",
    trait: "agreeableness",
    statement:
      "In a group decision, you'll push for what you actually want even if it means someone else is disappointed.",
    reverse: true,
    tier: "extended",
    example:
      "Your group is deciding where to eat and everyone else wants something you dislike. Do you speak up for your preference, or go along with it?",
  },
  {
    id: "n-1",
    trait: "neuroticism",
    statement:
      "A single unread message from your boss late at night is enough to keep your mind spinning until you know what it says.",
    tier: "core",
    format: "slider",
    example: "You get a vague 'can we talk tomorrow?' message from your manager right before bed. How much does it stay with you overnight?",
  },
  {
    id: "n-2",
    trait: "neuroticism",
    statement: "Even when a deadline is genuinely tight, you find it easy to stay steady and keep working calmly.",
    reverse: true,
    tier: "extended",
    example: "Think of the last time you had a real time-crunch — how steady did you actually feel while working through it?",
  },
];
