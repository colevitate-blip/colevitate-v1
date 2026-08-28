"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafetyActions } from "@/components/discovery/SafetyActions";
import { acceptApproach, declineApproach, withdrawApproach } from "@/app/[locale]/(personality)/discover/actions";
import type { ApproachRequestSummary } from "@/components/discovery/discoveryTypes";

const STATUS_CLASS: Record<ApproachRequestSummary["status"], string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  declined: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
  withdrawn: "bg-muted text-muted-foreground",
};

export function ApproachRequestRow({
  request,
  direction,
}: {
  request: ApproachRequestSummary;
  direction: "incoming" | "outgoing";
}) {
  const t = useTranslations("discovery.requests");
  const router = useRouter();
  const [pending, setPending] = useState<"accept" | "decline" | "withdraw" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const name = request.counterpartDisplayName || "Someone";

  async function run(action: "accept" | "decline" | "withdraw") {
    if (pending) return;
    setPending(action);
    setError(null);
    try {
      if (action === "accept") await acceptApproach(request.id);
      else if (action === "decline") await declineApproach(request.id);
      else await withdrawApproach(request.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("actionError"));
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {request.counterpartAvatarUrl ? (
            <img
              src={request.counterpartAvatarUrl}
              alt=""
              className="size-10 shrink-0 rounded-full bg-muted object-cover"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[request.status]}`}>
          {t(`status${request.status.charAt(0).toUpperCase()}${request.status.slice(1)}` as "statusPending")}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{request.message}</p>

      {request.status === "accepted" && (
        <p className="text-xs text-muted-foreground">{t("connectedNotice")}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {direction === "incoming" && request.status === "pending" && (
          <>
            <Button size="sm" onClick={() => run("accept")} disabled={pending !== null} className="rounded-full">
              {pending === "accept" ? <Loader2 className="size-3.5 animate-spin" /> : t("acceptButton")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => run("decline")}
              disabled={pending !== null}
              className="rounded-full"
            >
              {pending === "decline" ? <Loader2 className="size-3.5 animate-spin" /> : t("declineButton")}
            </Button>
          </>
        )}
        {direction === "outgoing" && request.status === "pending" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => run("withdraw")}
            disabled={pending !== null}
            className="rounded-full text-muted-foreground"
          >
            {pending === "withdraw" ? <Loader2 className="size-3.5 animate-spin" /> : t("withdrawButton")}
          </Button>
        )}
        {direction === "incoming" && (
          <SafetyActions userId={request.counterpartId} approachRequestId={request.id} onBlocked={() => router.refresh()} />
        )}
      </div>
    </div>
  );
}
