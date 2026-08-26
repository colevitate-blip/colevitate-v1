import type {
  AssessmentId,
  PersonalityResults,
  ProgressMap,
  AnswerValue,
  AxisId,
} from "@/lib/personality/types";
import type { GraphData } from "@/components/graph/types";
import type { CombinedProfile } from "./generateCombinedProfile";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";

type TraitId = "EI" | "SN" | "TF" | "JP" | "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism" | "generator" | "manifesting-generator" | "manifestor" | "projector" | "reflector" | "red" | "blue" | "green" | "yellow";

interface TraitNode extends Record<string, unknown> {
  id: TraitId;
  kind: "trait";
  label: string;
  description: string;
  /** Which framework this trait belongs to — lets the layout cluster same-framework nodes together. */
  framework: AssessmentId;
  /** Which of the 4 spectrums this trait feeds — lets the layout place it in that spectrum's quadrant. */
  axisId: AxisId;
  /** Big Five only: the user's actual 0-100 score on this trait — lets the explanation panel add a personalized "you" line on top of the generic description. */
  score?: number;
  /** MBTI only: which pole the user landed on and how strongly — same purpose as score above, for a dichotomy instead of a single-direction trait. */
  pole?: string;
  confidence?: number;
}

interface QuestionNode extends Record<string, unknown> {
  id: string;
  kind: "question";
  prompt: string;
  answer: AnswerValue;
  framework: AssessmentId;
  /** Which of the 4 spectrums the trait this question feeds belongs to — same purpose as TraitNode.axisId. */
  axisId: AxisId;
}

interface AxisNode extends Record<string, unknown> {
  id: AxisId;
  kind: "axis";
  label: string;
  score: number;
  leftPole: string;
  rightPole: string;
  tierLabel: string;
  sentence: string;
}

interface ArchetypeNode extends Record<string, unknown> {
  id: "archetype";
  kind: "archetype";
  label: string;
  description: string;
  /** Every framework that fed this archetype — lets the click-gradient blend all of them, not just one. */
  frameworks: AssessmentId[];
}

type NodeType = TraitNode | QuestionNode | AxisNode | ArchetypeNode;

// Mapping of dichotomy/trait to axis
const TRAIT_TO_AXIS: Record<TraitId, AxisId> = {
  // MBTI dichotomies
  EI: "energy",
  SN: "novelty",
  TF: "people",
  JP: "structure",
  // Big Five traits
  openness: "novelty",
  conscientiousness: "structure",
  extraversion: "energy",
  agreeableness: "people",
  neuroticism: "people", // neuroticism affects people orientation in a negative way
  // Human Design types
  generator: "structure",
  "manifesting-generator": "novelty",
  manifestor: "structure",
  projector: "people",
  reflector: "people",
  // Colors
  red: "energy",
  blue: "structure",
  green: "people",
  yellow: "novelty",
};

const TRAIT_LABELS: Record<TraitId, string> = {
  EI: "Extraversion/Introversion",
  SN: "Sensing/Intuition",
  TF: "Thinking/Feeling",
  JP: "Judging/Perceiving",
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Neuroticism",
  generator: "Generator",
  "manifesting-generator": "Manifesting Generator",
  manifestor: "Manifestor",
  projector: "Projector",
  reflector: "Reflector",
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
};

