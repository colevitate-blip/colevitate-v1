"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDeepDiveCheckoutSession } from "./actions";

export function UnlockDeepDiveButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const url = await createDeepDiveCheckoutSession();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleUnlock} disabled={loading} size="lg" className="gap-2 rounded-full">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        {/* Keep in sync with DEEP_DIVE_REPORT_PRICE_CENTS in lib/stripe/server.ts, the actual charge amount. */}
        Unlock Deep Dive Report — $7.99
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
