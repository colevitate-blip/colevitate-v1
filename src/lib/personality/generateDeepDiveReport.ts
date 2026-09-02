import type { CombinedProfile } from "@/components/personality/combined/generateCombinedProfile";

export interface DeepDiveReport {
  careerFit: string;
  relationshipPatterns: string;
  growthEdges: string;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    careerFit: {
      type: "STRING",
      description:
        "4-6 sentences on the kinds of roles, work environments, and team dynamics that tend to suit this exact combination of traits — specific, not generic career-quiz language.",
    },
    relationshipPatterns: {
      type: "STRING",
      description:
        "4-6 sentences on how this person likely shows up in close relationships (romantic, friend, family) — what they offer, what they need, and a real friction pattern to watch for.",
    },
    growthEdges: {
      type: "STRING",
      description:
        "4-6 sentences on the specific, non-obvious growth edges this combination of traits tends to produce, and one concrete way to work with (not against) them.",
    },
  },
  required: ["careerFit", "relationshipPatterns", "growthEdges"],
} as const;

const SYSTEM_INSTRUCTION = `You are Colevitate's editorial personality-insight writer, producing the paid "Deep Dive" section of a user's Combined Profile — a longer, more specific expansion of the free summary they've already seen, not a repeat of it. Write directly to the user as "you". Ground everything in the exact axis scores, archetype, and per-framework threads provided — never generic personality-quiz filler that could apply to any type. Confident and specific, no hedging language ("might", "could potentially"), but never clinical or deterministic — this is an editorial read, not a diagnosis.`;

function buildPrompt(profile: CombinedProfile): string {
  const axesLines = profile.axes
    .map((a) => `- ${a.label}: ${a.score} (${a.leftPole} at -100, ${a.rightPole} at +100)`)
    .join("\n");
  const threadLines = profile.threads
    .map((t) => `- ${t.label} (${t.code}) — ${t.name}: ${t.tagline}. Strengths: ${t.strengths.join(", ")}. Growth areas: ${t.growth.join(", ")}.`)
    .join("\n");

  return `Archetype: ${profile.archetype?.name ?? profile.headline} — ${profile.archetype?.description ?? profile.subtitle}

Axis scores:
${axesLines}

Per-framework threads:
${threadLines}`;
}

/** Server-only — calls Gemini to produce the paid Deep Dive Report content. Returns null on any failure so the caller can retry on next view rather than caching a bad/empty report. */
export async function generateDeepDiveReport(profile: CombinedProfile): Promise<DeepDiveReport | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: buildPrompt(profile) }] }],
          generationConfig: { responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA, temperature: 0.6 },
        }),
      }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") return null;

    const parsed = JSON.parse(text);
    if (!parsed.careerFit || !parsed.relationshipPatterns || !parsed.growthEdges) return null;

    return {
      careerFit: String(parsed.careerFit),
      relationshipPatterns: String(parsed.relationshipPatterns),
      growthEdges: String(parsed.growthEdges),
    };
  } catch {
    return null;
  }
}
