import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    headers: Object.fromEntries(req.headers.entries()),
    geo: (req as any).geo ?? null,
  });
}
