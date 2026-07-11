import { NextResponse } from "next/server";
import { exchangeCodeForAccreditation } from "@/lib/verification";
import { getStore } from "@/lib/store";

// Redirect target after the investor completes the iCapital/Parallel Markets
// verification flow. `state` carries the investor session id we set in
// buildAuthorizeUrl().
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const sessionId = searchParams.get("state");

  if (!code || !sessionId) {
    return NextResponse.redirect(`${origin}/?verification=error`);
  }

  const store = getStore();
  const session = store.sessions[sessionId];
  if (!session) {
    return NextResponse.redirect(`${origin}/?verification=session_not_found`);
  }

  const result = await exchangeCodeForAccreditation(code);
  if (!result) {
    session.verification = { provider: "parallel_markets", status: "failed" };
    return NextResponse.redirect(
      `${origin}/venture/${session.ventureId}/room?verification=failed&sessionId=${sessionId}`
    );
  }

  session.verification = {
    provider: "parallel_markets",
    status: result.status,
    verifiedAt: result.status === "verified" ? Date.now() : undefined,
    expiresAt: result.expiresAt,
    parallelEntityId: result.entityId,
  };
  session.accredited = result.status === "verified";

  return NextResponse.redirect(
    `${origin}/venture/${session.ventureId}/room?verification=${result.status}&sessionId=${sessionId}`
  );
}
