// Shared copy for the /personality landing page, extracted so every design
// concept in /experiments renders identical content — only the visual
// language changes between concepts.

export const navContent = {
  brand: "Personality Studio",
};

export const heroContent = {
  eyebrow: "Four frameworks, one profile",
  titleLead: "Know yourself,",
  titleAccent: "from every angle",
  subtitle:
    "Take any combination of four well-known personality frameworks — each just a few minutes — and weave the results into one combined profile of who you are.",
};

export interface AssessmentCopy {
  id: string;
  code: string;
  label: string;
  tagline: string;
  description: string;
  questionCount: number;
  resultSummary: string;
}

export const assessments: AssessmentCopy[] = [
  {
    id: "mbti",
    code: "MBTI",
    label: "16 Personalities",
    tagline: "Cognitive style & type",
    description:
      "A 4-letter typology across how you focus your energy, take in information, make decisions, and structure your life.",
    questionCount: 12,
    resultSummary: "ENFJ · The Mentor",
  },
  {
    id: "bigfive",
    code: "OCEAN",
    label: "Big Five",
    tagline: "The OCEAN model",
    description:
      "The most research-backed model in personality science — five broad traits scored on a continuous spectrum.",
    questionCount: 10,
    resultSummary: "The Collaborator",
  },
  {
    id: "humandesign",
    code: "HD",
    label: "Human Design",
    tagline: "Energy type & strategy",
    description:
      "A simplified self-reflection quiz inspired by Human Design's energy types, decision strategy, and inner authority.",
    questionCount: 10,
    resultSummary: "The Generator",
  },
  {
    id: "colors",
    code: "COLOR",
    label: "4 Color Types",
    tagline: "Red · Blue · Green · Yellow",
    description:
      "A fast, visual read on your dominant behavioral style — driven, analytical, supportive, or expressive.",
    questionCount: 12,
    resultSummary: "Yellow — The Inspirer",
  },
];

export const combinedContent = {
  title: "Your Combined Profile",
  body: "You've completed 4 of 4 assessments. Generate a single, cohesive profile that weaves your results together.",
  cta: "Generate Combined Profile",
};

export const footerContent = {
  brand: "Personality Studio",
  tagline: "Client-side and private — your results never leave your browser.",
};
