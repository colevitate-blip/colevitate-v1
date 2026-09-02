-- Tier 3.2 (see prompt.md): a short, type-specific tip cached once per
-- archetype per day, so every visitor with the same archetype shares (and
-- pays for) one Gemini call instead of regenerating it per page load.
-- archetype_key is the 4-letter bucket key from getArchetypeKey()
-- (src/components/personality/combined/archetypeMatrix.ts) — one of 16
-- fixed values, validated server-side against ARCHETYPES before ever
-- reaching this table.
create table public.daily_type_content (
  archetype_key text not null,
  content_date date not null,
  content text not null,
  created_at timestamptz not null default now(),
  primary key (archetype_key, content_date)
);

alter table public.daily_type_content enable row level security;

-- Non-sensitive, fully derived content — anyone can read any archetype's
-- content for any date. Only the service-role client
-- (src/lib/supabase/serviceRole.ts) ever writes, from the
-- daily-type-content route.
create policy "Anyone can select daily type content"
  on public.daily_type_content for select
  using (true);
