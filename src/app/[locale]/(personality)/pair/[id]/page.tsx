import { redirect } from "next/navigation";
import NextLink from "next/link";
import { GitCompareArrows } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPairingPreview } from "../actions";
import { relationshipFramingFor } from "@/components/personality/compatibility/relationshipFraming";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";
import type { PersonalityResults } from "@/lib/personality/types";
import { PairInviteResponse } from "./PairInviteResponse";
import { loginRedirectTarget, localizedPath } from "@/lib/i18n/serverRedirect";

export default async function PairInvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: code } = await params;
  const preview = await getPairingPreview(code);

  if (!preview) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Invite Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This invite link doesn&apos;t match anything, or has expired.
        </p>
      </div>
    );
  }

  if (preview.status === "accepted") {
    redirect(await localizedPath(`/pair/${preview.id}/report`));
  }

  if (preview.status !== "pending") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Invite No Longer Available</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This invite has already been {preview.status === "declined" ? "declined" : "revoked"}.
        </p>
      </div>
    );
  }

  const framing = relationshipFramingFor(preview.relationship_type);
  const inviterName = preview.inviter_display_name || "Someone";

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  let readyToRespond = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("results").eq("id", user.id).maybeSingle();
    const results = (profile?.results as PersonalityResults) || {};
    readyToRespond = generateCombinedProfile(results) !== null;
  }

  // /login lives outside locale routing, so this must use next/link (not
  // @/i18n/navigation's Link, which would wrongly locale-prefix it into a
  // dead /de/login-style 404) — see src/lib/i18n/serverRedirect.ts.
  const loginHref = !user ? await loginRedirectTarget(`/pair/${code}`) : null;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--spatial-glow)] to-[var(--spatial-glow-2)] text-white">
        <GitCompareArrows className="size-5" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {framing.label} compatibility
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {inviterName} wants to compare compatibility with you
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        Take Colevitate&apos;s four personality assessments (or finish the ones you&apos;ve started) to see how
        your Combined Profiles line up as {framing.label.toLowerCase()}s.
      </p>

      <div className="mt-8 w-full">
        {!user ? (
          <NextLink
            href={loginHref!}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Sign in to respond
          </NextLink>
        ) : !readyToRespond ? (
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Finish your assessments
          </Link>
        ) : (
          <PairInviteResponse code={code} inviterName={inviterName} />
        )}
      </div>
    </div>
  );
}
