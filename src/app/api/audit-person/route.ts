import { NextResponse } from "next/server";

// Simple in-memory per-instance rate limit — resets on redeploy/cold start,
// not shared across serverless instances. Good enough to blunt casual abuse
// of a paid-per-call LLM endpoint without adding new infra (Redis, etc.).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

const BIG_FIVE_TRAITS = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"] as const;
const COLORS = ["red", "blue", "green", "yellow"] as const;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    recognized: {
      type: "BOOLEAN",
      description:
        "True only if this is a real, well-documented public figure you have enough public-behavior/biography detail on to ground a specific rationale. False for private individuals, fictional characters, minors, or anyone you don't have solid public information about.",
    },
    canonicalName: { type: "STRING", description: "The person's full common name." },
    bio: { type: "STRING", description: "One factual sentence: who they are, in the style of a Wikipedia opening line." },
    mbtiCode: { type: "STRING", description: "Four-letter uppercase MBTI code, e.g. INTJ." },
    mbtiRationale: {
      type: "STRING",
      description: "2-3 sentences grounding this MBTI code in a specific, well-documented public behavior or biographical fact about this exact person. Never generic trait description.",
    },
    color: { type: "STRING", enum: [...COLORS] },
    colorRationale: { type: "STRING", description: "1-2 sentences grounding the Colors-framework pick in specific behavior." },
    bigFiveTrait: { type: "STRING", enum: [...BIG_FIVE_TRAITS] },
    bigFiveDirection: { type: "STRING", enum: ["high", "low"] },
    bigFiveRationale: { type: "STRING", description: "1-2 sentences grounding this Big Five trait pick in specific behavior." },
  },
  required: ["recognized", "canonicalName", "bio", "mbtiCode", "mbtiRationale", "color", "colorRationale", "bigFiveTrait", "bigFiveDirection", "bigFiveRationale"],
} as const;

const SYSTEM_INSTRUCTION = `You are Colevitate's editorial personality-typing assistant. Colevitate publishes speculative, editorial personality-type "read"s of well-known public figures across MBTI, a 4-Color framework (red/blue/green/yellow), and Big Five — always grounded in specific, well-documented public behavior or biography, and always explicitly framed as Colevitate's own editorial take, never as fact or as the person's own quiz result.

Rules:
- Only produce a typing for a real, well-documented public figure (historical or living) — scientists, authors, entertainers, athletes, business leaders, politicians, artists, activists, etc. Set recognized=false for: private/non-public individuals, minors, fictional or invented characters, or anyone you don't have enough genuine public-behavior detail on to write a specific (not generic) rationale.
- Every rationale must cite something the person actually, specifically did or said — not a generic trait description that could apply to anyone with that type.
- Never claim the typing is factual, official, or the person's own result.
- Keep rationale text concise, in an editorial-but-grounded tone (no hedging phrases like "I think" or "probably" in the text itself — just state the specific behavioral grounding).`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI audit is not configured yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  let name: string;
  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Enter a name to search." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: `Famous person to type: "${name}"` }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.4,
          },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "The AI audit service is unavailable right now." }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") {
      return NextResponse.json({ error: "Couldn't generate an audit for that search." }, { status: 502 });
    }

    const parsed = JSON.parse(text);

    if (!parsed.recognized) {
      return NextResponse.json(
        { error: `We don't have enough public information about "${name}" to generate a grounded audit.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: String(parsed.canonicalName ?? name),
      bio: String(parsed.bio ?? ""),
      typings: [
        { framework: "mbti", code: String(parsed.mbtiCode ?? "").toUpperCase(), rationale: String(parsed.mbtiRationale ?? "") },
        { framework: "colors", code: String(parsed.color ?? ""), rationale: String(parsed.colorRationale ?? "") },
        {
          framework: "bigfive",
          code: `${parsed.bigFiveTrait}-${parsed.bigFiveDirection}`,
          rationale: String(parsed.bigFiveRationale ?? ""),
        },
      ],
    });
  } catch {
    return NextResponse.json({ error: "Couldn't generate an audit for that search." }, { status: 502 });
  }
}
