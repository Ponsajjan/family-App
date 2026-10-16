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

        await prisma.pushSubscription.deleteMany({ where: { endpoint, authId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[notifications/unsubscribe] error:", error);
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 });
    }
}
