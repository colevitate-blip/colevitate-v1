// Knowledge-base content for the four assessment frameworks themselves —
// origin, what each one measures, and how it's scored on this site — as
// distinct from src/lib/seo/typeContent.ts, which covers individual result
// types (e.g. one page for INTJ). Powers /learn and /learn/[framework].
//
// This is editorial content, not test output, so scientific standing is
// described honestly per framework rather than uniformly: Big Five carries
// real peer-reviewed evidence, MBTI and the color-style model are useful
// vocabulary with a weaker psychometric case, and Human Design has no
// evidentiary basis at all. Flattening that distinction would be misleading.

import type { AssessmentId } from "@/lib/personality/types";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { FRAMEWORK_URL_SLUGS } from "./typeContent";

export interface FrameworkDimension {
  name: string;
  description: string;
}

export interface FrameworkStanding {
  /** One-line badge, e.g. "Strong peer-reviewed support" or "No scientific basis". */
  summary: string;
  /** The fuller case for that standing — evidence, or lack of it. */
  detail: string;
}

export interface FrameworkContent {
  id: AssessmentId;
  slug: string;
  label: string;
  tagline: string;
  intro: string;
  origin: string;
  whatItMeasures: string;
  dimensions: FrameworkDimension[];
  howItsScoredHere: string;
  standing: FrameworkStanding;
  goodFor: string[];
  keepInMind: string[];
}

