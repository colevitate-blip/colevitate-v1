"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendApproach } from "@/app/[locale]/(personality)/discover/actions";
import { APPROACH_INTENTS, type ApproachIntent } from "@/components/discovery/discoveryTypes";

const MIN_MESSAGE_LENGTH = 20;

export function ApproachComposeDialog({
  recipientId,
  recipientName,
}: {
  recipientId: string;
  recipientName: string;
}) {
  const t = useTranslations("discovery");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<ApproachIntent>("friend");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const tooShort = message.trim().length > 0 && message.trim().length < MIN_MESSAGE_LENGTH;

  async function handleSend() {
    if (sending || message.trim().length < MIN_MESSAGE_LENGTH) return;
    setSending(true);
    setError(null);
    try {
      await sendApproach(recipientId, message.trim(), intent);
      setSent(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("compose.error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setMessage("");
          setIntent("friend");
          setError(null);
          setSent(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full">
          <Send className="size-3.5" />
          {t("browse.approachButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("compose.title", { name: recipientName })}</DialogTitle>
        </DialogHeader>

        {sent ? (
          <p className="text-sm text-muted-foreground">{t("compose.sent")}</p>
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <p className="mb-1.5 text-sm font-medium">{t("compose.intentLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  {APPROACH_INTENTS.map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="radio"
                        name="approach-intent"
                        className="sr-only"
                        checked={intent === value}
                        onChange={() => setIntent(value)}
                      />
                      {t(`settings.intent${value.charAt(0).toUpperCase()}${value.slice(1)}` as "settings.intentFriend")}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="approach-message">
                  {t("compose.messageLabel")}
                </label>
                <textarea
                  id="approach-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("compose.messagePlaceholder")}
                  rows={4}
                  className="flex w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30"
                />
                {tooShort && <p className="mt-1 text-xs text-destructive">{t("compose.messageTooShort")}</p>}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={sending} className="rounded-full">
                {t("compose.cancelButton")}
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || message.trim().length < MIN_MESSAGE_LENGTH}
                className="rounded-full"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : t("compose.sendButton")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
