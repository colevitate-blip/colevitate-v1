-- Add profile metadata and sharing fields to profiles table
alter table public.profiles
  add column display_name text,
  add column avatar_url text,
  add column is_public boolean not null default false,
  add column share_slug text unique;

-- Allow public access to profiles that have opted into sharing
create policy "Public can select public profiles"
  on public.profiles for select
  using (is_public = true);

-- Store timestamped snapshots of combined profile axes for trend tracking
create table if not exists public.snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_at timestamptz not null,
  axes jsonb not null,
  archetype_name text,
  created_at timestamptz not null default now(),
  unique (user_id, completed_at)
);

alter table public.snapshots enable row level security;

create policy "Users can select their own snapshots"
  on public.snapshots for select
  using (auth.uid() = user_id);

create policy "Users can insert their own snapshots"
  on public.snapshots for insert
  with check (auth.uid() = user_id);
