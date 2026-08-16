"use client";

import * as React from "react";
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
  const [state, setState] = React.useState<"prompt" | "writing" | "sent" | "dismissed">("prompt");
  const [note, setNote] = React.useState("");

  if (state === "dismissed") return null;

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-muted-foreground/30 p-4 text-sm">
      {state === "prompt" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MessageCircleQuestion className="size-4 shrink-0" />
            Was that hard to answer? Want to leave a quick note?
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setState("writing")}
            >
              Leave a note
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setState("dismissed")}
            >
              No thanks
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
            placeholder="What made it hard? (kept private, used only to improve the questions)"
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
              Cancel
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
              Send
            </Button>
          </div>
        </div>
      ) : null}

      {state === "sent" ? (
        <p className="text-muted-foreground">Thanks — noted privately, it&apos;ll help us improve this question.</p>
      ) : null}
    </div>
  );
}
