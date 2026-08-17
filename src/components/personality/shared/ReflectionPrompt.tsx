"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MessageCircleQuestion, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonality } from "@/lib/personality/context";
import type { AssessmentId } from "@/lib/personality/types";

interface ReflectionPromptProps {
  assessmentId: AssessmentId;
  questionId: string;
}

/** Optional, non-blocking note capture after a hard/middle-of-the-road answer. Stored locally only. */
export function ReflectionPrompt({ assessmentId, questionId }: ReflectionPromptProps) {
  const { saveFeedbackNote } = usePersonality();
  const t = useTranslations("reflection");
  const [state, setState] = React.useState<"prompt" | "writing" | "sent" | "dismissed">("prompt");
  const [note, setNote] = React.useState("");

  if (state === "dismissed") return null;

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-muted-foreground/30 p-4 text-sm">
      {state === "prompt" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MessageCircleQuestion className="size-4 shrink-0" />
            {t("prompt")}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setState("writing")}
            >
              {t("leaveNote")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setState("dismissed")}
            >
              {t("noThanks")}
            </Button>
          </div>
        </div>
      ) : null}

      {state === "writing" ? (
        <div className="space-y-2">
          <textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("placeholder")}
            rows={2}
            className="w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setState("dismissed")}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              disabled={!note.trim()}
              onClick={() => {
                saveFeedbackNote({ assessmentId, questionId, note: note.trim() });
                setState("sent");
              }}
            >
              <Send className="size-3.5" />
              {t("send")}
            </Button>
          </div>
        </div>
      ) : null}

      {state === "sent" ? (
        <p className="text-muted-foreground">{t("sent")}</p>
      ) : null}
    </div>
  );
}
