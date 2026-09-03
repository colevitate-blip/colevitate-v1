import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { FAMOUS_PEOPLE } from "@/lib/seo/famousPeopleContent";

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

const TYPING_PROPERTIES = {
  gender: {
    type: "string",
    enum: ["man", "woman"],
    description: "This person's gender, for phrasing their result page in he/she pronouns rather than you. Best guess is fine.",
  },
  mbtiCode: { type: "string", description: "Four-letter uppercase MBTI code, e.g. INTJ." },
  mbtiRationale: {
    type: "string",
    description: "2-3 sentences grounding this MBTI code in specific, concrete behavior. Never generic trait description.",
  },
  color: { type: "string", enum: [...COLORS] },
  colorRationale: { type: "string", description: "1-2 sentences grounding the Colors-framework pick in specific behavior." },
  bigFiveTrait: { type: "string", enum: [...BIG_FIVE_TRAITS] },
  bigFiveDirection: { type: "string", enum: ["high", "low"] },
  bigFiveRationale: { type: "string", description: "1-2 sentences grounding this Big Five trait pick in specific behavior." },
} as const;
const TYPING_REQUIRED = ["gender", "mbtiCode", "mbtiRationale", "color", "colorRationale", "bigFiveTrait", "bigFiveDirection", "bigFiveRationale"] as const;

const PERSON_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    recognized: {
      type: "boolean",
      description:
        "True only if this is a real, well-documented public figure you have enough public-behavior/biography detail on to ground a specific rationale. False for private individuals, fictional characters, minors, or anyone you don't have solid public information about.",
    },
    canonicalName: { type: "string", description: "The person's full common name." },
    bio: { type: "string", description: "One factual sentence: who they are, in the style of a Wikipedia opening line." },
    ...TYPING_PROPERTIES,
  },
  required: ["recognized", "canonicalName", "bio", ...TYPING_REQUIRED],
  additionalProperties: false,
} as const;

const PERSON_SYSTEM_INSTRUCTION = `You are Colevitate's editorial personality-typing assistant. Colevitate publishes speculative, editorial personality-type "read"s of well-known public figures across MBTI, a 4-Color framework (red/blue/green/yellow), and Big Five — always grounded in specific, well-documented public behavior or biography, and always explicitly framed as Colevitate's own editorial take, never as fact or as the person's own quiz result.

Rules:
- Only produce a typing for a real, well-documented public figure (historical or living) — scientists, authors, entertainers, athletes, business leaders, politicians, artists, activists, etc. Set recognized=false for: private/non-public individuals, minors, fictional or invented characters, or anyone you don't have enough genuine public-behavior detail on to write a specific (not generic) rationale.
- Every rationale must cite something the person actually, specifically did or said — not a generic trait description that could apply to anyone with that type.
- Never claim the typing is factual, official, or the person's own result.
- Keep rationale text concise, in an editorial-but-grounded tone (no hedging phrases like "I think" or "probably" in the text itself — just state the specific behavioral grounding).`;

// "Type a friend" mode (Tier 2.2, see prompt.md): same typing shape as the
// public-figure mode above, but grounded in a description the caller writes
// themselves rather than public information — so there's no recognized/bio
// gate here, just the typing fields.
const FRIEND_RESPONSE_SCHEMA = {
  type: "object",
  properties: TYPING_PROPERTIES,
  required: [...TYPING_REQUIRED],
  additionalProperties: false,
} as const;

const FRIEND_SYSTEM_INSTRUCTION = `You are Colevitate's editorial personality-typing assistant. A user is describing someone they know personally (a friend, partner, family member, or coworker) in their own words, and wants a speculative, editorial personality read across MBTI, a 4-Color framework (red/blue/green/yellow), and Big Five — grounded only in the description they provide, never in any outside or public information about anyone.

Rules:
- Ground every rationale in something specific from the user's own description — never invent behavior the description doesn't mention, and never pad with generic trait language that could apply to anyone with that type.
- Never claim the typing is factual, official, clinical, or the described person's own result — it's the user's own editorial read, assisted by AI.
- Keep rationale text concise, in an editorial-but-grounded tone (no hedging phrases like "I think" or "probably" — just state the specific grounding from the description).`;

const ROSTER_NAMES = new Set(FAMOUS_PEOPLE.map((p) => p.name.toLowerCase()));

/**
 * Fire-and-forget growth-backlog log: only for names the editorial roster
 * doesn't already cover, so `audit_search_log` stays a queue of who to add
 * next rather than a duplicate of the roster itself. Never awaited by the
 * request — a logging failure must not affect the audit response. Never
 * called for friend-mode audits — those aren't public figures at all.
 */
