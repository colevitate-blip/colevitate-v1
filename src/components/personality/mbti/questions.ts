import type { Dichotomy, MbtiLetter } from "@/lib/personality/types";

export interface MbtiQuestion {
  id: string;
  dichotomy: Dichotomy;
  poleA: MbtiLetter;
  poleB: MbtiLetter;
  prompt: string;
  statementA: string;
  statementB: string;
  /** core = shown in the short starter set; extended = only shown if the user opts into higher accuracy. */
  tier: "core" | "extended";
  /** Plain-language example shown behind the "Explain this question" toggle. */
  example: string;
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  {
    id: "ei-1",
    dichotomy: "EI",
    poleA: "E",
    poleB: "I",
    prompt: "After a long, demanding week, what actually recharges you?",
    statementA: "Making plans with people — being around others restores my energy.",
    statementB: "A quiet night alone, or with one close person, is what refuels me.",
    tier: "core",
    example:
      "Think about last Friday night after a rough week — did you want to text friends and go out, or did the idea of seeing anyone sound exhausting?",
  },
  {
    id: "ei-2",
    dichotomy: "EI",
    poleA: "E",
    poleB: "I",
    prompt: "In a group discussion, you tend to...",
    statementA: "think out loud, working out your ideas as you speak.",
    statementB: "process internally first, then share once your thoughts feel complete.",
    tier: "extended",
    example:
      "In a meeting, do you jump in mid-thought and figure out what you mean as you talk, or stay quiet until you've worked it out in your head?",
  },
  {
    id: "ei-3",
    dichotomy: "EI",
    poleA: "E",
    poleB: "I",
    prompt: "At a gathering full of people you don't know, you're more likely to...",
    statementA: "work the room and strike up conversations with new people.",
    statementB: "stick with one or two familiar faces, or find a quieter corner.",
    tier: "extended",
    example:
      "Picture walking into a party where you only know the host — do you start introducing yourself around, or look for someone you already know?",
  },
  {
    id: "sn-1",
    dichotomy: "SN",
    poleA: "S",
    poleB: "N",
    prompt: "When learning something new, you'd rather...",
    statementA: "start with concrete facts, examples, and hands-on practice.",
    statementB: "start with the big-picture concept and how the pieces connect.",
    tier: "core",
    example:
      "Learning a new tool at work — do you want a step-by-step walkthrough first, or an explanation of how the whole system fits together?",
  },
  {
    id: "sn-2",
    dichotomy: "SN",
    poleA: "S",
    poleB: "N",
    prompt: "You tend to place more trust in...",
    statementA: "direct experience and what has already been proven to work.",
    statementB: "hunches and patterns you sense, even without hard proof yet.",
    tier: "extended",
    example:
      "A friend proposes a plan that 'feels right' but isn't tested yet — are you skeptical until you see it work, or willing to trust the instinct?",
  },
  {
    id: "sn-3",
    dichotomy: "SN",
    poleA: "S",
    poleB: "N",
    prompt: "Which compliment lands closer to home?",
    statementA: "\"You're so realistic and detail-oriented.\"",
    statementB: "\"You're so imaginative and always thinking ahead.\"",
    tier: "extended",
    example: "If a coworker described you to someone else in one line, which of these two would feel more accurate?",
  },
  {
    id: "tf-1",
    dichotomy: "TF",
    poleA: "T",
    poleB: "F",
    prompt: "A friend asks for advice about a risky job offer. What's your first instinct?",
    statementA: "Walk through the numbers and trade-offs with them, objectively.",
    statementB: "Ask how it feels to them and whether it fits their life right now.",
    tier: "core",
    example:
      "Same scenario: your friend is torn between a stable job and a risky, exciting one. What's the very first thing you'd want to talk through with them?",
  },
  {
    id: "tf-2",
    dichotomy: "TF",
    poleA: "T",
    poleB: "F",
    prompt: "You're more easily persuaded by...",
    statementA: "a well-reasoned argument, even when it's delivered bluntly.",
    statementB: "an argument that's delivered with empathy and tact.",
    tier: "extended",
    example:
      "Two people give you the same advice — one is blunt but logically airtight, the other is kind but a little vague. Which one actually changes your mind?",
  },
  {
    id: "tf-3",
    dichotomy: "TF",
    poleA: "T",
    poleB: "F",
    prompt: "When giving someone feedback, you tend to...",
    statementA: "prioritize honesty and directness, even if it stings a little.",
    statementB: "soften the delivery so the person's feelings stay protected.",
    tier: "extended",
    example:
      "A teammate's work has a real problem in it. Do you name the problem plainly, or lead with what's working before easing into it?",
  },
  {
    id: "jp-1",
    dichotomy: "JP",
    poleA: "J",
    poleB: "P",
    prompt: "Your ideal weekend looks like...",
    statementA: "planned out in advance, so you know what's happening and when.",
    statementB: "open-ended, so you can decide what to do as the mood strikes.",
    tier: "core",
    example:
      "It's Friday evening with a free weekend ahead — does having Saturday and Sunday already mapped out sound relaxing, or does it sound limiting?",
  },
  {
    id: "jp-2",
    dichotomy: "JP",
    poleA: "J",
    poleB: "P",
    prompt: "With a deadline approaching, you're more likely to...",
    statementA: "have already made steady progress and finish comfortably early.",
    statementB: "feel most productive in a focused push close to the deadline.",
    tier: "extended",
    example:
      "Looking back at past deadlines — was your work usually done days ahead, or finished in a late push right before it was due?",
  },
  {
    id: "jp-3",
    dichotomy: "JP",
    poleA: "J",
    poleB: "P",
    prompt: "Which describes you better?",
    statementA: "I like closure — once a decision is made, I move on.",
    statementB: "I like keeping my options open for as long as possible.",
    tier: "extended",
    example:
      "Booking a trip: do you lock in the dates and plans as soon as possible, or leave things flexible until the last minute?",
  },
];
