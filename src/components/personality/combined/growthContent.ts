import type { AxisId, AxisScore } from "./scoringMatrix";
import { getArchetypeKey } from "./archetypeMatrix";

// Growth prompts: one concrete, actionable suggestion per axis, keyed by
// that axis's own tierLabel (the same 5-tier bucketing scoringMatrix.ts
// already computes — no separate bucketing logic to keep in sync here).
const AXIS_GROWTH_PROMPTS: Record<AxisId, Record<string, string>> = {
  energy: {
    "Strongly inward":
      "Schedule solitary recovery time proactively, before you're depleted, rather than retreating only once socializing has already worn you down.",
    "Leans inward":
      "Before a demanding social stretch, block out a short buffer of quiet time on either side — protecting your recovery window keeps outward effort sustainable.",
    Situational:
      "Notice which contexts actually drain you versus energize you, and start choosing your commitments with that pattern in mind rather than defaulting to habit.",
    "Leans outward":
      "Build in occasional solo downtime even when you don't feel like you need it — outward energy can mask depletion until it's already caught up with you.",
    "Strongly outward":
      "Practice sitting with silence or solitude in small doses — it's a muscle worth having, even if it's not where you naturally live.",
  },
  structure: {
    "Strongly emergent":
      "Anchor just one part of your day to a fixed routine — a single consistent habit gives your emergent style something to push off of without boxing you in.",
    "Leans emergent":
      "Pick one recurring commitment each week and treat it as non-negotiable — a small dose of structure compounds without demanding a full planning overhaul.",
    Balanced:
      "Notice which situations call for a plan versus improvisation, and get explicit about that choice up front rather than deciding by default.",
    "Leans planned":
      "Deliberately leave one block of unstructured time in your week — practice tolerating the discomfort of not having it mapped out.",
    "Strongly planned":
      "When a plan breaks, treat it as data instead of a failure — build a habit of adapting mid-course rather than re-planning from scratch.",
  },
  people: {
    "Strongly task-focused":
      "Before delivering hard feedback or a decision, pause and name out loud how it might land on the other person — not to change the call, just to see it.",
    "Leans task-focused":
      "In your next disagreement, ask one genuine question about the other person's stake in the outcome before making your case.",
    Balanced:
      "Notice when you're switching between task-mode and people-mode, and get intentional about which one a given moment actually calls for.",
    "Leans people-focused":
      "Practice making one decision this week based purely on what's most effective, even if it's not the most popular choice in the room.",
    "Strongly people-focused":
      "Set one boundary this week where the task genuinely needs to come first — notice how it feels to hold that line.",
  },
  novelty: {
    "Strongly grounded":
      "Deliberately try one small unfamiliar thing this week — low stakes, just to keep the muscle of exploring something new.",
    "Leans grounded":
      "Give a new idea a real trial run before dismissing it — a short pilot, not a full commitment, is enough to actually test it.",
    Balanced:
      "Notice whether you're defaulting to the familiar out of habit or genuine judgment, and check that choice occasionally.",
    "Leans exploratory":
      "Before chasing the next new idea, finish one you already started — novelty is more valuable paired with follow-through.",
    "Strongly exploratory":
      "Pick one current idea and commit to seeing it through past the exciting part — practice staying once the novelty wears off.",
  },
};

export function getAxisGrowthPrompt(axis: AxisScore): string | null {
  return AXIS_GROWTH_PROMPTS[axis.id]?.[axis.tierLabel] ?? null;
}

// Career/role-fit suggestions, keyed by the same 16 archetype buckets
// archetypeMatrix.ts computes — tied to the archetype for specificity
// rather than derived from raw axis scores directly.
const CAREER_SUGGESTIONS: Record<string, string[]> = {
  IMTG: [
    "Independent contractor or specialist roles where the work speaks for itself",
    "Craft-based trades — woodworking, precision engineering, technical writing",
    "Deep individual-contributor tracks over people management",
    "Quality assurance or precision-focused technical work",
  ],
  IMTX: [
    "R&D or prototyping roles with room to experiment",
    "Solo software development or independent projects",
    "Applied research",
    "Product tinkering or hardware hacking roles",
  ],
  IMFG: [
    "Counseling, coaching, or one-on-one support roles",
    "Case management",
    "Community or pastoral care work",
    "Customer success roles built on quiet, steady rapport",
  ],
  IMFX: [
    "Travel writing or documentary work",
    "User research or ethnographic research",
    "Freelance creative work with people-centered themes",
    "Small-scale, personal community organizing",
  ],
  IPTG: [
    "Systems architecture or infrastructure engineering",
    "Actuarial or financial analysis",
    "Technical project planning",
    "Process or quality engineering",
  ],
  IPTX: [
    "R&D engineering with formal rigor",
    "Product architecture for new categories",
    "Scientific research with a structured method",
    "Patent-oriented inventive work",
  ],
  IPFG: [
    "Healthcare or allied-health roles with steady caseloads",
    "Operations roles supporting a stable team",
    "Administrative roles at a mission-driven organization",
    "Family or elder-care coordination",
  ],
  IPFX: [
    "Strategic planning for people-centered organizations (nonprofits, education)",
    "Long-range HR or org-design work",
    "Curriculum design",
    "Futures or foresight research roles",
  ],
  EMTG: [
    "Field operations or on-the-ground project execution",
    "Sales roles with fast feedback loops",
    "Crisis or emergency-response work",
    "Hands-on trades with client-facing work",
  ],
  EMTX: [
    "Startup founder or early-stage roles",
    "Growth or experimentation-driven marketing",
    "Business development in new markets",
    "Scouting or exploratory sales",
  ],
  EMFG: [
    "Community management",
    "Event hosting or hospitality leadership",
    "Team facilitation",
    "Frontline customer-facing leadership",
  ],
  EMFX: [
    "Brand or creative marketing",
    "Improv-driven performance or entertainment",
    "Partnerships and networking-heavy roles",
    "Live event production",
  ],
  EPTG: [
    "Operations management",
    "Program or project management",
    "Logistics leadership",
    "Construction or manufacturing management",
  ],
  EPTX: [
    "Product strategy for new ventures",
    "Management consulting",
    "Business strategy in emerging industries",
    "Innovation-team leadership",
  ],
  EPFG: [
    "Hospitality or account management",
    "Office or people-operations leadership",
    "Client success leadership",
    "Nonprofit program coordination",
  ],
  EPFX: [
    "Executive leadership at a growth-stage organization",
    "Public-facing organizational leadership",
    "Large-scale event or campaign direction",
    "Movement-building or advocacy leadership",
  ],
};

export function getCareerSuggestions(axes: AxisScore[]): string[] {
  const key = getArchetypeKey(axes);
  if (!key) return [];
  return CAREER_SUGGESTIONS[key] ?? [];
}
