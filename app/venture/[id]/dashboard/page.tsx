"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { VENTURES } from "@/lib/ventures-data";
import { EngagementHeatmap } from "@/components/engagement-heatmap";
import { MemoPanel } from "@/components/memo-panel";
import { NavBar } from "@/components/nav-bar";
import { CrmStatusCard } from "@/components/crm-status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, ShieldAlert } from "lucide-react";
import { AccreditationVerification } from "@/types";

interface SessionSummary {
  id: string;
  investorName: string;
  firm: string;
  ventureId: string;
  accredited: boolean;
  verification: AccreditationVerification;
  createdAt: number;
}

function verificationLabel(v: AccreditationVerification): { label: string; variant: "default" | "secondary" } {
  if (v.provider === "parallel_markets" && v.status === "verified") {
    return { label: "Verified (iCapital)", variant: "default" };
  }
  if (v.provider === "parallel_markets" && v.status === "pending") {
    return { label: "Verification Pending", variant: "secondary" };
  }
  if (v.provider === "parallel_markets" && (v.status === "failed" || v.status === "expired")) {
    return { label: "Verification Failed", variant: "secondary" };
  }
  if (v.status === "verified") {
    return { label: "Self-Attested", variant: "default" };
  }
  return { label: "Unverified", variant: "secondary" };
}

export default function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const venture = VENTURES[id];
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    const fetchData = () =>
      fetch(`/api/session?ventureId=${id}`)
        .then((r) => r.json())
        .then(setSessions)
        .catch(() => {});
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!venture) {
    return <div className="p-10 text-slate-400">Unknown venture.</div>;
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> All ventures
          </Link>
          <Link
            href={`/venture/${id}/room`}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Open Investor Room →
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">{venture.name} — Fundraising Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">{venture.ask}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4" /> Investor Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sessions.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Accredited Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {sessions.filter((s) => s.accredited).length}/{sessions.length || 0}
              </div>
            </CardContent>
          </Card>
          <CrmStatusCard ventureId={id} />
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Compliance Flag
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 leading-relaxed">{venture.complianceNote}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Investor List</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-500">No investors have entered the room yet.</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => {
                  const v = verificationLabel(s.verification);
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{s.investorName}</p>
                        <p className="text-xs text-slate-500">{s.firm}</p>
                      </div>
                      <Badge variant={v.variant}>{v.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EngagementHeatmap ventureId={id} slideCount={venture.slideCount} />
          <MemoPanel sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
