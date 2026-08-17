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

export function personalityResultsToGraphData(
  progress: ProgressMap,
  results: PersonalityResults,
  combinedProfile: CombinedProfile
): GraphData {
  const nodes: NodeType[] = [];
  const links: Array<{ source: string | number; target: string | number }> = [];
  const traitIds = new Set<TraitId>();

  // Create question nodes and collect traits they feed
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
        }
      } else if (assessmentId === "colors") {
        const q = COLOR_QUESTIONS.find((question) => question.id === questionId);
        if (q) {
          questionPrompt = q.prompt;
        }
      }

      if (!questionPrompt) continue;

      // Create question node
      const questionNode: QuestionNode = {
        id: `q-${assessmentId}-${questionId}`,
        kind: "question",
        prompt: questionPrompt,
        answer,
      };
      nodes.push(questionNode);

      // Create trait node and link question to trait
      if (assessmentId === "mbti" && questionTrait) {
        if (!traitIds.has(questionTrait)) {
          const traitNode: TraitNode = {
            id: questionTrait,
            kind: "trait",
            label: TRAIT_LABELS[questionTrait],
          };
          nodes.push(traitNode);
          traitIds.add(questionTrait);
        }
        links.push({
          source: questionNode.id,
          target: questionTrait,
        });
      } else if (assessmentId === "bigfive" && questionTrait) {
        if (!traitIds.has(questionTrait)) {
          const traitNode: TraitNode = {
            id: questionTrait,
            kind: "trait",
            label: TRAIT_LABELS[questionTrait],
          };
          nodes.push(traitNode);
          traitIds.add(questionTrait);
        }
        links.push({
          source: questionNode.id,
          target: questionTrait,
        });
      } else if (assessmentId === "humandesign" && results.humandesign) {
        // For HD, the answer is the selected type
        const hdType = results.humandesign.type as TraitId;
        if (!traitIds.has(hdType)) {
          const traitNode: TraitNode = {
            id: hdType,
            kind: "trait",
            label: TRAIT_LABELS[hdType],
          };
          nodes.push(traitNode);
          traitIds.add(hdType);
        }
        links.push({
          source: questionNode.id,
          target: hdType,
        });
      } else if (assessmentId === "colors" && results.colors) {
        // For colors, link to the dominant and secondary colors
        const dominant = results.colors.dominant as TraitId;
        const secondary = results.colors.secondary as TraitId;

        if (!traitIds.has(dominant)) {
          const dominantNode: TraitNode = {
            id: dominant,
            kind: "trait",
            label: TRAIT_LABELS[dominant],
          };
          nodes.push(dominantNode);
          traitIds.add(dominant);
        }
        if (!traitIds.has(secondary)) {
          const secondaryNode: TraitNode = {
            id: secondary,
            kind: "trait",
            label: TRAIT_LABELS[secondary],
          };
          nodes.push(secondaryNode);
          traitIds.add(secondary);
        }

        links.push({
          source: questionNode.id,
          target: dominant,
        });
        if (secondary !== dominant) {
          links.push({
            source: questionNode.id,
            target: secondary,
          });
        }
      }
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

  // Create links from traits to threads
  for (const trait of traitIds) {
    // Find which thread this trait belongs to based on the assessment type
    let threadId: AssessmentId | null = null;

    if (["EI", "SN", "TF", "JP"].includes(trait)) {
      threadId = "mbti";
    } else if (["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"].includes(trait)) {
      threadId = "bigfive";
    } else if (["generator", "manifesting-generator", "manifestor", "projector", "reflector"].includes(trait)) {
      threadId = "humandesign";
    } else if (["red", "blue", "green", "yellow"].includes(trait)) {
      threadId = "colors";
    }

    if (threadId && threadMap.has(threadId)) {
      links.push({
        source: trait,
        target: threadId,
      });
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
    for (const thread of combinedProfile.threads) {
      // Determine which traits feed into this axis and if this thread has any
      const axisTraitsFromThread: TraitId[] = [];

      if (thread.id === "mbti") {
        const dichotomyTraits: TraitId[] = ["EI", "SN", "TF", "JP"];
        for (const trait of dichotomyTraits) {
          if (traitIds.has(trait) && TRAIT_TO_AXIS[trait] === axis.id) {
            axisTraitsFromThread.push(trait);
          }
        }
      } else if (thread.id === "bigfive") {
        const bfTraits: TraitId[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
        for (const trait of bfTraits) {
          if (traitIds.has(trait) && TRAIT_TO_AXIS[trait] === axis.id) {
            axisTraitsFromThread.push(trait);
          }
        }
      } else if (thread.id === "humandesign" && results.humandesign) {
        const hdType = results.humandesign.type as TraitId;
        if (TRAIT_TO_AXIS[hdType] === axis.id) {
          axisTraitsFromThread.push(hdType);
        }
      } else if (thread.id === "colors" && results.colors) {
        const dominant = results.colors.dominant as TraitId;
        const secondary = results.colors.secondary as TraitId;
        if (TRAIT_TO_AXIS[dominant] === axis.id) {
          axisTraitsFromThread.push(dominant);
        }
        if (TRAIT_TO_AXIS[secondary] === axis.id && secondary !== dominant) {
          axisTraitsFromThread.push(secondary);
        }
      }

      if (axisTraitsFromThread.length > 0) {
        links.push({
          source: thread.id,
          target: axis.id,
        });
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

  return {
    nodes: nodes as GraphData["nodes"],
    links: links as GraphData["links"],
  };
}