const TRAIT_DESCRIPTIONS: Record<TraitId, string> = {
  EI: "Whether you draw energy from engaging with the outer world (Extraversion) or from time alone with your own thoughts (Introversion).",
  SN: "Whether you trust concrete, present detail (Sensing) or patterns and possibilities (Intuition).",
  TF: "Whether decisions lean on logical consistency (Thinking) or on impact and values (Feeling).",
  JP: "Whether you prefer things settled and planned (Judging) or open and flexible (Perceiving).",
  openness: "How drawn you are to new ideas and unconventional thinking versus the practical and familiar.",
  conscientiousness: "How organized, disciplined, and goal-directed you tend to be.",
  extraversion: "How much social engagement and stimulation energize you, versus drain you.",
  agreeableness: "How much you prioritize cooperation and others' feelings versus your own agenda.",
  neuroticism: "How easily you experience stress, worry, or emotional volatility.",
  generator: "A Human Design type built to respond to what shows up, generating energy by engaging with what lights you up.",
  "manifesting-generator": "A Human Design type combining a Generator's response-driven energy with a Manifestor's instinct to initiate.",
  manifestor: "A Human Design type built to initiate — you act first and inform others, rather than waiting to respond.",
  projector: "A Human Design type built to guide and see systems clearly, working best when invited rather than pushing.",
  reflector: "A rare Human Design type that reflects the health of the people and environment around them.",
  red: "A color-type energy centered on drive, urgency, and getting things done now.",
  blue: "A color-type energy centered on precision, structure, and doing things correctly.",
  green: "A color-type energy centered on harmony, support, and steady relationships.",
  yellow: "A color-type energy centered on optimism, spontaneity, and connecting with people.",
};

const KIND_ORDER: Record<NodeType["kind"], number> = {
  question: 0,
  trait: 1,
  axis: 2,
  archetype: 3,
};

const MBTI_TRAITS: TraitId[] = ["EI", "SN", "TF", "JP"];
const BIG_FIVE_TRAITS: TraitId[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];

