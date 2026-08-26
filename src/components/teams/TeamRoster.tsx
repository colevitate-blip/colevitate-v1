"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Check, Copy, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leaveTeam, removeMember } from "@/app/[locale]/(personality)/teams/actions";
import { ShareWithTeamToggle } from "./ShareWithTeamToggle";

export interface RosterMember {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  hasShared: boolean;
}

export function TeamRoster({
  teamId,
  inviteCode,
  currentUserId,
  isOwner,
  members,
  noun = "team",
  basePath = "/teams",
}: {
  teamId: string;
  inviteCode: string;
  currentUserId: string;
  isOwner: boolean;
  members: RosterMember[];
  /** "team" or "circle" — swaps the copy below without duplicating the component. */
  noun?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [inviteCode]);

  const handleRemove = useCallback(
    async (userId: string) => {
      setBusyUserId(userId);
      setError(null);
      try {
        await removeMember(teamId, userId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove member");
      } finally {
        setBusyUserId(null);
      }
    },
    [teamId, router]
  );

  const handleLeave = useCallback(async () => {
    setBusyUserId(currentUserId);
    setError(null);
    try {
      await leaveTeam(teamId);
      router.push(basePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to leave ${noun}`);
      setBusyUserId(null);
    }
  }, [teamId, currentUserId, router, basePath, noun]);

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-6">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Invite Code</p>
        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <code className="flex-1 font-mono text-sm tracking-wider">{inviteCode}</code>
          <Button onClick={handleCopyCode} size="sm" variant="ghost" className="shrink-0">
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt="" className="size-9 rounded-full bg-muted object-cover" />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                  {member.displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{member.displayName}</p>
                  {member.role === "owner" && (
                    <Badge variant="outline" className="rounded-full px-1.5 py-0 text-[10px]">
                      Owner
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.hasShared ? `Shared with ${noun}` : "Hasn't shared yet"}
                </p>
              </div>
            </div>

            {member.userId === currentUserId ? (
              <ShareWithTeamToggle teamId={teamId} initiallyShared={member.hasShared} noun={noun} />
            ) : isOwner ? (
              <Button
                onClick={() => handleRemove(member.userId)}
                disabled={busyUserId === member.userId}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
              >
                {busyUserId === member.userId ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      {!isOwner && (
        <div className="border-t pt-4">
          <Button onClick={handleLeave} disabled={busyUserId === currentUserId} size="sm" variant="ghost">
            {busyUserId === currentUserId ? <Loader2 className="size-3.5 animate-spin" /> : `Leave ${noun}`}
          </Button>
        </div>
      )}
    </div>
  );
}
