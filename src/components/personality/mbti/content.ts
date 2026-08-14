export const MBTI_LETTER_NAMES: Record<string, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
};

export interface MbtiTypeContent {
  code: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  growth: string[];
}

export const MBTI_CONTENT: Record<string, MbtiTypeContent> = {
  INTJ: {
    code: "INTJ",
    name: "The Strategist",
    tagline: "Independent · Visionary · Exacting",
    description:
      "INTJs think in systems and long horizons. You form an independent, well-reasoned view of where things are headed, and you have the discipline to work steadily toward it, often years ahead of everyone else.",
    strengths: [
      "Sees the structural pattern behind complex problems others find overwhelming",
      "Sets ambitious long-term goals and follows through with quiet consistency",
      "Comfortable making unpopular calls when the logic supports them",
      "Constantly refines ideas rather than settling for a good-enough answer",
    ],
    growth: [
      "Can come across as detached when others need emotional acknowledgment first",
      "May dismiss input that doesn't arrive as a well-formed argument",
      "Perfectionism can delay shipping something that was already good enough",
    ],
  },
  INTP: {
    code: "INTP",
    name: "The Analyst",
    tagline: "Curious · Logical · Independent",
    description:
      "INTPs are driven by the pull of an interesting problem. You'd rather deeply understand how something works than move fast on a shallow read, and you're most alive when taking an idea apart to see what holds it together.",
    strengths: [
      "Spots logical inconsistencies and edge cases others miss",
      "Generates original frameworks rather than reaching for the obvious answer",
      "Comfortable saying 'I don't know yet' instead of faking certainty",
      "Brings rigor to decisions that others make on instinct alone",
    ],
    growth: [
      "Analysis can loop indefinitely without converging on a decision",
      "Follow-through on routine tasks can lag behind the quality of your ideas",
      "May forget to communicate reasoning that feels obvious internally",
    ],
  },
  ENTJ: {
    code: "ENTJ",
    name: "The Commander",
    tagline: "Decisive · Strategic · Driven",
    description:
      "ENTJs turn ambiguity into a plan. You naturally see the most efficient path from where things stand to where they need to go, and you mobilize people and resources to get there without much hand-wringing.",
    strengths: [
      "Makes clear decisions quickly, even with incomplete information",
      "Organizes people and resources around a shared, ambitious goal",
      "Delivers direct feedback that moves projects forward",
      "Treats setbacks as data, not as reasons to slow down",
    ],
    growth: [
      "Can steamroll quieter voices before hearing their full input",
      "Impatience with process can undercut buy-in from the team",
      "May undervalue the emotional cost of a purely efficient decision",
    ],
  },
  ENTP: {
    code: "ENTP",
    name: "The Innovator",
    tagline: "Inventive · Quick-witted · Contrarian",
    description:
      "ENTPs think out loud by arguing — with others and with themselves. You're energized by possibility, quick to spot the flaw in a plan, and just as quick to propose three better ones on the spot.",
    strengths: [
      "Generates a wide range of novel options instead of anchoring on the first idea",
      "Debates ideas rigorously without taking disagreement personally",
      "Adapts fast when circumstances change mid-plan",
      "Energizes a room and challenges stale assumptions",
    ],
    growth: [
      "Can start more projects than you finish",
      "Playing devil's advocate too often can read as contrarian for its own sake",
      "Routine execution can feel like a drag once the novel part is solved",
    ],
  },
  INFJ: {
    code: "INFJ",
    name: "The Advocate",
    tagline: "Insightful · Principled · Quietly Intense",
    description:
      "INFJs combine a strong inner compass with real sensitivity to people. You tend to see the meaning behind a situation before others do, and you care about getting it right — for the people involved, not just the outcome.",
    strengths: [
      "Reads underlying dynamics and unspoken needs in a room",
      "Holds firm, well-considered values without being loud about them",
      "Builds deep, trust-based relationships rather than wide, shallow ones",
      "Connects a specific decision to its larger meaning or purpose",
    ],
    growth: [
      "Can absorb others' emotional weight until it becomes your own",
      "Idealism can turn into disappointment when reality falls short",
      "Tendency to withdraw rather than raise a conflict directly",
    ],
  },
  INFP: {
    code: "INFP",
    name: "The Idealist",
    tagline: "Empathetic · Authentic · Imaginative",
    description:
      "INFPs are guided by a clear internal sense of right and meaningful. You care less about how things look from the outside and more about whether they're true to your values, which gives your work a quiet authenticity.",
    strengths: [
      "Brings genuine empathy that makes people feel truly heard",
      "Stays anchored to personal values under social or commercial pressure",
      "Sees creative, values-driven angles others overlook",
      "Advocates for people who might otherwise be spoken over",
    ],
    growth: [
      "Can take criticism of an idea as criticism of yourself",
      "Conflict-avoidance can let small issues grow into resentment",
      "Idealized expectations can make ordinary reality feel disappointing",
    ],
  },
  ENFJ: {
    code: "ENFJ",
    name: "The Mentor",
    tagline: "Warm · Persuasive · People-Focused",
    description:
      "ENFJs read a room and instinctively know how to bring out the best in the people in it. You're motivated by other people's growth, and you have a natural gift for articulating a shared vision that gets people moving together.",
    strengths: [
      "Notices individual strengths and actively helps people grow into them",
      "Communicates a vision in a way that genuinely rallies people",
      "Builds trust quickly across very different kinds of people",
      "Turns tension in a group into a constructive conversation",
    ],
    growth: [
      "Can overcommit to others' needs at the expense of your own",
      "Desire for harmony can delay a necessary hard conversation",
      "May take a cool reception personally rather than as neutral feedback",
    ],
  },
  ENFP: {
    code: "ENFP",
    name: "The Catalyst",
    tagline: "Enthusiastic · Imaginative · Warm",
    description:
      "ENFPs bring genuine curiosity and warmth to almost everything. You connect ideas and people that wouldn't normally intersect, and your enthusiasm has a way of making other people more excited about their own lives too.",
    strengths: [
      "Sparks energy and possibility in stalled conversations or projects",
      "Forms authentic connections with a wide range of people quickly",
      "Sees non-obvious links between ideas, people, and opportunities",
      "Adapts plans on the fly without losing enthusiasm",
    ],
    growth: [
      "Follow-through can lag behind the excitement of a new idea",
      "Can overextend socially and need more recovery time than planned",
      "Structure and routine can feel constraining even when they'd help",
    ],
  },
  ISTJ: {
    code: "ISTJ",
    name: "The Steward",
    tagline: "Reliable · Methodical · Grounded",
    description:
      "ISTJs are the people others build plans around, because you actually do what you say you will. You trust proven methods, keep track of details others let slip, and take real pride in following through completely.",
    strengths: [
      "Delivers consistently on commitments, even unglamorous ones",
      "Catches practical details and risks before they become problems",
      "Brings calm, steady judgment under pressure",
      "Respects process and precedent instead of reinventing the wheel each time",
    ],
    growth: [
      "Can resist a better new approach simply because it's unfamiliar",
      "May underplay your own needs in favor of the plan or the team",
      "Rigid standards can come across as inflexible to more spontaneous people",
    ],
  },
  ISFJ: {
    code: "ISFJ",
    name: "The Guardian",
    tagline: "Devoted · Attentive · Steady",
    description:
      "ISFJs quietly notice what people around them need and act on it without being asked. You take real responsibility for the people and commitments in your life, and you show care through consistent, practical support.",
    strengths: [
      "Remembers the specific details that make people feel genuinely cared for",
      "Keeps commitments quietly and reliably, without needing recognition",
      "Creates a stable, calm environment others can lean on",
      "Balances tradition with real sensitivity to individual needs",
    ],
    growth: [
      "Can over-give until your own needs go unmet",
      "Discomfort with conflict can let problems go unaddressed too long",
      "Change can feel more threatening than it needs to be",
    ],
  },
  ESTJ: {
    code: "ESTJ",
    name: "The Director",
    tagline: "Organized · Assertive · Practical",
    description:
      "ESTJs turn plans into execution. You bring clear structure to ambiguous situations, hold people accountable to what was agreed, and have little patience for process that doesn't visibly move things forward.",
    strengths: [
      "Organizes people and timelines into a workable, executable plan",
      "Holds a clear, consistent standard and applies it fairly",
      "Makes decisions efficiently and owns the outcome",
      "Cuts through ambiguity to get things moving",
    ],
    growth: [
      "Can undervalue input that doesn't come with a clear rationale",
      "Directness may land harder on others than intended",
      "Attachment to 'the right way' can crowd out a genuinely better new idea",
    ],
  },
  ESFJ: {
    code: "ESFJ",
    name: "The Host",
    tagline: "Sociable · Supportive · Organized",
    description:
      "ESFJs keep groups running smoothly — socially and practically. You notice who feels included and who doesn't, and you put real effort into making sure the people around you feel supported and the plans actually happen.",
    strengths: [
      "Builds warm, cooperative relationships across a group quickly",
      "Organizes people and logistics so things run smoothly",
      "Notices when someone's being left out and brings them in",
      "Follows through on commitments to the people who matter to you",
    ],
    growth: [
      "Can tie self-worth too closely to others' approval",
      "Harmony-seeking can mean avoiding a needed disagreement",
      "May take a neutral or blunt reaction more personally than intended",
    ],
  },
  ISTP: {
    code: "ISTP",
    name: "The Craftsman",
    tagline: "Practical · Independent · Calm",
    description:
      "ISTPs learn best by taking things apart — literally or conceptually. You stay calm when something breaks, troubleshoot with hands-on logic, and value being genuinely competent over talking about competence.",
    strengths: [
      "Solves hands-on problems efficiently, without unnecessary fuss",
      "Stays composed and clear-headed in a crisis",
      "Adapts quickly when a plan stops working mid-execution",
      "Prefers demonstrated skill over credentials or talk",
    ],
    growth: [
      "Can disengage from situations that feel overly emotional or abstract",
      "May avoid committing to long-term plans that limit flexibility",
      "Terseness can be read as disinterest even when you're fully engaged",
    ],
  },
  ISFP: {
    code: "ISFP",
    name: "The Artisan",
    tagline: "Gentle · Aesthetic · Independent",
    description:
      "ISFPs experience the world through the senses and a quiet, personal set of values. You'd rather show what you mean than explain it, and you resist being boxed into a role that doesn't reflect who you actually are.",
    strengths: [
      "Brings a genuine aesthetic and sensory sensitivity to your work",
      "Adapts smoothly and stays present in the moment",
      "Acts on personal values without needing to make a public case for them",
      "Offers quiet, non-judgmental support to people around you",
    ],
    growth: [
      "Conflict-avoidance can mean real disagreements go unspoken",
      "May struggle to plan far enough ahead for longer-term goals",
      "Sensitivity to criticism can outlast the moment it was given in",
    ],
  },
  ESTP: {
    code: "ESTP",
    name: "The Dynamo",
    tagline: "Bold · Energetic · Pragmatic",
    description:
      "ESTPs are built for the present moment. You read a live situation quickly, act on it without overthinking, and would rather learn by doing than by planning every detail in advance.",
    strengths: [
      "Reads a room or situation quickly and responds in real time",
      "Takes decisive action instead of getting stuck in analysis",
      "Handles pressure and unexpected change with composure",
      "Brings energy and momentum to a stalled group",
    ],
    growth: [
      "Can act before fully weighing longer-term consequences",
      "Routine and detailed planning can feel unnecessarily constraining",
      "Directness under pressure can come across as blunt",
    ],
  },
  ESFP: {
    code: "ESFP",
    name: "The Performer",
    tagline: "Playful · Warm · Spontaneous",
    description:
      "ESFPs bring genuine warmth and energy into any room. You live vividly in the present, pick up on others' moods instantly, and have a gift for making ordinary moments feel more fun and alive.",
    strengths: [
      "Lifts the energy and mood of the people around you",
      "Notices and responds to others' emotional states in real time",
      "Adapts easily to new people and changing plans",
      "Brings practical enthusiasm rather than abstract theorizing",
    ],
    growth: [
      "Can avoid planning ahead in favor of staying in the moment",
      "Sensitivity to criticism can affect follow-through on tough feedback",
      "Focus can drift from longer, less immediately rewarding tasks",
    ],
  },
};
