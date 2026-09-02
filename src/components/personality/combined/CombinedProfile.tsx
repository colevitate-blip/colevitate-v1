"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/navigation";
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Leaf,
  SlidersHorizontal,
  Fingerprint,
  Share2,
  Loader2,
  Target,
  Briefcase,
  History,
  Link2,
  Check,
  Copy,
  X,
  FileDown,
  GitCompareArrows,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { accentForFramework } from "@/lib/personality/theme";
import {
  appendHistorySnapshot,
  appendRemoteHistorySnapshot,
  loadHistory,
  loadRemoteHistory,
} from "@/lib/personality/storage";
import type { CombinedSnapshot, PersonalityResults, ProgressMap } from "@/lib/personality/types";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { enableSharing } from "@/app/[locale]/(personality)/settings/actions";
import { createPairingInvite } from "@/app/[locale]/(personality)/pair/actions";
import { RELATIONSHIP_TYPE_ORDER, relationshipFramingFor, type RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import { AxisAgreement } from "@/components/personality/shared/AxisAgreement";
import { getAxisGrowthPrompt, getCareerSuggestions } from "./growthContent";
import { getArchetypeKey } from "./archetypeMatrix";
import { AxisTrend } from "./AxisTrend";
import { DailyTypeInsight } from "./DailyTypeInsight";
import { ShareCard } from "./ShareCard";
import { PdfDocument } from "./PdfDocument";
import { exportProfileAsPdf } from "./exportPdf";
import { PersonalityGraphCard } from "./PersonalityGraphCard";
import type { CombinedProfile as CombinedProfileData } from "./generateCombinedProfile";

export function CombinedProfile({
  profile,
  results,
  progress = {},
  recordHistory = true,
}: {
  profile: CombinedProfileData;
  results: PersonalityResults;
  progress?: ProgressMap;
  recordHistory?: boolean;
}) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const { resolvedTheme } = useTheme();
  const { user, profileMeta } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const careerSuggestions = getCareerSuggestions(profile.axes);
  const [history, setHistory] = useState<CombinedSnapshot[]>([]);
  // Only set once sharing is newly enabled from this page — otherwise the
  // slug/public state is read straight from profileMeta (context), not mirrored into state.
  const [freshShareSlug, setFreshShareSlug] = useState<string | null>(null);
  const [isEnablingShare, setIsEnablingShare] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isEnablingCompare, setIsEnablingCompare] = useState(false);
  const [pickingRelationship, setPickingRelationship] = useState(false);
  // Set once an invite is created — stays visible (not a timed toast) until the
  // person dismisses it, since "a link was copied" needs explaining, not blinking by.
  const [createdInvite, setCreatedInvite] = useState<{ url: string; relationshipLabel: string } | null>(null);
  const [inviteLinkRecopied, setInviteLinkRecopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const axisSignature = profile.axes.map((a) => `${a.id}:${a.score}`).join("|");

  // Every time the combined axes actually change (a fresh completion or
  // retake — not every render), append a timestamped snapshot rather than
  // overwriting, so the trend view below has history to show.
  useEffect(() => {
    async function syncHistory() {
      if (!recordHistory) {
        return;
      }

      let existing = loadHistory();

      // If user is signed in, load remote history and merge
      if (user) {
        const remote = await loadRemoteHistory(user.id);
        const merged = Array.from(
          new Map(
            [...existing, ...remote].map((s) => [
              new Date(s.completedAt).getTime(),
              s,
            ])
          ).values()
        )
          .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
          .slice(-50); // cap at MAX_HISTORY_SNAPSHOTS
        existing = merged;
      }

      const latest = existing[existing.length - 1];
      const latestSignature = latest?.axes.map((a) => `${a.id}:${a.score}`).join("|");
      if (latestSignature !== axisSignature) {
        const snapshot = {
          completedAt: new Date().toISOString(),
          axes: profile.axes.map((a) => ({ id: a.id, score: a.score })),
          archetypeName: profile.archetype?.name,
        };
        const next = appendHistorySnapshot(snapshot);
        setHistory(next);
        // also append to remote if signed in
        if (user) {
          await appendRemoteHistorySnapshot(user.id, snapshot);
        }
      } else {
        setHistory(existing);
      }
    }

    syncHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- axisSignature is the derived, stable trigger for profile.axes/profile.archetype
  }, [axisSignature, recordHistory, user]);

  async function handleShare() {
    if (!shareCardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(shareCardRef.current, { scale: 2 });
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      const fileName = `personality-studio-${(profile.archetype?.name ?? "profile")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My Personality Studio profile" });
        } catch {
          // user dismissed the share sheet — nothing to do
        }
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  async function ensureShareSlug() {
    let slug = freshShareSlug ?? profileMeta?.shareSlug ?? null;
    const isPublic = freshShareSlug ? true : (profileMeta?.isPublic ?? false);
    if (!slug || !isPublic) {
      slug = await enableSharing();
      setFreshShareSlug(slug);
    }
    return slug;
  }

  async function handleCopyLink() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isEnablingShare) return;
    setIsEnablingShare(true);
    try {
      const slug = await ensureShareSlug();
      await navigator.clipboard.writeText(`${window.location.origin}/u/${slug}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard/network hiccup — user can retry
    } finally {
      setIsEnablingShare(false);
    }
  }

  function handleCompareClick() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setCreatedInvite(null);
    setInviteError(null);
    setPickingRelationship((v) => !v);
  }

  async function handlePickRelationship(relationshipType: RelationshipType) {
    if (isEnablingCompare) return;
    setIsEnablingCompare(true);
    setInviteError(null);
    try {
      const { code } = await createPairingInvite(relationshipType);
      const url = `${window.location.origin}/pair/${code}`;
      await navigator.clipboard.writeText(url);
      setPickingRelationship(false);
      setCreatedInvite({ url, relationshipLabel: relationshipFramingFor(relationshipType).label.toLowerCase() });
    } catch (err) {
      setPickingRelationship(false);
      setInviteError(err instanceof Error ? err.message : "Something went wrong creating the invite. Try again.");
    } finally {
      setIsEnablingCompare(false);
    }
  }

  function handleRecopyInviteLink() {
    if (!createdInvite) return;
    navigator.clipboard.writeText(createdInvite.url);
    setInviteLinkRecopied(true);
    setTimeout(() => setInviteLinkRecopied(false), 2000);
  }

  async function handleExportPdf() {
    if (!pdfDocRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const fileName = `colevitate-${(profile.archetype?.name ?? "profile")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}.pdf`;
      await exportProfileAsPdf(pdfDocRef.current, fileName);
    } finally {
      setIsExportingPdf(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Overview
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {recordHistory ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                disabled={isEnablingShare}
                className="rounded-full"
              >
                {isEnablingShare ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : linkCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Link2 className="size-4" />
                )}
                {linkCopied ? "Link copied" : "Export as link"}
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompareClick}
                  disabled={isEnablingCompare}
                  className="rounded-full"
                >
                  {isEnablingCompare ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : createdInvite ? (
                    <Check className="size-4" />
                  ) : (
                    <GitCompareArrows className="size-4" />
                  )}
                  {createdInvite ? "Invite created" : "Compare with someone"}
                </Button>
                {pickingRelationship ? (
                  <div className="absolute right-0 top-full z-10 mt-2 flex w-64 flex-col gap-1 rounded-xl border bg-card p-2 shadow-lg">
                    <p className="px-1.5 pb-2 text-xs text-muted-foreground">
                      We&apos;ll create a private link to send them. Once they finish their own assessments and
                      accept, you can both unlock a compatibility report.
                    </p>
                    <p className="px-1.5 pb-1 text-xs font-medium text-foreground">Who are you comparing with?</p>
                    {RELATIONSHIP_TYPE_ORDER.map((type) => (
                      <button
                        key={type}
                        type="button"
                        disabled={isEnablingCompare}
                        onClick={() => handlePickRelationship(type)}
                        className="rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50"
                      >
                        {relationshipFramingFor(type).label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="rounded-full"
              >
                {isExportingPdf ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileDown className="size-4" />
                )}
                Export as PDF
              </Button>
            </>
          ) : null}
          <Button variant="outline" size="sm" onClick={handleShare} disabled={isExporting} className="rounded-full">
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Share2 className="size-4" />
            )}
            Save / Share
          </Button>
        </div>
      </div>

      {inviteError ? (
        <div className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive print:hidden">
          <p>Couldn&apos;t create the invite: {inviteError}</p>
          <Button variant="ghost" size="sm" onClick={() => setInviteError(null)} className="rounded-full shrink-0" aria-label="Dismiss">
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      {createdInvite ? (
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border bg-muted/40 p-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">
              Invite link copied — send it to the {createdInvite.relationshipLabel} you want to compare with.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Once they finish their own assessments and accept, you&apos;ll both be able to unlock a compatibility
              report. Track it anytime under{" "}
              <Link href="/pair" className="underline underline-offset-2 hover:text-foreground">
                Comparisons
              </Link>
              .
            </p>
            <code className="mt-2 block break-all text-xs text-muted-foreground">{createdInvite.url}</code>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
            <Button variant="outline" size="sm" onClick={handleRecopyInviteLink} className="rounded-full">
              {inviteLinkRecopied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {inviteLinkRecopied ? "Copied" : "Copy again"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreatedInvite(null)}
              className="rounded-full"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-[2.5rem] border bg-card p-6 shadow-[0_30px_70px_-20px_var(--elevation-shadow-lg)] sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] opacity-15 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid shrink-0 grid-cols-2 gap-2">
            {profile.threads.map((t) => {
              const accent = accentForFramework(t.id, results);
              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex size-14 items-center justify-center rounded-2xl text-xs font-bold text-white shadow sm:size-16",
                    accent.solid
                  )}
                >
                  {t.code}
                </div>
              );
            })}
          </div>
          <div>
            <Badge variant="outline" className="mb-2 rounded-full">
              Combined Profile
            </Badge>
            {profile.archetype ? (
              <>
                <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  <Fingerprint className="size-6 shrink-0 text-muted-foreground" />
                  {profile.archetype.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
                  {profile.archetype.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground/70">{profile.sourcesLine}</p>
                {(() => {
                  const archetypeKey = getArchetypeKey(profile.axes);
                  return archetypeKey ? (
                    <DailyTypeInsight archetypeKey={archetypeKey} archetypeName={profile.archetype.name} />
                  ) : null;
                })()}
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{profile.headline}</h1>
                <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
                  {profile.subtitle}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="relative mt-8 space-y-4">
          {profile.narrative.map((p, i) => (
            <p key={i} className="max-w-2xl text-base leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <SlidersHorizontal className="size-4" />
          </div>
          <h2 className="font-semibold">Where Your Lenses Agree</h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          On some things, all your lenses land in nearly the same place — that&apos;s signal. On
          others they pull in different directions, and that&apos;s usually not a contradiction,
          it&apos;s just you being a full person depending on context. Here&apos;s what&apos;s
          actually behind the headline above.
        </p>
        <div className="space-y-7">
          {profile.axes.map((axis) => (
            <AxisAgreement key={axis.id} axis={axis} results={results} />
          ))}
        </div>
      </div>

      <PersonalityGraphCard profile={profile} results={results} progress={progress} />

      {history.length > 0 ? (
        <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <History className="size-4" />
            </div>
            <h2 className="font-semibold">How You&apos;ve Moved</h2>
          </div>
          {history.length < 2 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is you, today. Retake any lens in a few months and we&apos;ll show you exactly
              what moved — and what didn&apos;t.
            </p>
          ) : (
            <>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                How each axis has moved across your {history.length} completions, oldest to newest.
              </p>
              <div className="space-y-7">
                {profile.axes.map((axis) => (
                  <AxisTrend key={axis.id} axis={axis} history={history} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <Target className="size-4" />
          </div>
          <h2 className="font-semibold">Where to Lean In</h2>
        </div>
        <div className="space-y-4">
          {profile.axes.map((axis) => {
            const prompt = getAxisGrowthPrompt(axis);
            if (!prompt) return null;
            return (
              <div key={axis.id}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {axis.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">{prompt}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-3xl border bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Want more than this page shows?</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            The Deep Dive Report expands career fit, relationship patterns, and growth edges into a longer,
            AI-assisted read grounded in your own scores.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0 gap-2 rounded-full">
          <Link href="/deep-dive">
            <Lock className="size-4" />
            Unlock Deep Dive
          </Link>
        </Button>
      </div>

      {careerSuggestions.length > 0 ? (
        <div className="mt-8 rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <Briefcase className="size-4" />
            </div>
            <h2 className="font-semibold">Where This Might Fit</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Roles and work styles that tend to suit {profile.archetype?.name ?? "your combination of traits"}.
          </p>
          <ul className="space-y-2.5">
            {careerSuggestions.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <TrendingUp className="size-4" />
            </div>
            <h2 className="font-semibold">Strengths</h2>
          </div>
          <ul className="space-y-2.5">
            {profile.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <Leaf className="size-4" />
            </div>
            <h2 className="font-semibold">Growth areas</h2>
          </div>
          <ul className="space-y-2.5">
            {profile.growth.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-4 text-lg font-semibold">Your Four Lenses</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {profile.threads.map((t) => {
          const accent = accentForFramework(t.id, results);
          const meta = ASSESSMENT_CATALOG[t.id];
          return (
            <Link
              key={t.id}
              href={`/${meta.slug}`}
              className={cn(
                "rounded-2xl border p-5 transition-colors hover:bg-muted/50",
                accent.border
              )}
            >
              <span className={cn("text-xs font-medium", accent.text)}>{t.label}</span>
              <p className="mt-1 font-semibold">{t.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{t.tagline}</p>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This is our synthesis of your four results, not a lab measurement — built to help you see
        the pattern, not to grade you on it.
      </p>

      <div className="mt-8 flex justify-center print:hidden">
        <Button asChild variant="secondary" size="default" className="rounded-full gap-1.5 px-5">
          <Link href="/">
            <ChevronLeft className="size-4" />
            Overview
          </Link>
        </Button>
      </div>

      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden>
        <ShareCard
          ref={shareCardRef}
          profile={profile}
          results={results}
          theme={resolvedTheme === "light" ? "light" : "dark"}
        />
        <PdfDocument ref={pdfDocRef} profile={profile} results={results} careerSuggestions={careerSuggestions} />
      </div>
    </div>
  );
}
