-- Discover cards showed only the 4 derived axes + archetype_name, which
-- read as thin next to the actual assessments a user completed. Per-request:
-- if someone has an MBTI result, a Discover card should show it (same for
-- Big Five, Human Design, Colors) rather than only the abstracted axes.
--
-- This is a real exposure increase over 0007/0008's original "never the raw
-- results, only a slim derived snapshot" stance — a specific MBTI type or
-- Human Design type is more identifying than an anonymous 4-axis score. The
-- decision (confirmed with the user): show whichever frameworks are
-- completed as compact badges, same all-or-nothing model approachable
-- already uses elsewhere — no separate per-framework toggle for v1.
--
-- Each column stores a computed DISPLAY LABEL (e.g. "INFJ", "The
-- Generator"), never a raw score/answer breakdown — same pattern
-- archetype_name already established. See src/lib/discovery/frameworkBadges.ts
-- for how each label is derived, exactly matching what that framework's own
-- result screen already shows the user.
alter table public.approachable_snapshots
  add column mbti_badge text,
  add column humandesign_badge text,
  add column colors_badge text,
  add column bigfive_badge text;

-- Signature changed (4 new nullable label params appended) — a different
-- parameter list creates a second overload instead of replacing the
-- original, so the old one must be dropped explicitly first (same reasoning
-- as the anon_label signature change in 0008_anonymous_discovery.sql).
drop function if exists public.set_approachable(boolean, text, text[], jsonb, text, text);

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
  p_bigfive_badge text
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

  update public.profiles
  set approachable = p_on and p_scope <> 'paused',
      approachable_scope = p_scope,
      approachable_intents = p_intents
  where id = auth.uid();

  if p_on and p_scope <> 'paused' then
    if p_axes is null then
      raise exception 'Complete at least 2 assessments before becoming approachable';
    end if;
    insert into public.approachable_snapshots (
      user_id, anon_label, axes, archetype_name, scope, intents,
      mbti_badge, humandesign_badge, colors_badge, bigfive_badge, updated_at
    )
    values (
      auth.uid(), coalesce(p_anon_label, 'Anonymous'), p_axes, p_archetype_name, p_scope, p_intents,
      p_mbti_badge, p_humandesign_badge, p_colors_badge, p_bigfive_badge, now()
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
          updated_at = now();
  else
    delete from public.approachable_snapshots where user_id = auth.uid();
  end if;
end;
$$;

grant execute on function public.set_approachable(boolean, text, text[], jsonb, text, text, text, text, text, text) to authenticated;
