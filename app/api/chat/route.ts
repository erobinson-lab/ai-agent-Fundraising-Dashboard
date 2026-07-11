import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { VENTURES } from "@/lib/ventures-data";
import { answerInvestorQuestion } from "@/lib/qa-engine";
import { answerViaLLM } from "@/lib/llm";
import { notifyHotLead } from "@/lib/crm";
import { ChatTurn } from "@/types";

export async function POST(request: Request) {
  const { sessionId, message } = await request.json();
  const store = getStore();
  const session = store.sessions[sessionId];

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const venture = VENTURES[session.ventureId];
  const investorTurn: ChatTurn = {
    role: "investor",
    text: message,
    timestamp: Date.now(),
  };

  // Try the real LLM backend first (activates automatically once an API key
  // env var is set — see lib/llm.ts). Falls back to the deterministic
  // rule-based engine so the app always works.
  const llmResult = await answerViaLLM(venture, message, session.transcript);
  const result = llmResult ?? answerInvestorQuestion(venture, message);

  const agentTurn: ChatTurn = {
    role: "agent",
    text: result.answer,
    timestamp: Date.now(),
    escalated: result.escalated,
  };

  session.transcript.push(investorTurn, agentTurn);

  if (result.escalated) {
    notifyHotLead({
      reason: "escalation",
      venture,
      session,
      detail: message,
    }).catch(() => {});
  }

  return NextResponse.json({ session });
}
