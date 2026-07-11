"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { VentureId } from "@/types";

interface InvestorGateProps {
  ventureId: VentureId;
  ventureName: string;
  onEnter: (session: { id: string; investorName: string }) => void;
}

export function InvestorGate({ ventureId, ventureName, onEnter }: InvestorGateProps) {
  const [investorName, setInvestorName] = useState("");
  const [firm, setFirm] = useState("");
  const [accredited, setAccredited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [verificationConfigured, setVerificationConfigured] = useState(false);

  useEffect(() => {
    fetch("/api/verification/status")
      .then((r) => r.json())
      .then((d) => setVerificationConfigured(!!d.configured))
      .catch(() => {});
  }, []);

  async function createSession() {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ventureId, investorName, firm, accredited }),
    });
    return res.json();
  }

  async function handleSelfAttest() {
    if (!investorName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!accredited) {
      setError("Accredited investor attestation is required to view financials.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await createSession();
      onEnter({ id: data.id, investorName: data.investorName });
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyWithParallel() {
    if (!investorName.trim()) {
      setError("Please enter your name first.");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const data = await createSession();
      const startRes = await fetch("/api/verification/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: data.id }),
      });
      const startData = await startRes.json();
      if (startData.url) {
        window.location.href = startData.url;
      } else {
        setError(startData.error || "Verification is not available right now.");
        setVerifying(false);
      }
    } catch {
      setError("Something went wrong starting verification.");
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Lock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Data Room Access</span>
          </div>
          <CardTitle>{ventureName} — Investor Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={investorName} onChange={(e) => setInvestorName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firm">Firm (optional)</Label>
            <Input id="firm" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="Acme Ventures" />
          </div>

          {verificationConfigured ? (
            <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/30 p-3 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" /> Verify with iCapital / Parallel Markets
              </div>
              <p className="text-xs text-slate-400">
                Recommended — a documented, Reg D 506(c)-grade accreditation check instead of self-attestation.
              </p>
              <Button className="w-full" onClick={handleVerifyWithParallel} disabled={verifying}>
                {verifying ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                Verify My Accreditation
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-slate-800 p-3">
              <div>
                <Label htmlFor="accredited">I am an accredited investor</Label>
                <p className="text-xs text-slate-500 mt-1">
                  Self-attestation — required to view detailed financials. Real verification (iCapital / Parallel Markets) isn&apos;t configured yet.
                </p>
              </div>
              <Switch id="accredited" checked={accredited} onCheckedChange={setAccredited} />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          {!verificationConfigured && (
            <Button className="w-full" onClick={handleSelfAttest} disabled={loading}>
              {loading ? "Entering..." : "Enter Data Room"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
