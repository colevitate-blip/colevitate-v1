-- Teams: a group of users who can each opt in to share a slim, derived
-- axis snapshot (never raw assessment answers) with the team.
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

-- axes/archetype_name/shared_at stay null until the member explicitly
-- shares via shareProfileWithTeam() — mirrors the slim shape already used
-- by public.snapshots (never the raw PersonalityResults jsonb).
--
-- display_name/avatar_url are denormalized copies (set at join time, from
-- the joining user's own profiles row) rather than a live join against
-- profiles — profiles' RLS only allows a user to select their own row or
-- one with is_public=true, so a teammate with a private profile wouldn't
-- otherwise be visible in the roster at all.
create table public.team_members (
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  display_name text,
  avatar_url text,
  axes jsonb,
  archetype_name text,
  shared_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- security definer so evaluating this from team_members' own select policy
-- doesn't re-trigger that same policy (a bare correlated subquery on
-- team_members inside its own RLS policy raises Postgres error 42P17,
-- infinite recursion detected in policy) — this is Supabase's documented
-- pattern for a "can see other rows in a group I'm a member of" policy.
create or replace function public.is_team_member(target_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.team_members
    where team_id = target_team_id and user_id = auth.uid()
  );
$$;

create policy "Members can select their teams"
  on public.teams for select
  using (auth.uid() = owner_id or public.is_team_member(id));

create policy "Owner can insert their team"
  on public.teams for insert
  with check (auth.uid() = owner_id);

create policy "Owner can update their team"
  on public.teams for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owner can delete their team"
  on public.teams for delete
  using (auth.uid() = owner_id);

create policy "Members can select team roster"
  on public.team_members for select
  using (public.is_team_member(team_id));

-- Narrow bootstrap-only insert: lets a team's creator insert their OWN
-- owner row right after creating the team. No general client-side insert
-- policy exists for role='member' — joining always goes through
-- join_team_by_code() below, so a client can never self-insert into an
-- arbitrary team just by knowing its (non-enumerable, but not secret-proof)
-- UUID without also knowing the actual invite code.
create policy "Owner can insert own membership row"
  on public.team_members for insert
  with check (
    role = 'owner'
    and user_id = auth.uid()
    and exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
  );

create policy "Members can update their own row"
  on public.team_members for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Members can leave (delete own row)"
  on public.team_members for delete
  using (user_id = auth.uid());

create or replace function public.join_team_by_code(code text)
returns public.teams
language plpgsql
security definer
set search_path = public
as $$
declare
  target_team public.teams;
  caller_display_name text;
  caller_avatar_url text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into target_team from public.teams where invite_code = code;
  if target_team.id is null then
    raise exception 'Invalid invite code';
  end if;

  -- security definer lets this read the caller's own profiles row even
  -- though the general team_members insert policy doesn't grant that
  -- directly; it's only ever the caller's own identity data, never anyone
  -- else's, so this isn't a privilege escalation.
  select display_name, avatar_url into caller_display_name, caller_avatar_url
  from public.profiles where id = auth.uid();

  insert into public.team_members (team_id, user_id, role, display_name, avatar_url)
  values (target_team.id, auth.uid(), 'member', caller_display_name, caller_avatar_url)
  on conflict (team_id, user_id) do nothing;

  return target_team;
end;
$$;

grant execute on function public.join_team_by_code(text) to authenticated;
