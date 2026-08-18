import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Bypasses RLS entirely — only for trusted server-side contexts with no
 * user session to scope to (e.g. the Stripe webhook, which needs to mark
 * a pairing unlocked regardless of who's "logged in" on that request).
 * Never import this from a client component or a normal user-scoped
 * server action; use `@/lib/supabase/server` for those instead.
 */
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
