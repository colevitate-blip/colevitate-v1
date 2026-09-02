"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { COLOR_THEME } from "@/lib/personality/theme";
import type { ColorId } from "@/lib/personality/types";

interface FriendAuditTyping {
  framework: "mbti" | "colors" | "bigfive";
  code: string;
  rationale: string;
}

interface FriendAuditResult {
  name: string;
  typings: FriendAuditTyping[];
}

const FRAMEWORK_LABEL: Record<FriendAuditTyping["framework"], string> = {
  mbti: "MBTI",
  colors: "Colors",
  bigfive: "Big Five",
};

function formatBigFiveCode(code: string): string {
  const [trait, direction] = code.split("-");
  if (!trait || !direction) return code;
  return `${trait[0].toUpperCase()}${trait.slice(1)} — ${direction === "high" ? "High" : "Low"}`;
}

/** Auth-gated sibling of PersonAuditSearch (Tier 2.2, see prompt.md): types someone the user personally knows, grounded in a description they write rather than public information. */
export function TypeAFriendSearch({ isLoggedIn, loginHref }: { isLoggedIn: boolean; loginHref: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<FriendAuditResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName || trimmedDescription.length < 20 || status === "loading") return;

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/audit-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, description: trimmedDescription, mode: "friend" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Couldn't generate a read for that description.");
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("done");
    } catch {
      setError("Couldn't reach the audit service — try again.");
      setStatus("error");
    }
  }

  return (
    <div className="mt-6 rounded-2xl border bg-muted/20 p-5">
      <h2 className="text-lg font-semibold tracking-tight">Type a friend</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe how someone you know acts and our AI will draft a speculative read to share with them — no quiz
        required on their end.
      </p>

      {!isLoggedIn ? (
        <p className="mt-4 text-sm">
          <Link href={loginHref} className="font-medium text-primary underline underline-offset-2">
            Log in to type a friend
          </Link>
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Their name or nickname"
            maxLength={100}
            aria-label="Friend's name"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Always the one organizing the group trip weeks in advance, but gets quiet and needs a day alone after a big social weekend..."
            maxLength={1000}
            rows={4}
            aria-label="Describe how they act"
          />
          <Button type="submit" disabled={status === "loading" || !name.trim() || description.trim().length < 20}>
            {status === "loading" ? "Typing…" : "Get their read"}
          </Button>
        </form>
      )}

      {status === "error" ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      {status === "done" && result ? (
        <div className="mt-5 rounded-2xl border bg-background p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              AI-generated, from your description
            </Badge>
            <h3 className="text-base font-semibold">{result.name}</h3>
          </div>

          <div className="mt-3 rounded-xl border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">This read is only as good as the description above</strong> — it&apos;s
            your own editorial take on {result.name}, assisted by AI, not a factual or clinical assessment.
          </div>

          <div className="mt-4 space-y-3">
            {result.typings.map((typing, i) => {
              const colorTheme = typing.framework === "colors" ? COLOR_THEME[typing.code as ColorId] : null;
              return (
                <div key={`${typing.framework}-${i}`} className="rounded-xl border p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {FRAMEWORK_LABEL[typing.framework]}
                    </Badge>
                    <span className={`text-sm font-semibold ${colorTheme?.text ?? ""}`}>
                      {typing.framework === "bigfive"
                        ? formatBigFiveCode(typing.code)
                        : typing.framework === "colors"
                          ? (colorTheme?.label ?? typing.code)
                          : typing.code}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{typing.rationale}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
