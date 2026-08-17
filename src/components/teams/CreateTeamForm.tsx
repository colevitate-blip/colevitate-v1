"use client";

import { useCallback, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTeam } from "@/app/[locale]/(personality)/teams/actions";

export function CreateTeamForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(async () => {
    if (!name.trim()) {
      setError("Team name cannot be empty");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const teamId = await createTeam(name);
      router.push(`/teams/${teamId}`);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Failed to create team");
    }
  }, [name, router]);

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-6">
      <h2 className="font-semibold">Create a Team</h2>
      <p className="text-sm text-muted-foreground">Start a new team and invite people to it.</p>
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name"
          disabled={saving}
          maxLength={100}
        />
        <Button onClick={handleCreate} disabled={saving} className="shrink-0 px-4">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
