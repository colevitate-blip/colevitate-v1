"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { COLOR_THEME } from "@/lib/personality/theme";
import type { ColorId } from "@/lib/personality/types";
import { usePersonality } from "@/lib/personality/context";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import { CompatibilityReportView } from "@/components/personality/compatibility/CompatibilityReportView";
import { RelationshipTypeToggle } from "@/components/personality/compatibility/RelationshipTypeToggle";
import type { RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import { deriveFamousPersonProfile, deriveFamousPersonResults } from "@/components/seo/famousPersonResults";
import { FamousPersonInsights } from "@/components/seo/FamousPersonInsights";
import type { FamousPersonTyping } from "@/lib/seo/famousPeopleContent";

interface AuditResult {
  name: string;
  bio: string;
  gender: "man" | "woman";
  typings: FamousPersonTyping[];
}

const FRAMEWORK_LABEL: Record<FamousPersonTyping["framework"], string> = {
  mbti: "MBTI",
  colors: "Colors",
  bigfive: "Big Five",
  humandesign: "Human Design",
};

function formatBigFiveCode(code: string): string {
  const [trait, direction] = code.split("-");
  if (!trait || !direction) return code;
  return `${trait[0].toUpperCase()}${trait.slice(1)} — ${direction === "high" ? "High" : "Low"}`;
}

/** Not in FAMOUS_PEOPLE? Type any famous person's name and Mistral drafts a same-shaped speculative audit on the spot — clearly marked as AI-generated, unreviewed, distinct from the editorial roster above. The audit reuses the exact same combined-profile/graph and compatibility machinery a real user gets on /combined and /people/match, by deriving a synthetic PersonalityResults from the AI's typings (see famousPersonResults.ts). */
export function PersonAuditSearch() {
  const { mounted, results: myResults } = usePersonality();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("friend");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || status === "loading") return;

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/audit-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Couldn't generate an audit for that search.");
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

  const auditedProfile = result ? deriveFamousPersonProfile(result) : null;
  const auditedResults = result ? deriveFamousPersonResults(result) : null;
  const myProfile = mounted ? generateCombinedProfile(myResults) : null;

  let compareSection: React.ReactNode = null;
  if (result && auditedResults) {
    if (myProfile) {
      const viewerAxes = computeScoringMatrix(myResults);
      const personAxes = computeScoringMatrix(auditedResults);
      const compatibility = computeCompatibility(viewerAxes, personAxes, "You", result.name);
      compareSection = (
        <div className="mt-8">
          <div className="flex justify-center">
            <RelationshipTypeToggle value={relationshipType} onSelect={setRelationshipType} />
          </div>
          <CompatibilityReportView
            compatibility={compatibility}
            nameA="You"
            nameB={result.name}
            relationshipType={relationshipType}
            shareLevel="axes"
          />
        </div>
      );
    } else if (mounted) {
      compareSection = (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary underline underline-offset-2">
            Complete at least 2 assessments
          </Link>{" "}
          to see how you compare with {result.name}.
        </p>
      );
    }
  }

  return (
    <div className="mt-10 rounded-2xl border bg-muted/20 p-5">
      <h2 className="text-lg font-semibold tracking-tight">Search any famous person</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Not in the roster above? Type any well-known name and our AI will draft a speculative audit on the spot.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Frida Kahlo"
          maxLength={100}
          aria-label="Search a famous person"
        />
        <Button type="submit" disabled={status === "loading" || !name.trim()}>
          {status === "loading" ? "Auditing…" : "Audit"}
        </Button>
      </form>

      {status === "error" ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      {status === "done" && result ? (
        <div className="mt-5 rounded-2xl border bg-background p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              AI-generated audit
            </Badge>
            <h3 className="text-base font-semibold">{result.name}</h3>
          </div>
          {result.bio ? <p className="mt-2 text-sm text-muted-foreground">{result.bio}</p> : null}

          <div className="mt-3 rounded-xl border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Unlike the roster above, this audit is generated live by AI and has
            not been reviewed by a Colevitate editor.</strong> It&apos;s a speculative read grounded in whatever
            public information the model has, not a factual statement or the person&apos;s own quiz result.
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

          {auditedProfile && auditedResults ? (
            <FamousPersonInsights
              name={result.name}
              gender={result.gender}
              profile={auditedProfile}
              results={auditedResults}
            />
          ) : null}
        </div>
      ) : null}

      {compareSection}
    </div>
  );
}
