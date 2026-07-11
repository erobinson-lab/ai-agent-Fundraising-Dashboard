import { VentureProfile, ChatTurn } from "@/types";

// Real-LLM backend for investor Q&A. Activates automatically when an API key
// env var is present (ANTHROPIC_API_KEY or OPENAI_API_KEY). Falls back to the
// rule-based qa-engine (lib/qa-engine.ts) when no key is configured, so the
// app works out of the box and upgrades transparently once you add a key.
//
// To enable: add ANTHROPIC_API_KEY=sk-ant-... (or OPENAI_API_KEY=sk-...) to
// .env.local and restart the dev server. No code changes needed.

function buildSystemPrompt(venture: VentureProfile): string {
  return `You are the investor relations AI agent for ${venture.name} (${venture.sector}, ${venture.stage}).
Tagline: ${venture.tagline}
The ask: ${venture.ask}
Use of funds: ${venture.useOfFunds}

KEY METRICS:
${venture.keyStats.map((s) => `- ${s.label}: ${s.value}`).join("\n")}

SWOT:
Strengths: ${venture.swot.strengths.join("; ")}
Weaknesses: ${venture.swot.weaknesses.join("; ")}
Opportunities: ${venture.swot.opportunities.join("; ")}
Threats: ${venture.swot.threats.join("; ")}

KNOWN OBJECTIONS & APPROVED ANSWERS (use these as ground truth, don't contradict them):
${venture.qaLibrary.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n")}

COMPLIANCE NOTE: ${venture.complianceNote}

HARD RULES:
1. Never discuss, estimate, or negotiate valuation, price per share/unit, discount rates, caps, or final deal terms. If asked, say you're not authorized and this will be escalated to the founder (Eugene Robinson) for direct follow-up.
2. Never make forward-looking guarantees ("this will definitely return X").
3. Stay strictly within the facts provided above — do not invent metrics, dates, or claims not grounded in this brief.
4. Be concise, professional, and investor-appropriate in tone.
5. If a question is fully outside this brief, say so plainly and note it will be escalated.

Respond ONLY with the investor-facing answer text (no preamble, no meta-commentary).`;
}

function isEscalation(text: string): boolean {
  const triggers = [
    "not authorized",
    "escalat",
    "founder",
    "eugene",
    "flagging this",
  ];
  const lower = text.toLowerCase();
  return triggers.some((t) => lower.includes(t));
}

export async function answerViaLLM(
  venture: VentureProfile,
  question: string,
  history: ChatTurn[]
): Promise<{ answer: string; escalated: boolean } | null> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) return null;

  const systemPrompt = buildSystemPrompt(venture);
  const historyText = history
    .slice(-8)
    .map((t) => `${t.role === "investor" ? "Investor" : "Agent"}: ${t.text}`)
    .join("\n");

  try {
    if (anthropicKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 500,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `Conversation so far:\n${historyText}\n\nInvestor's new question: ${question}`,
            },
          ],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const answer = data?.content?.[0]?.text?.trim();
      if (!answer) return null;
      return { answer, escalated: isEscalation(answer) };
    }

    if (openaiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 500,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Conversation so far:\n${historyText}\n\nInvestor's new question: ${question}`,
            },
          ],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) return null;
      return { answer, escalated: isEscalation(answer) };
    }
  } catch {
    return null;
  }

  return null;
}
