import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { VENTURES } from "@/lib/ventures-data";

export async function POST(request: Request) {
  const { sessionId } = await request.json();
  const store = getStore();
  const session = store.sessions[sessionId];
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  const venture = VENTURES[session.ventureId];
  const engagement = store.engagement.filter(
    (e) => e.investorId === session.id
  );

  const slideDwell = new Map<number, number>();
  for (const e of engagement) {
    slideDwell.set(e.slideIndex, (slideDwell.get(e.slideIndex) || 0) + e.dwellMs);
  }
  const sortedSlides = [...slideDwell.entries()].sort((a, b) => b[1] - a[1]);
  const topSlides = sortedSlides.slice(0, 3);

  const questions = session.transcript.filter((t) => t.role === "investor");
  const escalations = session.transcript.filter(
    (t) => t.role === "agent" && t.escalated
  );

  const date = new Date(session.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const memo = `INVESTMENT MEMO — ${venture.name}
Prepared: ${date}
Investor: ${session.investorName}${session.firm ? ` (${session.firm})` : ""}
Accredited investor status: ${session.accredited ? "Attested" : "NOT YET CONFIRMED — do not share full financials until attested"}

── COMPANY SNAPSHOT ──
${venture.name} — ${venture.tagline}
Sector: ${venture.sector}
Stage: ${venture.stage}
The Ask: ${venture.ask}
Use of Funds: ${venture.useOfFunds}

── KEY METRICS ──
${venture.keyStats.map((s) => `• ${s.label}: ${s.value}`).join("\n")}

── SWOT ──
Strengths:
${venture.swot.strengths.map((s) => `  + ${s}`).join("\n")}
Weaknesses:
${venture.swot.weaknesses.map((s) => `  - ${s}`).join("\n")}
Opportunities:
${venture.swot.opportunities.map((s) => `  ~ ${s}`).join("\n")}
Threats:
${venture.swot.threats.map((s) => `  ! ${s}`).join("\n")}

── INVESTOR ENGAGEMENT SIGNAL ──
${
  topSlides.length
    ? topSlides
        .map(
          ([idx, ms], i) =>
            `  ${i + 1}. Slide ${idx + 1} — ${(ms / 1000).toFixed(1)}s dwell time${
              i === 0 ? "  ← most lingered-on slide" : ""
            }`
        )
        .join("\n")
    : "  No deck-viewing engagement recorded yet for this session."
}

── Q&A TRANSCRIPT SUMMARY ──
${
  questions.length
    ? questions
        .map((q, i) => `  Q${i + 1}: ${q.text}`)
        .join("\n")
    : "  No investor questions recorded yet."
}

Escalated to founder for follow-up: ${escalations.length} item(s)
${escalations.map((e) => `  → ${e.text}`).join("\n")}

── COMPLIANCE NOTE ──
${venture.complianceNote}

── RECOMMENDED NEXT STEP ──
${
  escalations.length > 0
    ? "Escalated items pending — founder should follow up directly before advancing this investor."
    : topSlides.length > 0 && topSlides[0][1] > 20000
    ? "High engagement on financials/ask — treat as a warm lead, prioritize a live call within 48 hours."
    : "Standard nurture cadence — continue drip follow-up and monitor re-engagement."
}

This memo was auto-drafted by the venture's fundraising AI agent from the live deck data, investor Q&A transcript, and slide-engagement telemetry above. Review before external distribution.
`;

  return NextResponse.json({ memo });
}
