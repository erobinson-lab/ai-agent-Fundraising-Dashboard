// Accredited-investor verification via iCapital Identity Solutions
// (formerly Parallel Markets), using their OAuth 2.0 Server API.
//
// SETUP (once you have partner credentials from icapital.com/identity-solutions):
//   PARALLEL_CLIENT_ID=...
//   PARALLEL_CLIENT_SECRET=...
//   PARALLEL_REDIRECT_URI=https://<your-deployed-url>/api/verification/callback
//   PARALLEL_WEBHOOK_SECRET=...   (to validate incoming status-change webhooks)
//
// Until those are set, isVerificationConfigured() returns false and the
// investor gate falls back to the existing self-attestation toggle — nothing
// breaks, this activates automatically once credentials are added.

const PARALLEL_AUTH_BASE = "https://identity.parallelmarkets.com/oauth"; // per developer.parallelmarkets.com/docs/server
const PARALLEL_API_BASE = "https://identity.parallelmarkets.com/api/v3";

export function isVerificationConfigured(): boolean {
  return !!(process.env.PARALLEL_CLIENT_ID && process.env.PARALLEL_CLIENT_SECRET);
}

// Step 1: build the URL to redirect the investor to for identity/accreditation
// verification. `state` should be the investor's session id so the callback
// can match the result back to the right session.
export function buildAuthorizeUrl(state: string): string {
  const clientId = process.env.PARALLEL_CLIENT_ID;
  const redirectUri = process.env.PARALLEL_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error("Parallel Markets not configured — set PARALLEL_CLIENT_ID and PARALLEL_REDIRECT_URI");
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    // "accreditation_status" scope returns 506(c)-grade verified accreditation;
    // "identity" is the baseline KYC profile. Confirm exact scope names against
    // your partner onboarding docs once issued — this is the documented default.
    scope: "profile accreditation_status",
    state,
  });
  return `${PARALLEL_AUTH_BASE}/authorize?${params.toString()}`;
}

// Step 2: exchange the OAuth code (from the callback redirect) for an access
// token, then fetch the investor's accreditation status.
export async function exchangeCodeForAccreditation(code: string): Promise<{
  status: "verified" | "pending" | "failed";
  entityId?: string;
  expiresAt?: number;
} | null> {
  const clientId = process.env.PARALLEL_CLIENT_ID;
  const clientSecret = process.env.PARALLEL_CLIENT_SECRET;
  const redirectUri = process.env.PARALLEL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) return null;

  try {
    const tokenRes = await fetch(`${PARALLEL_AUTH_BASE}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenRes.ok) return null;
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return null;

    const profileRes = await fetch(`${PARALLEL_API_BASE}/identities/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) return null;
    const profile = await profileRes.json();

    const accreditation = profile?.accreditation_statuses?.[0];
    if (!accreditation) return { status: "pending", entityId: profile?.id };

    return {
      status: accreditation.status === "current" ? "verified" : "failed",
      entityId: profile?.id,
      expiresAt: accreditation.expires_at
        ? new Date(accreditation.expires_at).getTime()
        : undefined,
    };
  } catch (err) {
    console.error("Parallel Markets verification failed", err);
    return null;
  }
}
