// Visual-only sandbox for the Compatibility Report paywall screen — the
// same "not unlocked yet" branch rendered by
// pair/[id]/report/page.tsx, with mock data instead of a real DB row so
// it can be reviewed without a full two-person invite/consent flow.
// Clicking "Unlock" will call the real createPairingCheckoutSession
// action against this fake pairingId and error — that's expected here.
import { UnlockReportButton } from "@/app/[locale]/(personality)/pair/[id]/report/UnlockReportButton";

export default function PaywallPreviewPage() {
  const otherName = "Jordan";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Your Compatibility Report is Ready</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Unlock the full comparison with {otherName} across all four frameworks.
      </p>
      <div className="mt-6">
        <UnlockReportButton pairingId="preview-fake-id" />
      </div>
    </div>
  );
}
