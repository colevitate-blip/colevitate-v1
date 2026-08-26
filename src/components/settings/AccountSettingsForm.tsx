"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Check, Copy, Loader2, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersonality } from "@/lib/personality/context";
import { loadHistory, loadRemoteHistory } from "@/lib/personality/storage";
import { updateDisplayName, enableSharing, disableSharing } from "@/app/[locale]/(personality)/settings/actions";
import type { ProfileMeta } from "@/lib/personality/storage";
import type { CombinedSnapshot } from "@/lib/personality/types";

/** Merges local and remote history snapshots, deduped by completion timestamp and sorted oldest-first — the same merge handleDownloadJSON and CombinedProfile.tsx's sync effect both do. */
async function mergedHistory(userId: string): Promise<CombinedSnapshot[]> {
  const local = loadHistory();
  const remote = await loadRemoteHistory(userId);
  return Array.from(
    new Map([...local, ...remote].map((s) => [new Date(s.completedAt).getTime(), s])).values()
  ).sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
}

export function AccountSettingsForm({
  userId,
  initialMeta,
  userEmail,
  userAvatar,
}: {
  userId: string;
  initialMeta: ProfileMeta;
  userEmail: string;
  userAvatar?: string;
}) {
  const [displayName, setDisplayName] = useState(initialMeta.displayName || "");
  const [isPublic, setIsPublic] = useState(initialMeta.isPublic);
  const [shareSlug, setShareSlug] = useState(initialMeta.shareSlug || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { results } = usePersonality();
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdateDisplayName = useCallback(async () => {
    if (!displayName.trim()) {
      setError("Display name cannot be empty");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateDisplayName(displayName);
      setSaving(false);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Failed to update display name");
    }
  }, [displayName]);

  const handleEnableSharing = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const slug = await enableSharing();
      setIsPublic(true);
      setShareSlug(slug);
      setShareUrl(`${window.location.origin}/u/${slug}`);
      setSaving(false);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Failed to enable sharing");
    }
  }, []);

  const handleDisableSharing = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await disableSharing();
      setIsPublic(false);
      setShareUrl(null);
      setSaving(false);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Failed to disable sharing");
    }
  }, []);

  const handleCopyShareUrl = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const [history, setHistory] = useState<CombinedSnapshot[] | null>(null);

  useEffect(() => {
    mergedHistory(userId).then(setHistory);
  }, [userId]);

  const handleDownloadJSON = useCallback(async () => {
    const history = await mergedHistory(userId);
    const data = {
      personality: results,
      history,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personality-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [results, userId]);

  const hasCompletedAssessments = Object.values(results).some(
    (r) => r !== undefined && r !== null
  );

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <div className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">Profile</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Display Name</label>
          <div className="flex gap-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              disabled={saving}
              maxLength={100}
            />
            <Button onClick={handleUpdateDisplayName} disabled={saving} className="px-6">
              {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Avatar</label>
          <div className="flex items-center gap-3">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="Avatar"
                className="size-12 rounded-full bg-muted object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                ?
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Connected via Google. Manage in your Google Account settings.
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {userEmail}
          </div>
        </div>
      </div>

      {/* Sharing Section */}
      {hasCompletedAssessments && (
        <div className="space-y-4 rounded-2xl border bg-card p-6">
          <h2 className="font-semibold">Sharing</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Public Profile</p>
                <p className="text-xs text-muted-foreground">
                  Share your combined personality profile with others
                </p>
              </div>
              <Button
                onClick={isPublic ? handleDisableSharing : handleEnableSharing}
                disabled={saving}
                variant={isPublic ? "default" : "outline"}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isPublic ? (
                  "Shared"
                ) : (
                  "Enable Sharing"
                )}
              </Button>
            </div>

            {isPublic && shareSlug && (
              <div className="rounded-lg bg-muted p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Share Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all text-sm font-mono text-foreground">
                    {shareUrl || `${window.location.origin}/u/${shareSlug}`}
                  </code>
                  <Button
                    onClick={handleCopyShareUrl}
                    size="sm"
                    variant="ghost"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History & Trends Section */}
      {history && history.length > 0 && (
        <div className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="font-semibold">History & Trends</h2>
          <p className="text-sm text-muted-foreground">
            {history.length === 1
              ? "You have 1 snapshot recorded so far — retake any assessment to start seeing a trend."
              : `${history.length} snapshots recorded, from ${new Date(history[0].completedAt).toLocaleDateString()} to ${new Date(history[history.length - 1].completedAt).toLocaleDateString()}.`}
          </p>
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="/combined">
              <TrendingUp className="size-4" />
              View how your results have moved
            </Link>
          </Button>
        </div>
      )}

      {/* Export Section */}
      <div className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">Export</h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Download your personality data as JSON, including all assessment results and history.
          </p>
          <Button onClick={handleDownloadJSON} variant="outline" className="w-full gap-2">
            <Download className="size-4" />
            Download your data (JSON)
          </Button>
        </div>

        <div className="space-y-2 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Share or save your combined profile as an image.
          </p>
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="/combined">
              <Download className="size-4" />
              Save / Share image
            </Link>
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 rounded-2xl border border-muted bg-muted/30 p-4">
        <p className="text-xs font-medium text-muted-foreground">
          All your data is stored securely and is only visible to you unless you enable public sharing.
        </p>
      </div>
    </div>
  );
}
