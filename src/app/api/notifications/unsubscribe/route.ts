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
        if (!decoded.authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const { endpoint, familyAuthId } = await request.json();
        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });
        }

        // By default this unsubscribes the currently active session's family
        // (used by the notification toggle). When removing a *different*
        // family from the account list (which may not be the active
        // session), the caller instead passes that family's public
        // memberAuthId/moderatorAuthId string — the only identifier the
        // client has for a non-active account — which we resolve to the
        // real numeric Auth.id that PushSubscription.authId references.
        let authId = decoded.authId;
        if (familyAuthId) {
            const auth = await prisma.auth.findFirst({
                where: { OR: [{ memberAuthId: familyAuthId }, { moderatorAuthId: familyAuthId }] },
                select: { id: true },
            });
            if (!auth) {
                return NextResponse.json({ error: "Family not found" }, { status: 404 });
            }
            authId = auth.id;
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
