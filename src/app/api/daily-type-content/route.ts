import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { getArchetypeByKey } from "@/components/personality/combined/archetypeMatrix";

const SYSTEM_INSTRUCTION = `You are Colevitate's editorial personality-content writer. Given an archetype name and description, write one short, concrete, practical sentence (max ~220 characters) about how someone with that archetype might approach an ordinary, everyday moment today — a meeting, a weekend plan, a disagreement, a to-do list, vary it — grounded in the archetype's actual traits. Specific and useful, not generic or astrology-vague. No hedging language, no second-person warnings — just the observation itself, as one plain sentence with no surrounding quotes.`;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? "";
  const archetype = getArchetypeByKey(key);
  if (!archetype) {
    return NextResponse.json({ error: "Unknown archetype." }, { status: 400 });
  }

  const date = todayUtc();

  // Client construction throws synchronously if SUPABASE_SERVICE_ROLE_KEY
  // isn't configured — treated the same as a cache miss (supabase stays
  // null and every use below is guarded) rather than letting it 500 what's
  // meant to be a best-effort card.
  let supabase: ReturnType<typeof createServiceRoleClient> | null = null;
  try {
    supabase = createServiceRoleClient();
    const { data: cached } = await supabase
      .from("daily_type_content")
      .select("content")
      .eq("archetype_key", key)
      .eq("content_date", date)
      .maybeSingle();

    if (cached?.content) {
      return NextResponse.json({ content: cached.content });
    }
  } catch (error) {
    console.error("Failed to read daily type content cache:", error);
  }

  // No key configured, or the call below fails — fall back to the
  // archetype's own static description rather than a 4xx/5xx. This is a
  // nice-to-have card on the combined profile, never something worth
  // blocking or erroring the page over.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ content: archetype.description });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: `Archetype: "${archetype.name}" — ${archetype.description}` }] }],
          generationConfig: { temperature: 0.8 },
        }),
      }
    );
    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const content = text?.trim() || archetype.description;

    // Best-effort cache write, not awaited — a write failure (or a rare
    // concurrent-first-request race on the same key+date) shouldn't affect
    // this response; upsert rather than insert so that race just overwrites
    // with an equally valid generated sentence instead of erroring. Skipped
    // entirely if the client above never came up.
    try {
      supabase
        ?.from("daily_type_content")
        .upsert({ archetype_key: key, content_date: date, content })
        .then(({ error }) => {
          if (error) console.error("Failed to cache daily type content:", error.message);
        });
    } catch (error) {
      console.error("Failed to cache daily type content:", error);
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: archetype.description });
  }
}
