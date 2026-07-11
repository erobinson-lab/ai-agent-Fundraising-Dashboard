import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { VENTURES } from "@/lib/ventures-data";
import { notifyHotLead } from "@/lib/crm";
import { EngagementEvent } from "@/types";

const HOT_DWELL_THRESHOLD_MS = 20000;

export async function POST(request: Request) {
  const body: EngagementEvent = await request.json();
  const store = getStore();
  const event = { ...body, timestamp: Date.now() };
  store.engagement.push(event);

  if (event.dwellMs >= HOT_DWELL_THRESHOLD_MS) {
    const venture = VENTURES[event.ventureId];
    const session = store.sessions[event.investorId];
    if (venture && session) {
      notifyHotLead({
        reason: "high_engagement",
        venture,
        session,
        detail: `${(event.dwellMs / 1000).toFixed(1)}s on slide ${event.slideIndex + 1}`,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ventureId = searchParams.get("ventureId");
  const store = getStore();
  const events = ventureId
    ? store.engagement.filter((e) => e.ventureId === ventureId)
    : store.engagement;
  return NextResponse.json(events);
}
