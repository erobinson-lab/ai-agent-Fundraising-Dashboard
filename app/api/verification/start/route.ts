import { NextResponse } from "next/server";
import { buildAuthorizeUrl, isVerificationConfigured } from "@/lib/verification";

export async function POST(request: Request) {
  const { sessionId } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }
  if (!isVerificationConfigured()) {
    return NextResponse.json(
      { error: "Parallel Markets / iCapital not configured yet" },
      { status: 503 }
    );
  }
  try {
    const url = buildAuthorizeUrl(sessionId);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
