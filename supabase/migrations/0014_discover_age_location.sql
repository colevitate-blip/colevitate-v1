-- Optional age + location for Discover, surfaced only through the
-- Discovery opt-in flow (ApproachabilitySettingsForm) — never asked at
-- account signup. Both are genuinely optional; there is no "required
-- before you can turn Discover on" gate, matching how the assessment
-- axes/badges already work. Reciprocity (a viewer who hasn't shared their
-- own age/location doesn't see a candidate's either) is enforced in
-- application code (discoveryQuery.ts), not here — RLS is row-level, and
-- this is a per-viewer, per-column decision the same way compatibilityScore
-- already is.
--
-- Location is country + an optional free-text region/city, not a precise
-- geolocation/GPS coordinate — consistent with 0007/0008's anonymous-until-
-- accepted design; a coordinate would be a much bigger identity leak than a
-- self-reported city name.
alter table public.profiles
  add column age integer check (age is null or (age between 18 and 120)),
  add column location_country text,
  add column location_region text;

alter table public.approachable_snapshots
  add column age integer,
  add column location_country text,
  add column location_region text;

-- Signature changed (3 new nullable params appended) — a different
-- parameter list creates a second overload instead of replacing the
-- original, so the old one must be dropped explicitly first (same reasoning
-- as 0008/0013's signature changes).
drop function if exists public.set_approachable(boolean, text, text[], jsonb, text, text, text, text, text, text);

create or replace function public.set_approachable(
  p_on boolean,
  p_scope text,
  p_intents text[],
  p_axes jsonb,
  p_archetype_name text,
  p_anon_label text,
  p_mbti_badge text,
  p_humandesign_badge text,
  p_colors_badge text,
  p_bigfive_badge text,
  p_age integer,
  p_location_country text,
  p_location_region text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_scope not in ('everyone', 'intents', 'paused') then
    raise exception 'Invalid scope';
  end if;
  if p_age is not null and (p_age < 18 or p_age > 120) then
    raise exception 'Invalid age';
  end if;

  -- age/location save regardless of p_on — they're optional fields scoped
  -- to this settings form, not gated behind actually turning Discover on.
  update public.profiles
  set approachable = p_on and p_scope <> 'paused',
      approachable_scope = p_scope,
      approachable_intents = p_intents,
      age = p_age,
      location_country = p_location_country,
      location_region = p_location_region
  where id = auth.uid();

  if p_on and p_scope <> 'paused' then
    if p_axes is null then
      raise exception 'Complete at least 2 assessments before becoming approachable';
    end if;
    insert into public.approachable_snapshots (
      user_id, anon_label, axes, archetype_name, scope, intents,
      mbti_badge, humandesign_badge, colors_badge, bigfive_badge,
      age, location_country, location_region, updated_at
    )
    values (
      auth.uid(), coalesce(p_anon_label, 'Anonymous'), p_axes, p_archetype_name, p_scope, p_intents,
      p_mbti_badge, p_humandesign_badge, p_colors_badge, p_bigfive_badge,
      p_age, p_location_country, p_location_region, now()
    )
    on conflict (user_id) do update
      set axes = excluded.axes,
          archetype_name = excluded.archetype_name,
          scope = excluded.scope,
          intents = excluded.intents,
          mbti_badge = excluded.mbti_badge,
          humandesign_badge = excluded.humandesign_badge,
          colors_badge = excluded.colors_badge,
          bigfive_badge = excluded.bigfive_badge,
          age = excluded.age,
          location_country = excluded.location_country,
          location_region = excluded.location_region,
          updated_at = now();
  else
    delete from public.approachable_snapshots where user_id = auth.uid();
  end if;
end;
$$;

grant execute on function public.set_approachable(boolean, text, text[], jsonb, text, text, text, text, text, text, integer, text, text) to authenticated;
