"use client";

import { useCallback, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTeam } from "@/app/[locale]/(personality)/teams/actions";

export function CreateCircleForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(async () => {
    if (!name.trim()) {
      setError("Circle name cannot be empty");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const circleId = await createTeam(name, "personal");
      router.push(`/circle/${circleId}`);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Failed to create circle");
    }
  }, [name, router]);

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-6">
      <h2 className="font-semibold">Start a Circle</h2>
      <p className="text-sm text-muted-foreground">
        Invite friends or family to see where your combined profiles cluster and diverge.
      </p>
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Circle name"
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
