import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import { CompatibilityReportView } from "@/components/personality/compatibility/CompatibilityReportView";
import type { RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import type { PairingAxisSnapshot, ShareLevel } from "../../actions";
import { UnlockReportButton } from "./UnlockReportButton";

interface PairingRow {
  id: string;
  inviter_id: string;
  invitee_id: string | null;
  status: string;
  relationship_type: RelationshipType;
  consent_share_level: ShareLevel | null;
  inviter_display_name: string | null;
  invitee_display_name: string | null;
  inviter_axes: PairingAxisSnapshot[] | null;
  invitee_axes: PairingAxisSnapshot[] | null;
  unlocked_at: string | null;
}

export default async function PairingReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pairingId } = await params;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect(`/login?next=/pair/${pairingId}/report`);
  }

  const { data: pairing } = await supabase
    .from("pairings")
    .select(
      "id, inviter_id, invitee_id, status, relationship_type, consent_share_level, inviter_display_name, invitee_display_name, inviter_axes, invitee_axes, unlocked_at"
    )
    .eq("id", pairingId)
    .maybeSingle();

  const row = pairing as PairingRow | null;

  if (!row) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Report Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This report doesn&apos;t exist, or you&apos;re not part of this comparison.
        </p>
      </div>
    );
  }

  const viewerIsInviter = row.inviter_id === user.id;
  const otherName = (viewerIsInviter ? row.invitee_display_name : row.inviter_display_name) || "This person";

  if (row.status === "pending") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Waiting on {otherName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your invite hasn&apos;t been accepted yet. Come back once they&apos;ve responded.
        </p>
      </div>
    );
  }

  if (row.status !== "accepted" || !row.inviter_axes || !row.invitee_axes) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Invite No Longer Available</h1>
        <p className="mt-2 text-sm text-muted-foreground">This comparison was declined or revoked.</p>
      </div>
    );
  }

  if (!row.unlocked_at) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your Compatibility Report is Ready</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unlock the full comparison with {otherName} across all four frameworks.
        </p>
        <div className="mt-6">
          <UnlockReportButton pairingId={row.id} />
        </div>
      </div>
    );
  }

  const viewerAxes = viewerIsInviter ? row.inviter_axes : row.invitee_axes;
  const otherAxes = viewerIsInviter ? row.invitee_axes : row.inviter_axes;
  const compatibility = computeCompatibility(viewerAxes, otherAxes, "You", otherName);

  // consent_share_level is what the invitee chose to share back to the
  // inviter — it only restricts the inviter's view of the invitee's data,
  // never the invitee's view of their own comparison.
  const shareLevel: ShareLevel = viewerIsInviter ? row.consent_share_level ?? "summary_only" : "axes";

  return (
    <CompatibilityReportView
      compatibility={compatibility}
      nameA="You"
      nameB={otherName}
      relationshipType={row.relationship_type}
      shareLevel={shareLevel}
    />
  );
}
