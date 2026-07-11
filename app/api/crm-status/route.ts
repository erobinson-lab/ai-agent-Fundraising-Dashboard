import { NextResponse } from "next/server";
import { getGhlLocationId } from "@/lib/crm";

function mask(id: string): string {
  if (id.length <= 4) return "••••";
  return `${id.slice(0, 4)}••••${id.slice(-2)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ventureId = searchParams.get("ventureId");
  if (!ventureId) {
    return NextResponse.json({ error: "ventureId required" }, { status: 400 });
  }

  const hasToken = !!process.env.GHL_API_TOKEN;
  const locationId = getGhlLocationId(ventureId);
  const connected = hasToken && !!locationId;

  return NextResponse.json({
    connected,
    hasToken,
    locationIdMasked: locationId ? mask(locationId) : null,
  });
}
