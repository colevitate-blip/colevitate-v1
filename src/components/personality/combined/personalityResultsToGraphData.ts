import type {
  AssessmentId,
  PersonalityResults,
  ProgressMap,
  AnswerValue,
  AxisId,
} from "@/lib/personality/types";
import type { GraphData } from "@/components/graph/types";
import type { CombinedProfile } from "./generateCombinedProfile";
import { findSharedGrowthTheme } from "./generateCombinedProfile";
import { MBTI_QUESTIONS } from "@/components/personality/mbti/questions";
import { BIG_FIVE_QUESTIONS } from "@/components/personality/bigfive/questions";
import { HD_QUESTIONS } from "@/components/personality/humandesign/questions";
import { COLOR_QUESTIONS } from "@/components/personality/colors/questions";

type TraitId = "EI" | "SN" | "TF" | "JP" | "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism" | "generator" | "manifesting-generator" | "manifestor" | "projector" | "reflector" | "red" | "blue" | "green" | "yellow";

interface TraitNode extends Record<string, unknown> {
  id: TraitId;
  kind: "trait";
  label: string;
}

interface QuestionNode extends Record<string, unknown> {
  id: string;
  kind: "question";
  prompt: string;
  answer: AnswerValue;
}

interface ThreadNode extends Record<string, unknown> {
  id: string;
  kind: "thread";
  label: string;
  tagline: string;
}

interface AxisNode extends Record<string, unknown> {
  id: AxisId;
  kind: "axis";
  score: number;
}

interface ArchetypeNode extends Record<string, unknown> {
  id: "archetype";
  kind: "archetype";
  label: string;
}

type NodeType = TraitNode | QuestionNode | ThreadNode | AxisNode | ArchetypeNode;

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

const KIND_ORDER: Record<NodeType["kind"], number> = {
  question: 0,
  trait: 1,
  thread: 2,
  axis: 3,
  archetype: 4,
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

  const addTraitNode = (id: TraitId) => {
    if (traitIds.has(id)) return;
    nodes.push({ id, kind: "trait", label: TRAIT_LABELS[id] });
    traitIds.add(id);
  };

  if (results.mbti) {
    MBTI_TRAITS.forEach(addTraitNode);
    threadTraits.set("mbti", MBTI_TRAITS);
  }
  if (results.bigfive) {
    BIG_FIVE_TRAITS.forEach(addTraitNode);
    threadTraits.set("bigfive", BIG_FIVE_TRAITS);
  }
  if (results.humandesign) {
    const type = results.humandesign.type as TraitId;
    addTraitNode(type);
    threadTraits.set("humandesign", [type]);
  }
  if (results.colors) {
    const dominant = results.colors.dominant as TraitId;
    const secondary = results.colors.secondary as TraitId;
    addTraitNode(dominant);
    const colorTraits: TraitId[] = [dominant];
    if (secondary !== dominant) {
      addTraitNode(secondary);
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

    for (const [questionId, answer] of Object.entries(answers)) {
      if (answer === undefined || answer === null) continue;

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
      };
      nodes.push(questionNode);
      links.push({ source: questionNode.id, target: questionTrait });
    }
  }

  // Create thread nodes
  const threadMap = new Map<AssessmentId, ThreadNode>();
  for (const thread of combinedProfile.threads) {
    const threadNode: ThreadNode = {
      id: thread.id,
      kind: "thread",
      label: thread.label,
      tagline: thread.tagline,
    };
    nodes.push(threadNode);
    threadMap.set(thread.id, threadNode);
  }

  // Link every trait to the thread it belongs to
  for (const [threadId, traits] of threadTraits) {
    if (!threadMap.has(threadId)) continue;
    for (const trait of traits) {
      links.push({ source: trait, target: threadId });
    }
  }

  // Create shared growth theme links (thread to thread)
  const sharedGrowth = findSharedGrowthTheme(combinedProfile.threads);
  if (sharedGrowth) {
    for (let i = 0; i < sharedGrowth.ids.length; i++) {
      for (let j = i + 1; j < sharedGrowth.ids.length; j++) {
        links.push({
          source: sharedGrowth.ids[i],
          target: sharedGrowth.ids[j],
        });
      }
    }
  }

  // Create axis nodes and link threads to axes
  for (const axis of combinedProfile.axes) {
    const axisNode: AxisNode = {
      id: axis.id,
      kind: "axis",
      score: axis.score,
    };
    nodes.push(axisNode);

    // Link threads that contribute to this axis
    for (const [threadId, traits] of threadTraits) {
      if (!threadMap.has(threadId)) continue;
      const contributes = traits.some((trait) => TRAIT_TO_AXIS[trait] === axis.id);
      if (contributes) {
        links.push({ source: threadId, target: axis.id });
      }
    }
  }

  // Create archetype node and link threads to it
  if (combinedProfile.archetype) {
    const archetypeNode: ArchetypeNode = {
      id: "archetype",
      kind: "archetype",
      label: combinedProfile.archetype.name,
    };
    nodes.push(archetypeNode);

    for (const thread of combinedProfile.threads) {
      links.push({
        source: thread.id,
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
