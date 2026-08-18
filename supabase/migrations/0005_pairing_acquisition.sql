-- Tracks whether a user's account originated from a pairing invite, and
-- which one — lets the viral-loop payoff metric ("what fraction of
-- invited User B's go on to use the product independently") be answered
-- by joining profiles.acquisition_source = 'invite' against later
-- activity (e.g. the user appearing as an inviter_id on their own
-- pairings row, or snapshots unrelated to the original pairing).
alter table public.profiles
  add column acquisition_source text,
  add column acquisition_pairing_id uuid references public.pairings (id) on delete set null;
