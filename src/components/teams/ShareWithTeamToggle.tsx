"use client";

import { useCallback, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareProfileWithTeam, unshareProfileWithTeam } from "@/app/[locale]/(personality)/teams/actions";

export function ShareWithTeamToggle({ teamId, initiallyShared }: { teamId: string; initiallyShared: boolean }) {
  const router = useRouter();
  const [shared, setShared] = useState(initiallyShared);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      if (shared) {
        await unshareProfileWithTeam(teamId);
        setShared(false);
      } else {
        await shareProfileWithTeam(teamId);
        setShared(true);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sharing");
    } finally {
      setSaving(false);
    }
  }, [shared, teamId, router]);

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={handleToggle} disabled={saving} size="sm" variant={shared ? "default" : "outline"}>
        {saving ? <Loader2 className="size-3.5 animate-spin" /> : shared ? "Shared with team" : "Share with team"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
