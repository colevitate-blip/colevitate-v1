"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Ban, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { blockUser, reportUser } from "@/app/[locale]/(personality)/discover/actions";

const REPORT_REASONS = ["harassment", "spam", "inappropriate", "other"] as const;
type ReportReason = (typeof REPORT_REASONS)[number];

function BlockAction({ userId, onBlocked }: { userId: string; onBlocked?: () => void }) {
  const t = useTranslations("discovery");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  async function handleBlock() {
    if (blocking) return;
    setBlocking(true);
    try {
      await blockUser(userId);
      setBlocked(true);
      setOpen(false);
      onBlocked?.();
      router.refresh();
    } catch {
      setBlocking(false);
    }
  }

  if (blocked) {
    return <span className="text-xs text-muted-foreground">{t("safety.blocked")}</span>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground">
          <Ban className="size-3.5" />
          {t("safety.blockButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("safety.blockConfirmTitle")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t("safety.blockConfirmBody")}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={blocking} className="rounded-full">
            {t("compose.cancelButton")}
          </Button>
          <Button variant="destructive" onClick={handleBlock} disabled={blocking} className="rounded-full">
            {blocking ? <Loader2 className="size-4 animate-spin" /> : t("safety.blockConfirmAction")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportAction({
  userId,
  approachRequestId = null,
}: {
  userId: string;
  approachRequestId?: string | null;
}) {
  const t = useTranslations("discovery");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("harassment");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await reportUser(userId, approachRequestId, reason, details.trim() || null);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("safety.reportError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setReason("harassment");
          setDetails("");
          setError(null);
          setSubmitted(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground">
          <Flag className="size-3.5" />
          {t("safety.reportButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("safety.reportTitle")}</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <p className="text-sm text-muted-foreground">{t("safety.reportSubmitted")}</p>
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <p className="mb-1.5 text-sm font-medium">{t("safety.reportReasonLabel")}</p>
                <div className="flex flex-col gap-2">
                  {REPORT_REASONS.map((value) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="report-reason"
                        checked={reason === value}
                        onChange={() => setReason(value)}
                      />
                      {t(
                        `safety.reportReason${value.charAt(0).toUpperCase()}${value.slice(1)}` as "safety.reportReasonHarassment"
                      )}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="report-details">
                  {t("safety.reportDetailsLabel")}
                </label>
                <textarea
                  id="report-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  className="flex w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting} className="rounded-full">
                {t("compose.cancelButton")}
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} className="rounded-full">
                {submitting ? <Loader2 className="size-4 animate-spin" /> : t("safety.reportSubmit")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SafetyActions({
  userId,
  approachRequestId = null,
  onBlocked,
}: {
  userId: string;
  approachRequestId?: string | null;
  onBlocked?: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <ReportAction userId={userId} approachRequestId={approachRequestId} />
      <BlockAction userId={userId} onBlocked={onBlocked} />
    </div>
  );
}
