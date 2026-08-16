import type { HumanDesignType } from "@/lib/personality/types";

export interface HdOption {
  id: string;
  label: string;
  weights: Partial<Record<HumanDesignType, number>>;
  /** Only present on the format:"emoji" question. */
  emoji?: string;
}

export interface HdQuestion {
  id: string;
  prompt: string;
  options: HdOption[];
  tier: "core" | "extended";
  example: string;
  format?: "choice" | "emoji";
}

export const HD_QUESTIONS: HdQuestion[] = [
  {
    id: "hd-1",
    prompt: "When it comes to taking action, you...",
    tier: "core",
    example:
      "A new opportunity comes up out of nowhere. Do you wait to feel a clear pull toward it, jump on it immediately, or need time to read the whole situation first?",
    options: [
      { id: "a", label: "wait until something sparks a clear 'yes' in my gut before I commit.", weights: { generator: 2 } },
      { id: "b", label: "often feel the urge to initiate something new before any invitation arrives.", weights: { manifestor: 2 } },
      { id: "c", label: "move between waiting for a spark and initiating on my own, depending on the moment.", weights: { "manifesting-generator": 2 } },
      { id: "d", label: "hold back and offer direction once I'm specifically invited in.", weights: { projector: 2 } },
      { id: "e", label: "need to take in the whole room over time before I know how I feel about it.", weights: { reflector: 2 } },
    ],
  },
  {
    id: "hd-2",
    prompt: "Your natural energy pattern is best described as...",
    tier: "extended",
    format: "emoji",
    example:
      "Think about a normal work week — does your energy run steady all day, come in intense bursts, move fast between many things, need real downtime, or shift a lot with your surroundings?",
    options: [
      { id: "a", label: "steady and sustainable", weights: { generator: 2, "manifesting-generator": 1 }, emoji: "🔋" },
      { id: "b", label: "intense bursts, then real recovery", weights: { manifestor: 2 }, emoji: "⚡" },
      { id: "c", label: "fast and varied, rarely one lane", weights: { "manifesting-generator": 2 }, emoji: "🌪️" },
      { id: "d", label: "focused bursts, real downtime needed", weights: { projector: 2 }, emoji: "🎯" },
      { id: "e", label: "highly variable with people/place", weights: { reflector: 2 }, emoji: "🌊" },
    ],
  },
  {
    id: "hd-3",
    prompt: "You're deeply satisfied at work when...",
    tier: "core",
    example: "Think of the last time work felt genuinely satisfying — what was actually happening in that moment?",
    options: [
      { id: "a", label: "I'm fully absorbed in something I genuinely love doing.", weights: { generator: 2 } },
      { id: "b", label: "I got something new off the ground, on my own terms.", weights: { manifestor: 2 } },
      { id: "c", label: "I juggled several different things and did them all well.", weights: { "manifesting-generator": 2 } },
      { id: "d", label: "my insight or guidance was recognized and genuinely valued.", weights: { projector: 2 } },
      { id: "e", label: "I felt completely in sync with the people and environment around me.", weights: { reflector: 2 } },
    ],
  },
  {
    id: "hd-4",
    prompt: "How do you feel about being told what to do?",
    tier: "extended",
    example: "A manager assigns you a task with very specific instructions on how to do it. What's your honest reaction?",
    options: [
      { id: "a", label: "Fine, as long as it's something I actually feel a 'yes' toward.", weights: { generator: 2 } },
      { id: "b", label: "I resist it — I'd rather inform people of my plan than take direction.", weights: { manifestor: 2 } },
      { id: "c", label: "Depends on the day — sometimes I want autonomy, sometimes direction helps.", weights: { "manifesting-generator": 1, projector: 1 } },
      { id: "d", label: "I do best when someone actually invites my input rather than assumes it.", weights: { projector: 2 } },
      { id: "e", label: "I need to sit with it a while before I know how I feel.", weights: { reflector: 2 } },
    ],
  },
  {
    id: "hd-5",
    prompt: "Which frustration hits closest to home?",
    tier: "core",
    example: "Of these five annoyances, which one would actually ruin your week if it kept happening?",
    options: [
      { id: "a", label: "Doing work that doesn't actually light me up, just to get by.", weights: { generator: 2 } },
      { id: "b", label: "Being boxed in or told to wait when I already know what to do.", weights: { manifestor: 2 } },
      { id: "c", label: "Getting bored the moment something stops being novel.", weights: { "manifesting-generator": 2 } },
      { id: "d", label: "Giving great advice that nobody asked for or acted on.", weights: { projector: 2 } },
      { id: "e", label: "Feeling like an outsider in spaces that don't reflect who I am.", weights: { reflector: 2 } },
    ],
  },
  {
    id: "hd-6",
    prompt: "In a group project, you naturally become the one who...",
    tier: "extended",
    example: "Think back to the last group project you were part of — what role did you actually end up playing?",
    options: [
      { id: "a", label: "does the bulk of the hands-on work once genuinely engaged.", weights: { generator: 2 } },
      { id: "b", label: "gets things moving and sets direction, even before roles are decided.", weights: { manifestor: 2 } },
      { id: "c", label: "ends up across multiple work-streams, connecting the dots.", weights: { "manifesting-generator": 2 } },
      { id: "d", label: "sees the big picture and helps others work smarter.", weights: { projector: 2 } },
      { id: "e", label: "reflects the mood of the group back to itself, for better or worse.", weights: { reflector: 2 } },
    ],
  },
  {
    id: "hd-7",
    prompt: "Rest, for you, is...",
    tier: "core",
    example: "How do you actually feel about downtime — is it a nice bonus, or something you'd fall apart without?",
    options: [
      { id: "a", label: "something I need after a genuinely full day of doing what I love.", weights: { generator: 1 } },
      { id: "b", label: "essential after an intense push — I crash hard without it.", weights: { manifestor: 1 } },
      { id: "c", label: "something I have to schedule deliberately, or I'll just keep moving.", weights: { "manifesting-generator": 1 } },
      { id: "d", label: "non-negotiable — I burn out fast without real alone time.", weights: { projector: 2 } },
      { id: "e", label: "deeply affected by where I am and who I'm with.", weights: { reflector: 1 } },
    ],
  },
  {
    id: "hd-8",
    prompt: "When making a big decision, you trust most...",
    tier: "extended",
    example: "Think of the last big decision you made well — what actually tipped the scale for you?",
    options: [
      { id: "a", label: "my gut response in the moment — a clear body 'yes' or 'no.'", weights: { generator: 2, "manifesting-generator": 1 } },
      { id: "b", label: "my own clarity — I decide, then act, without needing outside validation.", weights: { manifestor: 2 } },
      { id: "c", label: "how I feel once the emotional wave settles, not the first reaction.", weights: { projector: 1, reflector: 1 } },
      { id: "d", label: "time — I genuinely need to sit with big decisions, sometimes for weeks.", weights: { reflector: 2 } },
      { id: "e", label: "a mix of gut instinct and quick logic, depending on the decision.", weights: { "manifesting-generator": 2 } },
    ],
  },
  {
    id: "hd-9",
    prompt: "People often come to you for...",
    tier: "core",
    example: "If a friend needed help, what's the actual reason they'd come to you specifically?",
    options: [
      { id: "a", label: "getting things actually done — you follow through.", weights: { generator: 2 } },
      { id: "b", label: "bold direction — you're not afraid to lead the charge.", weights: { manifestor: 2 } },
      { id: "c", label: "a bit of everything — you're the most versatile person they know.", weights: { "manifesting-generator": 2 } },
      { id: "d", label: "clarity and perspective — you see what others miss.", weights: { projector: 2 } },
      { id: "e", label: "an honest read on the room — you mirror what's really going on.", weights: { reflector: 2 } },
    ],
  },
  {
    id: "hd-10",
    prompt: "Which statement feels most true?",
    tier: "extended",
    example: "Picture the last time you felt genuinely 'on track' in life — which of these best explains why?",
    options: [
      { id: "a", label: "I know I'm on the right path when the work itself feels satisfying.", weights: { generator: 2 } },
      { id: "b", label: "I know I'm on the right path when I've made something happen from nothing.", weights: { manifestor: 2 } },
      { id: "c", label: "I know I'm on the right path when I'm energized across several fronts at once.", weights: { "manifesting-generator": 2 } },
      { id: "d", label: "I know I'm on the right path when the right invitation finally arrives.", weights: { projector: 2 } },
      { id: "e", label: "I know I'm on the right path when I feel at peace with my surroundings.", weights: { reflector: 2 } },
    ],
  },
];
