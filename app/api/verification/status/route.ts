import { NextResponse } from "next/server";
import { isVerificationConfigured } from "@/lib/verification";

export async function GET() {
  return NextResponse.json({ configured: isVerificationConfigured() });
}
