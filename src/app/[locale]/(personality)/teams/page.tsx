import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateTeamForm } from "@/components/teams/CreateTeamForm";
import { JoinTeamForm } from "@/components/teams/JoinTeamForm";
import { Link } from "@/i18n/navigation";
import { Users } from "lucide-react";

interface TeamRow {
  role: string;
  teams: { id: string; name: string } | { id: string; name: string }[] | null;
}

export default async function TeamsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(`/login?next=/teams`);
  }

  const { data: rows } = await supabase
    .from("team_members")
    .select("role, teams(id, name)")
    .eq("user_id", user.id);

  const myTeams = ((rows as TeamRow[] | null) || [])
    .map((row) => {
      const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
      return team ? { id: team.id, name: team.name, role: row.role } : null;
    })
    .filter((t): t is { id: string; name: string; role: string } => t !== null);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare where your team clusters across the four axes, once members opt in to share.
        </p>
      </div>

      {myTeams.length > 0 ? (
        <div className="mb-8 space-y-3">
          {myTeams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{team.role}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">You&apos;re not on any teams yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <CreateTeamForm />
        <JoinTeamForm />
      </div>
    </div>
  );
}
