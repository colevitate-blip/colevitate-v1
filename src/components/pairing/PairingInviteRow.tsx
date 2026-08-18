"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, GitCompareArrows, Loader2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { revokePairingInvite } from "@/app/[locale]/(personality)/pair/actions";
import type { PairingStatus } from "./pairingTypes";

const STATUS_LABEL: Record<PairingStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  revoked: "Revoked",
};

const STATUS_CLASS: Record<PairingStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  declined: "bg-muted text-muted-foreground",
  revoked: "bg-muted text-muted-foreground",
};

export function PairingInviteRow({
  id,
  inviteCode,
  relationshipLabel,
  status,
  otherName,
  isInviter,
}: {
  id: string;
  inviteCode: string;
  relationshipLabel: string;
  status: PairingStatus;
  otherName: string | null;
  isInviter: boolean;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/pair/${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRevoke() {
    if (revoking) return;
    setRevoking(true);
    try {
      await revokePairingInvite(id);
      router.refresh();
    } catch {
      setRevoking(false);
    }
  }

  const title = otherName || (status === "pending" && isInviter ? "Waiting for a response" : "Someone");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <GitCompareArrows className="size-4" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">
            {relationshipLabel} · {isInviter ? "You invited" : "Invited you"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>

        {status === "accepted" ? (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href={`/pair/${id}/report`}>View report</Link>
          </Button>
        ) : null}

        {status === "pending" && isInviter ? (
          <>
            <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-full">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRevoke}
              disabled={revoking}
              className="rounded-full text-muted-foreground"
            >
              {revoking ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
              Revoke
            </Button>
          </>
        ) : null}

        {status === "pending" && !isInviter ? (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href={`/pair/${inviteCode}`}>Respond</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
