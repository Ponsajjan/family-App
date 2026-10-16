import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import prisma from "@/db/db";

interface SubscribeBody {
    endpoint: string;
    keys: { p256dh: string; auth: string };
}

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

        const body: SubscribeBody = await request.json();
        if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
            return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
        }

        await prisma.pushSubscription.upsert({
            where: { endpoint: body.endpoint },
            update: { authId, p256dh: body.keys.p256dh, authKey: body.keys.auth },
            create: { authId, endpoint: body.endpoint, p256dh: body.keys.p256dh, authKey: body.keys.auth },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[notifications/subscribe] error:", error);
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
    }
}
