"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptPairingInvite, declinePairingInvite, type ShareLevel } from "../actions";

const SHARE_LEVEL_OPTIONS: { value: ShareLevel; label: string; description: string }[] = [
  {
    value: "summary_only",
    label: "Share a summary only",
    description: "They'll see a written comparison for each area, not your exact scores.",
  },
  {
    value: "axes",
    label: "Share full detail",
    description: "They'll also see exactly where you land on each axis, next to their own.",
  },
];

export function PairInviteResponse({ code, inviterName }: { code: string; inviterName: string }) {
  const router = useRouter();
  const [shareLevel, setShareLevel] = useState<ShareLevel>("summary_only");
  const [pending, setPending] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    if (pending) return;
    setError(null);
    setPending("accept");
    try {
      const { pairingId } = await acceptPairingInvite(code, shareLevel);
      router.push(`/pair/${pairingId}/report`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
      setPending(null);
    }
  }

  async function handleDecline() {
    if (pending) return;
    setError(null);
    setPending("decline");
    try {
      await declinePairingInvite(code);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decline invite");
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 text-left">
      <p className="text-sm font-medium">What should {inviterName} see about you?</p>
      <div className="flex flex-col gap-2">
        {SHARE_LEVEL_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              type="radio"
              name="shareLevel"
              value={option.value}
              checked={shareLevel === option.value}
              onChange={() => setShareLevel(option.value)}
              className="mt-0.5"
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              <span className="block text-xs text-muted-foreground">{option.description}</span>
            </span>
          </label>
        ))}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="mt-1 flex gap-2">
        <Button onClick={handleAccept} disabled={pending !== null} className="flex-1 rounded-full">
          {pending === "accept" ? <Loader2 className="size-4 animate-spin" /> : "Accept & compare"}
        </Button>
        <Button onClick={handleDecline} disabled={pending !== null} variant="outline" className="flex-1 rounded-full">
          {pending === "decline" ? <Loader2 className="size-4 animate-spin" /> : "Decline"}
        </Button>
      </div>
    </div>
  );
}
