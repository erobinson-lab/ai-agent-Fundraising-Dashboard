import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { VENTURES } from "@/lib/ventures-data";
import { notifyHotLead } from "@/lib/crm";
import { InvestorSession } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { ventureId, investorName, firm, accredited } = body;

  if (!ventureId || !investorName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const session: InvestorSession = {
    id: crypto.randomUUID(),
    ventureId,
    investorName,
    firm: firm || "Unspecified",
    accredited: !!accredited,
    verification: {
      provider: "self_attested",
      status: accredited ? "verified" : "unverified",
    },
    createdAt: Date.now(),
    transcript: [],
  };

  const store = getStore();
  store.sessions[session.id] = session;

  // Sync every investor-room entry to the CRM immediately — not just
  // escalations or high-engagement sessions — so no visit is ever lost if
  // this in-memory store resets on redeploy.
  const venture = VENTURES[ventureId];
  if (venture) {
    notifyHotLead({
      reason: "new_visit",
      venture,
      session,
      detail: `Entered the investor room${firm ? ` from ${firm}` : ""}`,
    }).catch(() => {});
  }

  return NextResponse.json(session, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ventureId = searchParams.get("ventureId");
  const store = getStore();
  const all = Object.values(store.sessions);
  const filtered = ventureId ? all.filter((s) => s.ventureId === ventureId) : all;
  return NextResponse.json(filtered);
}
