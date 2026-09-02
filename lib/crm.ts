import { VentureProfile, InvestorSession } from "@/types";

interface HotLeadPayload {
  reason: "escalation" | "high_engagement" | "new_visit";
  venture: VentureProfile;
  session: InvestorSession;
  detail: string;
}

// Each venture is its own GoHighLevel sub-account, so each gets its own
// Location ID env var. Add new ventures here as they get a GHL sub-account.
const LOCATION_ID_ENV_BY_VENTURE: Record<string, string> = {
  nilvault: "GHL_LOCATION_ID_NILVAULT",
  dentalpass: "GHL_LOCATION_ID_DENTALPASS",
  midwestbudz: "GHL_LOCATION_ID_MIDWESTBUDZ",
};

export function getGhlLocationId(ventureId: string): string | undefined {
  const envKey = LOCATION_ID_ENV_BY_VENTURE[ventureId];
  return (envKey && process.env[envKey]) || process.env.GHL_LOCATION_ID || undefined;
}

// Fires a lead alert to GoHighLevel (or any Zapier/Make webhook) so every
// investor-room visit — not just escalated questions or high-engagement
// sessions — lands in your pipeline automatically. GoHighLevel isn't a
// one-click connector here, but it accepts direct API calls / inbound
// webhooks, so this hits it straight over HTTP.
//
// Configure in .env.local:
//   GHL_API_TOKEN                          -> shared Private Integration Token
//   GHL_LOCATION_ID_<VENTURE>               -> per-venture sub-account Location ID
//                                              (falls back to GHL_LOCATION_ID if unset)
//   GHL_WEBHOOK_URL                         -> simpler alternative: POSTs JSON to
//                                              a GHL inbound webhook / Zapier / Make
//
// A venture with no Location ID configured safely no-ops (logs only) — this is
// intentional for Midwest Budz until securities counsel signs off.
export async function notifyHotLead(payload: HotLeadPayload): Promise<void> {
  const { reason, venture, session, detail } = payload;
  const reasonLabel =
    reason === "escalation"
      ? "asked an escalated question"
      : reason === "high_engagement"
      ? "high deck engagement"
      : "entered the investor room";
  const summary = `[${venture.name}] ${
    reason === "new_visit" ? "New investor visit" : "Hot lead"
  }: ${session.investorName}${
    session.firm ? ` (${session.firm})` : ""
  } — ${reasonLabel}: "${detail}"`;

  const token = process.env.GHL_API_TOKEN;
  const locationId = getGhlLocationId(venture.id);
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  try {
    if (token && locationId) {
      await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify({
          locationId,
          name: session.investorName,
          companyName: session.firm,
          source: `Trinity IR — ${venture.name}`,
          tags: [reason === "new_visit" ? "new-visitor" : "hot-lead", venture.id, reason],
          customFields: [{ key: "last_agent_note", value: summary }],
        }),
      });
      return;
    }

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venture: venture.name,
          investor: session.investorName,
          firm: session.firm,
          reason,
          detail,
          summary,
          timestamp: Date.now(),
        }),
      });
      return;
    }
  } catch (err) {
    console.error("notifyHotLead failed", err);
    return;
  }

  // No CRM configured for this venture — safe no-op, logged for visibility in dev.
  console.log("[lead event, no CRM configured for this venture]", summary);
}
