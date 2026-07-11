import { VentureProfile } from "@/types";

const ESCALATION_TRIGGERS = [
  "valuation",
  "term sheet",
  "discount rate",
  "board seat",
  "pro rata",
  "convert at",
  "cap on the safe",
  "negotiate",
  "lower the price",
  "final terms",
];

export interface QAResult {
  answer: string;
  escalated: boolean;
}

// Demo keyword-matching Q&A engine standing in for the production LLM agent.
// In production, swap this function body for a call to your LLM provider
// (e.g. Lyzr agent / Magica API) with the venture's qaLibrary + deck text
// injected as grounding context, keeping the same escalation contract below.
export function answerInvestorQuestion(
  venture: VentureProfile,
  question: string
): QAResult {
  const q = question.toLowerCase();

  for (const trigger of ESCALATION_TRIGGERS) {
    if (q.includes(trigger)) {
      return {
        answer:
          "That touches valuation/terms, which I'm not authorized to negotiate on behalf of the company. I'm flagging this for Eugene to follow up with you directly — expect a response within one business day.",
        escalated: true,
      };
    }
  }

  let best: { score: number; answer: string } | null = null;
  for (const entry of venture.qaLibrary) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }

  if (best) {
    return { answer: best.answer, escalated: false };
  }

  return {
    answer:
      `Good question — I don't have a scripted answer for that yet on ${venture.name}. I'm logging it and Eugene will follow up directly with specifics.`,
    escalated: true,
  };
}
