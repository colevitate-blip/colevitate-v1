import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamRoster, type RosterMember } from "@/components/teams/TeamRoster";
import { TeamCompositionView } from "@/components/teams/TeamCompositionView";
import { PairwiseCompatibilityGrid } from "@/components/teams/PairwiseCompatibilityGrid";
import type { SharedMemberAxes } from "@/components/teams/teamInsights";
import type { AxisId } from "@/components/personality/combined/scoringMatrix";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";

export default async function CirclePage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(await loginRedirectTarget(`/circle/${circleId}`));
  }

  const { data: circle } = await supabase
    .from("teams")
    .select("id, name, owner_id, invite_code, kind")
    .eq("id", circleId)
    .maybeSingle();

  if (!circle || circle.kind !== "personal") notFound();

  const { data: memberRows } = await supabase
    .from("team_members")
    .select("user_id, role, display_name, avatar_url, axes, archetype_name, shared_at")
    .eq("team_id", circle.id)
    .order("joined_at", { ascending: true });

  const members = memberRows || [];
  const isMember = members.some((m) => m.user_id === user.id);
  if (!isMember) notFound();

  const rosterMembers: RosterMember[] = members.map((m) => ({
    userId: m.user_id,
    displayName: m.display_name || "Member",
    avatarUrl: m.avatar_url,
    role: m.role,
    hasShared: Boolean(m.shared_at),
  }));

  const sharedMembers: SharedMemberAxes[] = members
    .filter((m) => m.shared_at && m.axes)
    .map((m) => ({
      displayName: m.display_name || "Member",
      axes: (m.axes as { id: AxisId; score: number }[]) || [],
    }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{circle.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {members.length} member{members.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="space-y-6">
        <TeamRoster
          teamId={circle.id}
          inviteCode={circle.invite_code}
          currentUserId={user.id}
          isOwner={circle.owner_id === user.id}
          members={rosterMembers}
          noun="circle"
          basePath="/circle"
        />

        {sharedMembers.length >= 2 ? (
          <>
            <TeamCompositionView members={sharedMembers} title="Circle Composition" />
            <PairwiseCompatibilityGrid members={sharedMembers} title="Circle Compatibility" />
          </>
        ) : (
          <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
            Once at least 2 members share their profile with this circle, a composition view will
            show here.
          </div>
        )}
      </div>
    </div>
  );
}
