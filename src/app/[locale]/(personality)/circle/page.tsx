import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateCircleForm } from "@/components/circle/CreateCircleForm";
import { JoinTeamForm } from "@/components/teams/JoinTeamForm";
import { Link } from "@/i18n/navigation";
import { Users } from "lucide-react";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";

interface TeamRow {
  role: string;
  teams: { id: string; name: string; kind: string } | { id: string; name: string; kind: string }[] | null;
}

export default async function CirclesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(await loginRedirectTarget("/circle"));
  }

  const { data: rows } = await supabase
    .from("team_members")
    .select("role, teams(id, name, kind)")
    .eq("user_id", user.id);

  const myCircles = ((rows as TeamRow[] | null) || [])
    .map((row) => {
      const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
      return team ? { id: team.id, name: team.name, role: row.role, kind: team.kind } : null;
    })
    .filter((t): t is { id: string; name: string; role: string; kind: string } => t !== null && t.kind === "personal");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Circles</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          See where your friends or family cluster and diverge across the four axes, once
          everyone opts in to share.
        </p>
      </div>

      {myCircles.length > 0 ? (
        <div className="mb-8 space-y-3">
          {myCircles.map((circle) => (
            <Link
              key={circle.id}
              href={`/circle/${circle.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="font-semibold">{circle.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{circle.role}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">You&apos;re not in any circles yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <CreateCircleForm />
        <JoinTeamForm noun="circle" basePath="/circle" />
      </div>
    </div>
  );
}
