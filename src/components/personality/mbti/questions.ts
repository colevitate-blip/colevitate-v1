import type { Dichotomy, MbtiLetter } from "@/lib/personality/types";

export interface MbtiQuestion {
  id: string;
  dichotomy: Dichotomy;
  poleA: MbtiLetter;
  poleB: MbtiLetter;
  prompt: string;
  statementA: string;
  statementB: string;
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
  },
  {
    id: "ei-2",
    dichotomy: "EI",
    poleA: "E",
    poleB: "I",
    prompt: "In a group discussion, you tend to...",
    statementA: "think out loud, working out your ideas as you speak.",
    statementB: "process internally first, then share once your thoughts feel complete.",
  },
  {
    id: "ei-3",
    dichotomy: "EI",
    poleA: "E",
    poleB: "I",
    prompt: "At a gathering full of people you don't know, you're more likely to...",
    statementA: "work the room and strike up conversations with new people.",
    statementB: "stick with one or two familiar faces, or find a quieter corner.",
  },
  {
    id: "sn-1",
    dichotomy: "SN",
    poleA: "S",
    poleB: "N",
    prompt: "When learning something new, you'd rather...",
    statementA: "start with concrete facts, examples, and hands-on practice.",
    statementB: "start with the big-picture concept and how the pieces connect.",
  },
  {
    id: "sn-2",
    dichotomy: "SN",
    poleA: "S",
    poleB: "N",
    prompt: "You tend to place more trust in...",
    statementA: "direct experience and what has already been proven to work.",
    statementB: "hunches and patterns you sense, even without hard proof yet.",
  },
  {
    id: "sn-3",
    dichotomy: "SN",
    poleA: "S",
    poleB: "N",
    prompt: "Which compliment lands closer to home?",
    statementA: "\"You're so realistic and detail-oriented.\"",
    statementB: "\"You're so imaginative and always thinking ahead.\"",
  },
  {
    id: "tf-1",
    dichotomy: "TF",
    poleA: "T",
    poleB: "F",
    prompt: "When someone brings you a problem, your first instinct is to...",
    statementA: "analyze it logically and identify the most objective solution.",
    statementB: "consider how everyone involved feels and protect the relationship.",
  },
  {
    id: "tf-2",
    dichotomy: "TF",
    poleA: "T",
    poleB: "F",
    prompt: "You're more easily persuaded by...",
    statementA: "a well-reasoned argument, even when it's delivered bluntly.",
    statementB: "an argument that's delivered with empathy and tact.",
  },
  {
    id: "tf-3",
    dichotomy: "TF",
    poleA: "T",
    poleB: "F",
    prompt: "When giving someone feedback, you tend to...",
    statementA: "prioritize honesty and directness, even if it stings a little.",
    statementB: "soften the delivery so the person's feelings stay protected.",
  },
  {
    id: "jp-1",
    dichotomy: "JP",
    poleA: "J",
    poleB: "P",
    prompt: "Your ideal weekend looks like...",
    statementA: "planned out in advance, so you know what's happening and when.",
    statementB: "open-ended, so you can decide what to do as the mood strikes.",
  },
  {
    id: "jp-2",
    dichotomy: "JP",
    poleA: "J",
    poleB: "P",
    prompt: "With a deadline approaching, you're more likely to...",
    statementA: "have already made steady progress and finish comfortably early.",
    statementB: "feel most productive in a focused push close to the deadline.",
  },
  {
    id: "jp-3",
    dichotomy: "JP",
    poleA: "J",
    poleB: "P",
    prompt: "Which describes you better?",
    statementA: "I like closure — once a decision is made, I move on.",
    statementB: "I like keeping my options open for as long as possible.",
  },
];
