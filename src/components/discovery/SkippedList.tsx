"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlimProfileCard } from "@/components/discovery/SlimProfileCard";
import { unskipUser } from "@/app/[locale]/(personality)/discover/actions";

export interface SkippedRow {
  userId: string;
  /** Null when the skipped user is no longer approachable (their snapshot row was deleted). */
  displayName: string | null;
  archetypeName: string | null;
  skippedAt: string;
}

function SkippedRowItem({ row, onUndone }: { row: SkippedRow; onUndone: () => void }) {
  const t = useTranslations("discovery.skipped");
  const format = useFormatter();
  const [undoing, setUndoing] = useState(false);
  const [error, setError] = useState(false);

  async function handleUndo() {
    if (undoing) return;
    setUndoing(true);
    setError(false);
    try {
      await unskipUser(row.userId);
      onUndone();
    } catch {
      setError(true);
      setUndoing(false);
    }
  }

  return (
    <SlimProfileCard
      displayName={row.displayName || t("noLongerVisible")}
      avatarUrl={null}
      archetypeName={row.archetypeName}
    >
      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <span className="text-xs text-muted-foreground">{format.dateTime(new Date(row.skippedAt), { dateStyle: "medium" })}</span>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-destructive">{t("undoError")}</span>}
          <Button size="sm" variant="outline" onClick={handleUndo} disabled={undoing} className="rounded-full">
            {undoing ? <Loader2 className="size-3.5 animate-spin" /> : t("undoButton")}
          </Button>
        </div>
      </div>
    </SlimProfileCard>
  );
}

export function SkippedList({ initialRows }: { initialRows: SkippedRow[] }) {
  const t = useTranslations("discovery.skipped");
  const [rows, setRows] = useState(initialRows);

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <SkippedRowItem
          key={row.userId}
          row={row}
          onUndone={() => setRows((prev) => prev.filter((r) => r.userId !== row.userId))}
        />
      ))}
    </div>
  );
}