export function personalityResultsToGraphData(
  progress: ProgressMap,
  results: PersonalityResults,
  combinedProfile: CombinedProfile
): GraphData {
  const nodes: NodeType[] = [];
  const links: Array<{ source: string | number; target: string | number }> = [];
  const traitIds = new Set<TraitId>();
  // Which traits each completed thread actually contributes — derived from
  // the *scored results*, not from locally-cached in-progress answers, so a
  // trait/thread/axis is never orphaned just because a user completed an
  // assessment on another device or the draft answers got cleared after
  // submission.
  const threadTraits = new Map<AssessmentId, TraitId[]>();

  const addTraitNode = (
    id: TraitId,
    framework: AssessmentId,
    personalization?: { score?: number; pole?: string; confidence?: number }
  ) => {
    if (traitIds.has(id)) return;
    nodes.push({
      id,
      kind: "trait",
      label: TRAIT_LABELS[id],
      description: TRAIT_DESCRIPTIONS[id],
      framework,
      axisId: TRAIT_TO_AXIS[id],
      ...personalization,
    });
    traitIds.add(id);
  };

  if (results.mbti) {
    const mbtiScores = results.mbti.scores as Record<TraitId, { pole: string; confidence: number }>;
    MBTI_TRAITS.forEach((id) =>
      addTraitNode(id, "mbti", { pole: mbtiScores[id].pole, confidence: mbtiScores[id].confidence })
    );
    threadTraits.set("mbti", MBTI_TRAITS);
  }
  if (results.bigfive) {
    const bigFiveScores = results.bigfive.scores as Record<TraitId, number>;
    BIG_FIVE_TRAITS.forEach((id) => addTraitNode(id, "bigfive", { score: bigFiveScores[id] }));
    threadTraits.set("bigfive", BIG_FIVE_TRAITS);
  }
  if (results.humandesign) {
    const type = results.humandesign.type as TraitId;
    addTraitNode(type, "humandesign");
    threadTraits.set("humandesign", [type]);
  }
  if (results.colors) {
    const dominant = results.colors.dominant as TraitId;
    const secondary = results.colors.secondary as TraitId;
    addTraitNode(dominant, "colors");
    const colorTraits: TraitId[] = [dominant];
    if (secondary !== dominant) {
      addTraitNode(secondary, "colors");
      colorTraits.push(secondary);
    }
    threadTraits.set("colors", colorTraits);
  }

  // Question nodes are an optional, denser outer layer — only present when
  // the raw in-progress answers are still cached locally. They hang off the
  // trait node the question feeds, which already exists above regardless.
  for (const assessmentId of ["mbti", "bigfive", "humandesign", "colors"] as AssessmentId[]) {
    const progressData = progress[assessmentId];
    if (!progressData) continue;

    const answers = progressData.answers ?? {};
    const skippedIds = new Set(results[assessmentId]?.skippedQuestionIds ?? []);

    for (const [questionId, answer] of Object.entries(answers)) {
      // Skipped questions got a neutral default score, not a real answer —
      // showing them as if they fed a trait would misrepresent what
      // actually informed the result.
      if (answer === undefined || answer === null || skippedIds.has(questionId)) continue;

      let questionPrompt = "";
      let questionTrait: TraitId | null = null;

      if (assessmentId === "mbti") {
        const q = MBTI_QUESTIONS.find((question) => question.id === questionId);
        if (q) {
          questionPrompt = q.prompt;
          questionTrait = q.dichotomy as TraitId;
        }
      } else if (assessmentId === "bigfive") {
        const q = BIG_FIVE_QUESTIONS.find((question) => question.id === questionId);
        if (q) {
          questionPrompt = q.statement;
          questionTrait = q.trait as TraitId;
        }
      } else if (assessmentId === "humandesign") {
        const q = HD_QUESTIONS.find((question) => question.id === questionId);
        if (q) {
          questionPrompt = q.prompt;
          questionTrait = results.humandesign ? (results.humandesign.type as TraitId) : null;
        }
      } else if (assessmentId === "colors") {
        const q = COLOR_QUESTIONS.find((question) => question.id === questionId);
        if (q) {
          questionPrompt = q.prompt;
          questionTrait = results.colors ? (results.colors.dominant as TraitId) : null;
        }
      }

      if (!questionPrompt || !questionTrait || !traitIds.has(questionTrait)) continue;

      const questionNode: QuestionNode = {
        id: `q-${assessmentId}-${questionId}`,
        kind: "question",
        prompt: questionPrompt,
        answer,
        framework: assessmentId,
        axisId: TRAIT_TO_AXIS[questionTrait],
      };
      nodes.push(questionNode);
      links.push({ source: questionNode.id, target: questionTrait });
    }
  }

  // Create axis nodes and link the traits that feed each one
  for (const axis of combinedProfile.axes) {
    const axisNode: AxisNode = {
      id: axis.id,
      kind: "axis",
      label: axis.label,
      score: axis.score,
      leftPole: axis.leftPole,
      rightPole: axis.rightPole,
      tierLabel: axis.tierLabel,
      sentence: axis.sentence,
    };
    nodes.push(axisNode);

    // Link the specific trait(s) that feed this axis — a framework only
    // touches an axis *through* one of its traits (e.g. Big Five reaches
    // "People Orientation" via both Agreeableness and Neuroticism), so this
    // is what actually makes that connection visible: two traits from
    // different frameworks that both feed the same axis now share that axis
    // as a common neighbor, even though there's no direct edge between the
    // traits themselves.
    for (const traits of threadTraits.values()) {
      for (const trait of traits) {
        if (TRAIT_TO_AXIS[trait] === axis.id) {
          links.push({ source: trait, target: axis.id });
        }
      }
    }
  }

  // Create archetype node and link every spectrum to it — the archetype is
  // built from the 4 spectrums, not from which frameworks happen to be
  // completed, so that's what it connects to.
  if (combinedProfile.archetype) {
    const archetypeNode: ArchetypeNode = {
      id: "archetype",
      kind: "archetype",
      label: combinedProfile.archetype.name,
      description: combinedProfile.archetype.description,
      frameworks: combinedProfile.threads.map((t) => t.id),
    };
    nodes.push(archetypeNode);

    for (const axis of combinedProfile.axes) {
      links.push({
        source: axis.id,
        target: "archetype",
      });
    }
  }

  // Sort by kind into a fixed order so color assignment (which colors groups
  // by first-appearance order — see buildGroupColorMap) stays stable no
  // matter which branches above ran or in what order they pushed nodes.
  const sortedNodes = [...nodes].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);

  return {
    nodes: sortedNodes as GraphData["nodes"],
    links: links as GraphData["links"],
  };
}
