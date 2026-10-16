import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import prisma from "@/db/db";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const { endpoint } = await request.json();
        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });
        }

        const subscription = await prisma.pushSubscription.findUnique({
            where: { endpoint_authId: { endpoint, authId } },
        });

        return NextResponse.json({ subscribed: Boolean(subscription) });
    } catch (error) {
        console.error("[notifications/status] error:", error);
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to check subscription status" }, { status: 500 });
    }
}
