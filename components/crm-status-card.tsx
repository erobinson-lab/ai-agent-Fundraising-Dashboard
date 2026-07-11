"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Link2Off } from "lucide-react";

interface CrmStatus {
  connected: boolean;
  hasToken: boolean;
  locationIdMasked: string | null;
}

export function CrmStatusCard({ ventureId }: { ventureId: string }) {
  const [status, setStatus] = useState<CrmStatus | null>(null);

  useEffect(() => {
    fetch(`/api/crm-status?ventureId=${ventureId}`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, [ventureId]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
          {status?.connected ? (
            <Link2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <Link2Off className="h-4 w-4 text-slate-500" />
          )}
          GoHighLevel Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!status ? (
          <p className="text-xs text-slate-500">Checking...</p>
        ) : status.connected ? (
          <>
            <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 hover:bg-emerald-600/20">
              Connected
            </Badge>
            <p className="text-xs text-slate-500">
              Location: <span className="font-mono">{status.locationIdMasked}</span>
            </p>
            <p className="text-xs text-slate-500">
              Hot leads (escalations + 20s+ slide dwell) auto-sync to this sub-account.
            </p>
          </>
        ) : (
          <>
            <Badge variant="secondary">Not Connected</Badge>
            <p className="text-xs text-slate-500">
              {status.hasToken
                ? "Token present but no Location ID configured for this venture — add one to .env.local."
                : "No GHL token configured yet."}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
