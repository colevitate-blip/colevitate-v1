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
  sender_display_name: string | null;
  sender_avatar_url: string | null;
  recipient_display_name: string | null;
  recipient_avatar_url: string | null;
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
      "id, sender_id, recipient_id, status, intent, message, created_at, responded_at, sender_display_name, sender_avatar_url, recipient_display_name, recipient_avatar_url"
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const requests = (rows as RequestRow[] | null) || [];

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
      counterpartDisplayName: r.sender_display_name,
      counterpartAvatarUrl: r.sender_avatar_url,
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
      counterpartDisplayName: r.recipient_display_name,
      counterpartAvatarUrl: r.recipient_avatar_url,
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
