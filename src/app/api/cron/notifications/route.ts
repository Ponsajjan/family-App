import { NextRequest, NextResponse } from "next/server";
import { sendTodayEventNotifications } from "@/utils/pushNotify";

export const runtime = "nodejs";

// Lets an external scheduler (system cron, Docker cron, GitHub Actions, etc.)
// trigger the daily push run too — the in-process scheduler in
// src/instrumentation.ts covers single-instance self-hosting by default,
// this route is the escape hatch for every other deployment shape.
export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
    }

    const provided = request.nextUrl.searchParams.get("secret") || request.headers.get("x-cron-secret");
    if (provided !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await sendTodayEventNotifications();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("[cron/notifications] error:", error);
        return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
    }
}