export const FRAMEWORK_CONTENT: Record<AssessmentId, FrameworkContent> = {
  mbti: {
    id: "mbti",
    slug: FRAMEWORK_URL_SLUGS.mbti,
    label: ASSESSMENT_CATALOG.mbti.label,
    tagline: ASSESSMENT_CATALOG.mbti.tagline,
    intro:
      "A 4-letter typology that sorts cognitive style into 16 types, built to make Carl Jung's theory of psychological types usable as an everyday self-report questionnaire.",
    origin:
      "MBTI traces back to Carl Jung's 1921 book Psychological Types, which described introversion/extraversion and a set of cognitive functions. In the 1940s, Katharine Cook Briggs and her daughter Isabel Briggs Myers turned Jung's ideas into a self-report questionnaire, originally to help people entering the wartime workforce find roles suited to their natural preferences. It has since become the most recognized personality framework in pop culture and corporate training.",
    whatItMeasures:
      "Where you direct your energy, how you take in information, how you make decisions, and how you like to structure your life — expressed as a preference on each of four either/or dichotomies, combined into a 4-letter code.",
    dimensions: [
      { name: "Extraversion (E) vs. Introversion (I)", description: "Whether you're energized by engaging the outer world or by reflecting internally." },
      { name: "Sensing (S) vs. Intuition (N)", description: "Whether you trust concrete, present detail or patterns and future possibilities." },
      { name: "Thinking (T) vs. Feeling (F)", description: "Whether you decide by logical consistency or by impact on people and values." },
      { name: "Judging (J) vs. Perceiving (P)", description: "Whether you prefer settled structure and closure or staying open and flexible." },
    ],
    howItsScoredHere:
      "12 questions, 3 per dichotomy. Each response nudges a running score toward one pole or the other; a skipped question contributes nothing rather than pulling toward either side. Whichever pole has the higher score on each dichotomy becomes a letter in your type, with a confidence percentage showing how lopsided that particular result was.",
    standing: {
      summary: "Useful vocabulary, weaker evidence than Big Five",
      detail:
        "MBTI's four traits correlate with dimensions from the Big Five, but the underlying psychology doesn't hold up as cleanly: most of the traits it measures are normally distributed in the population rather than naturally splitting into two camps, which makes a binary letter feel arbitrary for anyone near the middle. Test–retest reliability is also inconsistent — a meaningful share of people get a different type weeks or months later. It remains widely used because a memorable 4-letter code gives people a fast, shared language for talking about differences in style, even where its psychometric case is weaker than a dimensional model like Big Five.",
    },
    goodFor: [
      "A quick, memorable shorthand for talking about work-style differences with a team",
      "Reflecting on whether you default to structure or spontaneity, depth or breadth",
      "A conversation starter — not a verdict — about how you and someone else operate differently",
    ],
    keepInMind: [
      "A result near the midpoint of a dichotomy is a coin flip dressed up as a letter — read your confidence percentage, not just the code",
      "It's not a clinical or diagnostic instrument, and retaking it can genuinely change your result",
      "Two people with the same 4 letters can still look very different day to day",
    ],
  },
  bigfive: {
    id: "bigfive",
    slug: FRAMEWORK_URL_SLUGS.bigfive,
    label: ASSESSMENT_CATALOG.bigfive.label,
    tagline: ASSESSMENT_CATALOG.bigfive.tagline,
    intro:
      "The model with the strongest research backing in personality psychology — five broad traits, each scored on a continuous spectrum rather than sorted into a type.",
    origin:
      "Big Five (OCEAN) grew out of the lexical hypothesis — the idea that the most important personality differences get encoded into language — starting with Allport and Odbert's 1930s catalog of trait words. Factor-analytic work by Tupes and Christal in 1961, later extended by Lewis Goldberg and by Costa and McCrae's NEO-PI inventories in the 1980s–90s, converged independently on the same five broad factors across different datasets, languages, and cultures.",
    whatItMeasures:
      "Five broad, independent trait dimensions, each running on a continuum from low to high rather than sorting you into a fixed type. Where you sit reflects a real, measured position on that spectrum, not a category you belong to.",
    dimensions: [
      { name: "Openness", description: "Draw to novelty, ideas, and abstract or artistic thinking versus the practical and proven." },
      { name: "Conscientiousness", description: "How much you plan ahead, follow through, and hold yourself to a standard." },
      { name: "Extraversion", description: "Whether you draw energy from people and stimulation or from quieter, lower-key settings." },
      { name: "Agreeableness", description: "How much you prioritize harmony and cooperation over your own judgment or directness." },
      { name: "Emotional Sensitivity (Neuroticism)", description: "How intensely you feel emotions and how alert you stay to what could go wrong." },
    ],
    howItsScoredHere:
      "10 questions on a 5-point agreement scale, including some reverse-scored items so straight-line answering doesn't inflate a trait. Each trait's average is rescaled to a 0–100 score. The written summary you get highlights your two most extreme traits — that's a readability layer on top of the model, not the model itself, which treats all five traits as separate and continuous.",
    standing: {
      summary: "Strong, peer-reviewed support",
      detail:
        "Big Five is the personality model with the most consistent cross-cultural replication and the best track record predicting real outcomes — job performance, relationship satisfaction, and health behaviors among them. It doesn't sort people into tidy types, which makes it less catchy than a 4-letter code or a color, but it's the closest thing personality science has to a consensus framework. A short 10-item version like this one trades precision for speed compared to a full 44- or 120-item inventory.",
    },
    goodFor: [
      "The most defensible self-assessment on this site if you want an evidence-backed read",
      "Tracking how a trait shifts for you over time or across life circumstances",
      "Understanding tendencies (not fixed traits) that predict real-world patterns like work style or stress response",
    ],
    keepInMind: [
      "A short-form score is a rough estimate, not a lab-grade measurement — treat borderline scores as genuinely borderline",
      "High and low aren't good and bad — each pole trades one set of strengths for another",
      "This is a snapshot; scores can and do shift with major life change",
    ],
  },
  humandesign: {
    id: "humandesign",
    slug: FRAMEWORK_URL_SLUGS.humandesign,
    label: ASSESSMENT_CATALOG.humandesign.label,
    tagline: ASSESSMENT_CATALOG.humandesign.tagline,
    intro:
      "In its original form, a birth-time chart claiming to reveal your energy type, decision-making strategy, and inner authority. What's offered here is a simplified, self-report take on just the energy-type layer — no birth data involved.",
    origin:
      "Human Design was introduced in 1987 by Alan Robert Krakower, writing as \"Ra Uru Hu,\" who described receiving the system over an eight-day experience in Ibiza. It layers together elements of Western astrology, the I Ching, the Kabbalistic Tree of Life, and chakra theory onto a chart calculated from your exact birth date, time, and location.",
    whatItMeasures:
      "In the full system: an energy \"type,\" a recommended decision-making \"strategy,\" and an \"authority\" for making choices, all derived from planetary positions at the moment of your birth. This site's version measures none of that directly — it's a 10-question self-report about how you actually operate day to day, used as a behavioral stand-in for which of the five types and strategies fits you best.",
    dimensions: [
      { name: "Generator", description: "Strategy: Respond. Steady, renewable energy for work you genuinely love." },
      { name: "Manifesting Generator", description: "Strategy: Respond, then move. A faster, multi-track version of Generator energy." },
      { name: "Manifestor", description: "Strategy: Inform, then act. Initiates without needing outside permission." },
      { name: "Projector", description: "Strategy: Wait for the invitation. Sees systems clearly but isn't built for constant output." },
      { name: "Reflector", description: "Strategy: Wait a lunar cycle. Rare and highly sensitive to its environment." },
    ],
    howItsScoredHere:
      "10 questions, each option weighted toward one or more of the five types. Weights are summed across all your answers, and the type with the highest total wins — there's no birth chart involved, so this reads your reported behavior, not the astrological inputs the real system relies on.",
    standing: {
      summary: "No scientific basis",
      detail:
        "Human Design has no grounding in evidence-based psychology, and the astronomical and astrological claims it's built on aren't supported by physics or astronomy either. It isn't falsifiable in the way a psychometric scale is meant to be, and it hasn't been validated by controlled research. That puts it in the same evidentiary category as astrology — a system of meaning-making, not a measurement. We include it because plenty of people find it a fun, reflective lens, and we think that's worth being upfront about rather than dressing it up as science.",
    },
    goodFor: [
      "A playful, low-stakes prompt for self-reflection, especially if you already enjoy this kind of language",
      "Framing whether you tend to initiate action or respond to what's already in motion",
      "Conversation with people already fluent in Human Design terms",
    ],
    keepInMind: [
      "This is the one framework on this site with no scientific backing — treat it as reflective, not diagnostic",
      "It's a behavioral proxy for the type/strategy layer only, not a real chart — a genuine Human Design reading needs your exact birth time and location",
      "Don't let a type label override your own judgment about what's actually true for you",
    ],
  },
  colors: {
    id: "colors",
    slug: FRAMEWORK_URL_SLUGS.colors,
    label: ASSESSMENT_CATALOG.colors.label,
    tagline: ASSESSMENT_CATALOG.colors.tagline,
    intro:
      "A fast, visual read on dominant behavioral style — driven, analytical, supportive, or expressive — popular in team-building and corporate training for how quickly it gives a group shared vocabulary.",
    origin:
      "The red/blue/green/yellow color model is a popularized descendant of DISC (Dominance, Influence, Steadiness, Conscientiousness), a behavioral framework that traces to William Moulton Marston's 1928 book Emotions of Normal People. Later trainers and consultants (through programs like True Colors and various commercial DISC assessments) repackaged the same underlying dimensions with colors instead of letters, aimed at corporate and classroom use rather than academic psychology.",
    whatItMeasures:
      "Your dominant behavioral and communication style along two implicit axes — pace (fast-moving vs. steady) and focus (task-oriented vs. people-oriented) — collapsed into whichever single color scores highest for you.",
    dimensions: [
      { name: "Red — The Driver", description: "Fast-paced and task-focused: bold, decisive, results-driven." },
      { name: "Blue — The Analyst", description: "Steady and task-focused: precise, thoughtful, reliable." },
      { name: "Green — The Supporter", description: "Steady and people-focused: warm, patient, dependable." },
      { name: "Yellow — The Inspirer", description: "Fast-paced and people-focused: energetic, sociable, optimistic." },
    ],
    howItsScoredHere:
      "12 forced-choice questions, each option weighted toward one or more colors. Weights are totaled across all your answers, and whichever color scores highest becomes your dominant style — the same single-winner approach the questionnaire uses for Human Design.",
    standing: {
      summary: "Popular training tool, limited academic validation",
      detail:
        "Color-coded behavioral-style models are genuinely useful in corporate and team settings for their simplicity — everyone can hold four colors in mind in a way five continuous Big Five traits are harder to. But they haven't been through the same peer-reviewed validation process as Big Five, and collapsing behavior down to one dominant color glosses over the blend most people actually show across different situations.",
    },
    goodFor: [
      "A fast icebreaker or shared vocabulary for a team or classroom",
      "A quick read on someone's default pace and focus in a work setting",
      "Spotting likely friction points between two very different working styles",
    ],
    keepInMind: [
      "Most people are a blend of two or more colors depending on context, not a pure single color",
      "It's a style read, not a deep trait model — treat it as a first pass, not the final word",
      "Scores can shift with role or environment more than a trait model like Big Five would",
    ],
  },
};

export function getFrameworkContent(slug: string): FrameworkContent | null {
  const framework = ASSESSMENT_ORDER.find((id) => FRAMEWORK_URL_SLUGS[id] === slug);
  return framework ? FRAMEWORK_CONTENT[framework] : null;
}

export const FRAMEWORK_ORDER = ASSESSMENT_ORDER;
