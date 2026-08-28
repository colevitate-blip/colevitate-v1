"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApproachRequestRow } from "@/components/discovery/ApproachRequestRow";
import type { ApproachRequestSummary } from "@/components/discovery/discoveryTypes";

export function RequestsTabs({
  incoming,
  outgoing,
}: {
  incoming: ApproachRequestSummary[];
  outgoing: ApproachRequestSummary[];
}) {
  const t = useTranslations("discovery.requests");

  return (
    <Tabs defaultValue="incoming">
      <TabsList>
        <TabsTrigger value="incoming">{t("incomingTab")}</TabsTrigger>
        <TabsTrigger value="outgoing">{t("outgoingTab")}</TabsTrigger>
      </TabsList>

      <TabsContent value="incoming" className="mt-4 space-y-3">
        {incoming.length > 0 ? (
          incoming.map((r) => <ApproachRequestRow key={r.id} request={r} direction="incoming" />)
        ) : (
          <p className="text-sm text-muted-foreground">{t("emptyIncoming")}</p>
        )}
      </TabsContent>

      <TabsContent value="outgoing" className="mt-4 space-y-3">
        {outgoing.length > 0 ? (
          outgoing.map((r) => <ApproachRequestRow key={r.id} request={r} direction="outgoing" />)
        ) : (
          <p className="text-sm text-muted-foreground">{t("emptyOutgoing")}</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
