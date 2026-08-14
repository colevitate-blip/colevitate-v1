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
}

export const BIG_FIVE_QUESTIONS: BigFiveQuestion[] = [
  {
    id: "o-1",
    trait: "openness",
    statement: "I enjoy exploring abstract ideas and unconventional ways of thinking.",
  },
  {
    id: "o-2",
    trait: "openness",
    statement: "I'd rather stick to familiar routines than try something untested.",
    reverse: true,
  },
  {
    id: "c-1",
    trait: "conscientiousness",
    statement: "I like to plan things out in detail before I start.",
  },
  {
    id: "c-2",
    trait: "conscientiousness",
    statement: "I often leave tasks unfinished or put things off until the last minute.",
    reverse: true,
  },
  {
    id: "e-1",
    trait: "extraversion",
    statement: "Being around other people gives me energy.",
  },
  {
    id: "e-2",
    trait: "extraversion",
    statement: "I find large social gatherings draining rather than energizing.",
    reverse: true,
  },
  {
    id: "a-1",
    trait: "agreeableness",
    statement: "I go out of my way to make sure the people around me feel comfortable.",
  },
  {
    id: "a-2",
    trait: "agreeableness",
    statement: "I'm more focused on my own interests than on keeping others happy.",
    reverse: true,
  },
  {
    id: "n-1",
    trait: "neuroticism",
    statement: "I tend to worry about things even when there's no clear reason to.",
  },
  {
    id: "n-2",
    trait: "neuroticism",
    statement: "I generally stay calm and level-headed, even under real pressure.",
    reverse: true,
  },
];
