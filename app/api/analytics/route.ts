import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
