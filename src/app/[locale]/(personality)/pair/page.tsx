import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { relationshipFramingFor, type RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import { PairingInviteRow } from "@/components/pairing/PairingInviteRow";
import type { PairingStatus } from "@/components/pairing/pairingTypes";
import { Link } from "@/i18n/navigation";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";

interface PairingRow {
  id: string;
  inviter_id: string;
  invitee_id: string | null;
  invite_code: string;
  relationship_type: RelationshipType;
  status: PairingStatus;
  inviter_display_name: string | null;
  invitee_display_name: string | null;
  created_at: string;
}

export default async function PairingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(await loginRedirectTarget("/pair"));
  }

  const { data: rows } = await supabase
    .from("pairings")
    .select(
      "id, inviter_id, invitee_id, invite_code, relationship_type, status, inviter_display_name, invitee_display_name, created_at"
    )
    .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const pairings = (rows as PairingRow[] | null) || [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Comparisons</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Invites you&apos;ve sent or received to compare combined profiles with someone.
        </p>
      </div>

      {pairings.length > 0 ? (
        <div className="mb-8 space-y-3">
          {pairings.map((pairing) => {
            const isInviter = pairing.inviter_id === user.id;
            return (
              <PairingInviteRow
                key={pairing.id}
                id={pairing.id}
                inviteCode={pairing.invite_code}
                relationshipLabel={relationshipFramingFor(pairing.relationship_type).label}
                status={pairing.status}
                otherName={isInviter ? pairing.invitee_display_name : pairing.inviter_display_name}
                isInviter={isInviter}
              />
            );
          })}
        </div>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">
          You haven&apos;t sent or received any comparison invites yet.
        </p>
      )}

      <Link
        href="/combined"
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Start a new comparison
      </Link>
    </div>
  );
}
