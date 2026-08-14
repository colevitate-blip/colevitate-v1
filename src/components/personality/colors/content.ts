import type { ColorId } from "@/lib/personality/types";

export interface ColorContent {
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  growth: string[];
}

export const COLOR_CONTENT: Record<ColorId, ColorContent> = {
  red: {
    name: "Red — The Driver",
    tagline: "Bold · Decisive · Results-Driven",
    description:
      "Reds are motivated by action and outcomes. You make decisions quickly, push through obstacles rather than around them, and feel most alive when you're moving a goal forward.",
    strengths: [
      "Makes fast, confident decisions under pressure",
      "Drives projects forward and refuses to let momentum stall",
      "Comfortable taking charge when a situation calls for it",
      "Stays focused on outcomes rather than getting lost in process",
    ],
    growth: [
      "Can come across as blunt or impatient with slower-moving processes",
      "May steamroll input before fully hearing it out",
      "Slowing down for details can feel like wasted time, even when it isn't",
    ],
  },
  blue: {
    name: "Blue — The Analyst",
    tagline: "Precise · Thoughtful · Reliable",
    description:
      "Blues are motivated by accuracy and understanding. You'd rather take the time to get something right than rush to a shallow answer, and people trust your judgment because it's carefully considered.",
    strengths: [
      "Catches errors and gaps that faster-moving people miss",
      "Brings careful, well-reasoned judgment to decisions",
      "Delivers consistently high-quality, dependable work",
      "Stays calm and objective when others react emotionally",
    ],
    growth: [
      "Can over-analyze and delay a decision past the point of usefulness",
      "May come across as reserved or hard to read emotionally",
      "High personal standards can be applied too rigidly to others",
    ],
  },
  green: {
    name: "Green — The Supporter",
    tagline: "Warm · Patient · Steady",
    description:
      "Greens are motivated by connection and stability. You create the calm, dependable presence a team or relationship needs, and you genuinely care how your decisions affect the people around you.",
    strengths: [
      "Builds trust and loyalty through consistent, genuine care",
      "Keeps groups calm and cooperative during tense moments",
      "Listens well and makes people feel truly heard",
      "Provides steady support that others can reliably lean on",
    ],
    growth: [
      "Conflict-avoidance can let real issues go unaddressed too long",
      "May put others' needs ahead of your own too often",
      "Can resist change even when it would clearly help",
    ],
  },
  yellow: {
    name: "Yellow — The Inspirer",
    tagline: "Energetic · Sociable · Optimistic",
    description:
      "Yellows are motivated by possibility and connection. You bring enthusiasm into a room, make people feel good about what's ahead, and thrive on variety, spontaneity, and new experiences.",
    strengths: [
      "Energizes and motivates the people around you",
      "Builds rapport with new people quickly and genuinely",
      "Sees exciting possibilities others miss in the moment",
      "Adapts easily and keeps morale high through change",
    ],
    growth: [
      "Follow-through can lag behind the excitement of a new idea",
      "Can lose focus in the details of a long, unglamorous task",
      "Enthusiasm may need tempering to land in more serious moments",
    ],
  },
};
