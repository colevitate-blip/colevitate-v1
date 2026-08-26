"use client";

import { useCallback, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinTeamByCode } from "@/app/[locale]/(personality)/teams/actions";

export function JoinTeamForm({ noun = "team", basePath = "/teams" }: { noun?: string; basePath?: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = useCallback(async () => {
    if (!code.trim()) {
      setError("Enter an invite code");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const teamId = await joinTeamByCode(code);
      router.push(`${basePath}/${teamId}`);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Invalid invite code");
    }
  }, [code, router, basePath]);

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-6">
      <h2 className="font-semibold">Have an Invite Code?</h2>
      <p className="text-sm text-muted-foreground">Join a {noun} someone invited you to.</p>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCD1234"
          disabled={saving}
          maxLength={8}
          className="font-mono uppercase"
        />
        <Button onClick={handleJoin} disabled={saving} variant="outline" className="shrink-0 px-4">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
