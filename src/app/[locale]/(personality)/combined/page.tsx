"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { usePersonality } from "@/lib/personality/context";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { CombinedProfile } from "@/components/personality/combined/CombinedProfile";
import { PartialProfilePreview } from "@/components/personality/combined/PartialProfilePreview";
import { GuestSaveNotice } from "@/components/auth/GuestSaveNotice";
import { generateCombinedProfile } from "@/components/personality/combined/generateCombinedProfile";

export default function CombinedProfilePage() {
  const { mounted, results, completedIds, progress } = usePersonality();
  const { user, authLoading } = useAuth();

  if (!mounted) return null;

  if (completedIds.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Sparkles className="size-6 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Not quite ready yet</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Complete at least one assessment to start building your combined profile.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to assessments
          </Link>
        </Button>
      </div>
    );
  }

  const showGuestNotice = !authLoading && !user;

  if (completedIds.length === 1) {
    return (
      <>
        {showGuestNotice ? <GuestSaveNotice /> : null}
        <PartialProfilePreview completedId={completedIds[0]} results={results} />
      </>
    );
  }

  const profile = generateCombinedProfile(results);
  if (!profile) return null;

  return (
    <>
      {showGuestNotice ? <GuestSaveNotice /> : null}
      <CombinedProfile profile={profile} results={results} progress={progress} />
    </>
  );
}