function logMissingRosterSearch(rawName: string, canonicalName: string): void {
  if (ROSTER_NAMES.has(canonicalName.toLowerCase())) return;
  try {
    createServiceRoleClient()
      .from("audit_search_log")
      .insert({ name: rawName, canonical_name: canonicalName })
      .then(({ error }) => {
        if (error) console.error("Failed to log audit search:", error.message);
      });
  } catch (error) {
    // createServiceRoleClient() throws synchronously if
    // SUPABASE_SERVICE_ROLE_KEY isn't configured — catch that here too, not
    // just insert() failures, so a logging-only misconfiguration can never
    // take down the actual audit response.
    console.error("Failed to log audit search:", error);
  }
}

interface GeminiTypings {
  gender: string;
  mbtiCode: string;
  mbtiRationale: string;
  color: string;
  colorRationale: string;
  bigFiveTrait: string;
  bigFiveDirection: string;
  bigFiveRationale: string;
}

function toGender(parsed: GeminiTypings): "man" | "woman" {
  return parsed.gender === "woman" ? "woman" : "man";
}

function toTypings(parsed: GeminiTypings) {
  return [
    { framework: "mbti" as const, code: String(parsed.mbtiCode ?? "").toUpperCase(), rationale: String(parsed.mbtiRationale ?? "") },
    { framework: "colors" as const, code: String(parsed.color ?? ""), rationale: String(parsed.colorRationale ?? "") },
    {
      framework: "bigfive" as const,
      code: `${parsed.bigFiveTrait}-${parsed.bigFiveDirection}`,
      rationale: String(parsed.bigFiveRationale ?? ""),
    },
  ];
}

async function callMistral(apiKey: string, systemInstruction: string, prompt: string, schemaName: string, schema: object) {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_schema", json_schema: { name: schemaName, strict: true, schema } },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") return null;
  return JSON.parse(text);
}

async function handlePersonAudit(apiKey: string, rawName: unknown) {
  const name = typeof rawName === "string" ? rawName.trim() : "";
  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Enter a name to search." }, { status: 400 });
  }

  const parsed = await callMistral(apiKey, PERSON_SYSTEM_INSTRUCTION, `Famous person to type: "${name}"`, "person_audit", PERSON_RESPONSE_SCHEMA);
  if (!parsed) {
    return NextResponse.json({ error: "Couldn't generate an audit for that search." }, { status: 502 });
  }

  if (!parsed.recognized) {
    return NextResponse.json(
      { error: `We don't have enough public information about "${name}" to generate a grounded audit.` },
      { status: 404 }
    );
  }

  const canonicalName = String(parsed.canonicalName ?? name);
  logMissingRosterSearch(name, canonicalName);

  return NextResponse.json({
    name: canonicalName,
    bio: String(parsed.bio ?? ""),
    gender: toGender(parsed),
    typings: toTypings(parsed),
  });
}

async function handleFriendAudit(apiKey: string, rawName: unknown, rawDescription: unknown) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "Log in to type a friend." }, { status: 401 });
  }

  const name = typeof rawName === "string" ? rawName.trim() : "";
  const description = typeof rawDescription === "string" ? rawDescription.trim() : "";
  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Enter their name." }, { status: 400 });
  }
  if (description.length < 20) {
    return NextResponse.json({ error: "Add a bit more detail — at least a couple of sentences about how they act." }, { status: 400 });
  }
  if (description.length > 1000) {
    return NextResponse.json({ error: "That description is too long — keep it under 1000 characters." }, { status: 400 });
  }

  const parsed = await callMistral(
    apiKey,
    FRIEND_SYSTEM_INSTRUCTION,
    `Name: "${name}"\nDescription written by the person typing them:\n"${description}"`,
    "friend_audit",
    FRIEND_RESPONSE_SCHEMA
  );
  if (!parsed) {
    return NextResponse.json({ error: "Couldn't generate an audit for that description." }, { status: 502 });
  }

  return NextResponse.json({ name, bio: "", gender: toGender(parsed), typings: toTypings(parsed) });
}

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI audit is not configured yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  let body: { name?: unknown; description?: unknown; mode?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    if (body?.mode === "friend") {
      return await handleFriendAudit(apiKey, body.name, body.description);
    }
    return await handlePersonAudit(apiKey, body?.name);
  } catch {
    return NextResponse.json({ error: "Couldn't generate an audit for that search." }, { status: 502 });
  }
}
