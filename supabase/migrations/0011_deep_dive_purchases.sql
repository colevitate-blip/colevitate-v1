-- Tier 4.1 (see prompt.md): a paid, AI-generated long-form report (career
-- fit, relationship patterns, growth edges) built on top of a user's own
-- Combined Profile — same purchase/webhook shape as pairing_purchases
-- (0004_pairings.sql), just keyed by user_id instead of a pairing, since
-- the entity being unlocked here is the user's own account rather than a
-- two-party pairing row.
create table public.deep_dive_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded')),
  -- Generated once, on first view after payment, and cached here so a
  -- page refresh never re-triggers a paid Gemini call. Shape matches
  -- DeepDiveReport in src/lib/personality/generateDeepDiveReport.ts
  -- ({ careerFit, relationshipPatterns, growthEdges }).
  report jsonb,
  report_generated_at timestamptz,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.deep_dive_purchases enable row level security;

create policy "Purchaser can select their deep dive purchases"
  on public.deep_dive_purchases for select
  using (auth.uid() = user_id);

create policy "Purchaser can insert a pending purchase"
  on public.deep_dive_purchases for insert
  with check (auth.uid() = user_id);

-- Same reasoning as pairing_purchases: a client can create the pending row
-- a Checkout Session gets built from, but can never mark itself paid or
-- write its own report content — status/paid_at come from the Stripe
-- webhook's service-role client, report/report_generated_at from the
-- deep-dive page's server-side generation step (also service-role).
revoke insert on public.deep_dive_purchases from authenticated;
grant insert (user_id, stripe_checkout_session_id, amount_cents, currency)
  on public.deep_dive_purchases to authenticated;
