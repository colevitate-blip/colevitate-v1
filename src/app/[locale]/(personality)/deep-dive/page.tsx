import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Briefcase, Heart, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import { generateDeepDiveReport, type DeepDiveReport } from "@/lib/personality/generateDeepDiveReport";
import type { PersonalityResults } from "@/lib/personality/types";
import { UnlockDeepDiveButton } from "./UnlockDeepDiveButton";

export const metadata: Metadata = { title: "Deep Dive Report | Colevitate", robots: { index: false, follow: false } };

async function loadOrGenerateReport(userId: string, existing: { id: string; report: DeepDiveReport | null }, profile: NonNullable<ReturnType<typeof generateCombinedProfile>>) {
  if (existing.report) return existing.report;

  const report = await generateDeepDiveReport(profile);
  if (!report) return null;

  // Best-effort cache write — a paying user still gets their freshly
  // generated report back even if this fails (missing service-role key,
  // a transient DB error), just without it being cached for next time.
  // Guard on report is null so a rare concurrent double-render can't
  // clobber a report a parallel request already generated and wrote.
  try {
    await createServiceRoleClient()
      .from("deep_dive_purchases")
      .update({ report, report_generated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .is("report", null);
  } catch (error) {
    console.error("Failed to cache deep dive report:", error);
  }

  return report;
}

export default async function DeepDivePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect(await loginRedirectTarget("/deep-dive"));
  }

  const { data: profileRow } = await supabase.from("profiles").select("results").eq("id", user.id).maybeSingle();
  const results = (profileRow?.results as PersonalityResults) || {};
  const profile = generateCombinedProfile(results);

  const { data: purchase } = await supabase
    .from("deep_dive_purchases")
    .select("id, status, report")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Not quite ready yet</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Complete at least two assessments to build a Combined Profile — the Deep Dive Report expands on it.
        </p>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your Deep Dive Report</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A longer, AI-expanded read on {profile.archetype?.name ?? "your combination of traits"} — career fit,
          relationship patterns, and growth edges, grounded in your own axis scores.
        </p>
        <div className="mt-6">
          <UnlockDeepDiveButton />
        </div>
      </div>
    );
  }

  const report = await loadOrGenerateReport(user.id, { id: purchase.id, report: purchase.report as DeepDiveReport | null }, profile);

  if (!report) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Report generation failed</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your purchase is confirmed — refresh this page and we&apos;ll try generating your report again.
        </p>
      </div>
    );
  }

  const sections = [
    { icon: Briefcase, title: "Career Fit", body: report.careerFit },
    { icon: Heart, title: "Relationship Patterns", body: report.relationshipPatterns },
    { icon: TrendingUp, title: "Growth Edges", body: report.growthEdges },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Deep Dive Report</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        An expanded, AI-assisted read on {profile.archetype?.name ?? "your combined profile"}, grounded in your own
        axis scores and per-framework results.
      </p>

      <div className="mt-8 space-y-6">
        {sections.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <Icon className="size-4" />
              </div>
              <h2 className="font-semibold">{title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
