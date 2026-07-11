import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
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
