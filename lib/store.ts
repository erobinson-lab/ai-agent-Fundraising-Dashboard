import { EngagementEvent, InvestorSession } from "@/types";

// In-memory demo store (resets on server restart). In production this would
// be a real database, and the chat/memo logic would call an LLM (e.g. via
// Lyzr Studio or the Magica API) grounded on the same venture knowledge base.
interface Store {
  engagement: EngagementEvent[];
  sessions: Record<string, InvestorSession>;
}

const globalStore = globalThis as unknown as { __trinityStore?: Store };

export function getStore(): Store {
  if (!globalStore.__trinityStore) {
    globalStore.__trinityStore = { engagement: [], sessions: {} };
  }
  return globalStore.__trinityStore;
}
