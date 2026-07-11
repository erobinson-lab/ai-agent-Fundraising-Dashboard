"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VENTURES } from "@/lib/ventures-data";
import { InvestorGate } from "@/components/investor-gate";
import { SlideViewer } from "@/components/slide-viewer";
import { ChatWidget } from "@/components/chat-widget";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, ShieldCheck, ShieldAlert } from "lucide-react";
import { VentureId, InvestorSession } from "@/types";

function RoomContent({ id }: { id: string }) {
  const venture = VENTURES[id];
  const searchParams = useSearchParams();
  const [session, setSession] = useState<{ id: string; investorName: string } | null>(null);
  const [verificationBanner, setVerificationBanner] = useState<string | null>(null);
  const [resuming, setResuming] = useState(true);

  useEffect(() => {
    const resumeId = searchParams.get("sessionId");
    const verificationResult = searchParams.get("verification");

    if (!resumeId) {
      setResuming(false);
      return;
    }

    fetch(`/api/session/${resumeId}`)
      .then((r) => r.json())
      .then((data: InvestorSession & { error?: string }) => {
        if (!data.error) {
          setSession({ id: data.id, investorName: data.investorName });
          if (verificationResult === "verified") {
            setVerificationBanner("Accreditation verified via iCapital / Parallel Markets.");
          } else if (verificationResult === "pending") {
            setVerificationBanner("Verification submitted — pending review.");
          } else if (verificationResult === "failed") {
            setVerificationBanner("Verification could not be completed. Please contact the founder directly.");
          }
        }
      })
      .catch(() => {})
      .finally(() => setResuming(false));
  }, [searchParams]);

  if (!venture) {
    return <div className="p-10 text-slate-400">Unknown venture.</div>;
  }

  if (resuming) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <InvestorGate
        ventureId={venture.id}
        ventureName={venture.name}
        onEnter={(s) => setSession(s)}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> All ventures
        </Link>
        <span className="text-sm text-slate-400">
          Welcome, {session.investorName} · <span className="font-medium text-slate-200">{venture.name}</span>
        </span>
      </div>
      {verificationBanner && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            verificationBanner.startsWith("Accreditation verified")
              ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-400"
              : "border-amber-800/50 bg-amber-950/30 text-amber-400"
          }`}
        >
          {verificationBanner.startsWith("Accreditation verified") ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <ShieldAlert className="h-4 w-4" />
          )}
          {verificationBanner}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-[70vh]">
        <div className="lg:col-span-2 flex flex-col">
          <SlideViewer
            ventureId={venture.id as VentureId}
            slideCount={venture.slideCount}
            investorId={session.id}
            investorName={session.investorName}
          />
        </div>
        <div className="lg:col-span-1 min-h-[400px]">
          <ChatWidget sessionId={session.id} ventureName={venture.name} />
        </div>
      </div>
    </div>
  );
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="min-h-screen">
      <NavBar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
            Loading...
          </div>
        }
      >
        <RoomContent id={id} />
      </Suspense>
    </div>
  );
}
