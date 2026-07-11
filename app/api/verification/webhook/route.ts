import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// Receives async status-change pushes from iCapital/Parallel Markets
// (e.g. an accreditation later expires or gets revoked). Configure this URL
// as the webhook endpoint in your partner dashboard once issued:
//   https://<your-deployed-url>/api/verification/webhook
//
// Validate PARALLEL_WEBHOOK_SECRET once you have their signing-secret format —
// placeholder check included below, tighten to their actual HMAC scheme.
export async function POST(request: Request) {
  const secret = process.env.PARALLEL_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get("x-webhook-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const body = await request.json();
  const entityId: string | undefined = body?.entity_id ?? body?.id;
  const newStatus: string | undefined = body?.accreditation_status ?? body?.status;

  if (!entityId || !newStatus) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const store = getStore();
  const session = Object.values(store.sessions).find(
    (s) => s.verification?.parallelEntityId === entityId
  );

  if (session) {
    const verified = newStatus === "current" || newStatus === "verified";
    session.verification = {
      ...session.verification,
      status: verified ? "verified" : "expired",
      verifiedAt: verified ? Date.now() : session.verification.verifiedAt,
    };
    session.accredited = verified;
  }

  return NextResponse.json({ ok: true });
}
