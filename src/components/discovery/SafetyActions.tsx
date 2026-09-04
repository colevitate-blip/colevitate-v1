"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Ban, EllipsisVertical, EyeOff, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { blockUser, reportUser, skipUser } from "@/app/[locale]/(personality)/discover/actions";

const REPORT_REASONS = ["harassment", "spam", "inappropriate", "other"] as const;
type ReportReason = (typeof REPORT_REASONS)[number];

// Both dialogs below support two trigger styles: their own inline button
// (default, used by ApproachRequestRow's incoming-requests list) or a
// fully-controlled mode (open/onOpenChange, hideTrigger) so a shared kebab
// menu elsewhere (variant="menu" below) can open either one — nesting a
// DialogTrigger inside a DropdownMenuItem directly is a known Radix focus
// fight, so the menu instead flips this external open state.
function BlockAction({
  userId,
  onBlocked,
  open,
  onOpenChange,
  hideTrigger,
}: {
  userId: string;
  onBlocked?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const t = useTranslations("discovery");
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  async function handleBlock() {
    if (blocking) return;
    setBlocking(true);
    try {
      await blockUser(userId);
      setBlocked(true);
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground">
            <Ban className="size-3.5" />
            {t("safety.blockButton")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("safety.blockConfirmTitle")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t("safety.blockConfirmBody")}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={blocking} className="rounded-full">
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

// Unlike Block, Skip has no confirmation dialog — it's reversible (see the
// Skipped list under settings) and has no effect on the other party, so
// there's nothing destructive to guard against here. Exported directly
// (rather than folded into SafetyActions) because the single-card discover
// view renders it as its own primary action alongside Approach, not as one
// of several safety buttons.
export function SkipAction({
  userId,
  onSkipped,
  className,
  size = "sm",
}: {
  userId: string;
  onSkipped?: () => void;
  className?: string;
  size?: "sm" | "lg";
}) {
  const t = useTranslations("discovery");
  const [skipping, setSkipping] = useState(false);

  async function handleSkip() {
    if (skipping) return;
    setSkipping(true);
    try {
      await skipUser(userId);
      onSkipped?.();
    } catch {
      setSkipping(false);
    }
  }

  return (
    <Button
      size={size}
      variant="outline"
      className={cn("rounded-full text-muted-foreground", className)}
      onClick={handleSkip}
      disabled={skipping}
      data-discover-action="skip"
    >
      {skipping ? <Loader2 className="size-3.5 animate-spin" /> : <EyeOff className="size-3.5" />}
      {t("safety.skipButton")}
    </Button>
  );
}

function ReportAction({
  userId,
  approachRequestId = null,
  open,
  onOpenChange,
  hideTrigger,
}: {
  userId: string;
  approachRequestId?: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const t = useTranslations("discovery");
  const [internalOpen, setInternalOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("harassment");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = open ?? internalOpen;

  function handleOpenChange(next: boolean) {
    (onOpenChange ?? setInternalOpen)(next);
    if (!next) {
      setReason("harassment");
      setDetails("");
      setError(null);
      setSubmitted(false);
    }
  }

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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground">
            <Flag className="size-3.5" />
            {t("safety.reportButton")}
          </Button>
        </DialogTrigger>
      )}
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
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting} className="rounded-full">
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

// "inline" (default) renders Report/Block as their own buttons, used by
// ApproachRequestRow's incoming-requests list. "menu" collapses them into a
// kebab menu instead — used by the single-card discover view (DiscoverCard),
// which renders Skip and Approach itself as the two primary actions, so
// these secondary safety actions shouldn't visually compete with that choice.
export function SafetyActions({
  userId,
  approachRequestId = null,
  onBlocked,
  onSkipped,
  variant = "inline",
}: {
  userId: string;
  approachRequestId?: string | null;
  onBlocked?: () => void;
  onSkipped?: () => void;
  variant?: "inline" | "menu";
}) {
  const t = useTranslations("discovery");
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);

  if (variant === "menu") {
    return (
      <div className="flex items-center gap-1">
        <ReportAction userId={userId} approachRequestId={approachRequestId} open={reportOpen} onOpenChange={setReportOpen} hideTrigger />
        <BlockAction userId={userId} onBlocked={onBlocked} open={blockOpen} onOpenChange={setBlockOpen} hideTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" className="rounded-full text-muted-foreground" aria-label={t("safety.moreOptions")}>
              <EllipsisVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setReportOpen(true);
              }}
            >
              <Flag />
              {t("safety.reportButton")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault();
                setBlockOpen(true);
              }}
            >
              <Ban />
              {t("safety.blockButton")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {onSkipped && <SkipAction userId={userId} onSkipped={onSkipped} />}
      <ReportAction userId={userId} approachRequestId={approachRequestId} />
      <BlockAction userId={userId} onBlocked={onBlocked} />
    </div>
  );
}
