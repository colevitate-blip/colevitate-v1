import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { RequestsTabs } from "@/components/discovery/RequestsTabs";
import type { ApproachRequestSummary } from "@/components/discovery/discoveryTypes";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";

interface RequestRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: ApproachRequestSummary["status"];
  intent: ApproachRequestSummary["intent"];
  message: string;
  created_at: string;
  responded_at: string | null;
  sender_anon_label: string | null;
  recipient_anon_label: string | null;
}

interface RevealedIdentity {
  display_name: string | null;
  avatar_url: string | null;
}

export default async function ApproachRequestsPage() {
  const t = await getTranslations("discovery.requests");
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect(await loginRedirectTarget("/discover/requests"));
  }

  // Lazy expiry: flips this user's own past-expiry pending received requests
  // to 'expired' before the list below is read (see expire_stale_approach_requests()
  // in supabase/migrations/0007_approachability.sql).
  await supabase.rpc("expire_stale_approach_requests");

  const { data: rows } = await supabase
    .from("approach_requests")
    .select(
      "id, sender_id, recipient_id, status, intent, message, created_at, responded_at, sender_anon_label, recipient_anon_label"
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const requests = (rows as RequestRow[] | null) || [];

  // Real identity is never stored on the request row — it's only ever
  // computed live, and only for an accepted request's two parties, via
  // get_connection_identity() (0008_anonymous_discovery.sql). Every other
  // row falls back to the frozen anon_label captured at send time.
  const revealed = new Map<string, RevealedIdentity>();
  await Promise.all(
    requests
      .filter((r) => r.status === "accepted")
      .map(async (r) => {
        const { data } = await supabase.rpc("get_connection_identity", { p_request_id: r.id }).maybeSingle();
        if (data) revealed.set(r.id, data as RevealedIdentity);
      })
  );

  const incoming: ApproachRequestSummary[] = requests
    .filter((r) => r.recipient_id === user.id)
    .map((r) => ({
      id: r.id,
      status: r.status,
      intent: r.intent,
      message: r.message,
      createdAt: r.created_at,
      respondedAt: r.responded_at,
      counterpartId: r.sender_id,
      counterpartDisplayName: revealed.get(r.id)?.display_name ?? r.sender_anon_label,
      counterpartAvatarUrl: revealed.get(r.id)?.avatar_url ?? null,
    }));

  const outgoing: ApproachRequestSummary[] = requests
    .filter((r) => r.sender_id === user.id)
    .map((r) => ({
      id: r.id,
      status: r.status,
      intent: r.intent,
      message: r.message,
      createdAt: r.created_at,
      respondedAt: r.responded_at,
      counterpartId: r.recipient_id,
      counterpartDisplayName: revealed.get(r.id)?.display_name ?? r.recipient_anon_label,
      counterpartAvatarUrl: revealed.get(r.id)?.avatar_url ?? null,
    }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>
      <RequestsTabs incoming={incoming} outgoing={outgoing} />
    </div>
  );
}
