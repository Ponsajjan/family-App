import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyToken } from "@/utils/auth";
import prisma from "@/db/db";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;

        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Verify that the user is currently logged in as a moderator
        if (userType !== "Moderator") {
            return NextResponse.json(
                { error: "Not logged in as moderator" },
                { status: 403 }
            );
        }

        // Get the auth record
        const login = await prisma.auth.findUnique({
            where: {
                id: authId,
            },
        });

        if (!login) {
            return NextResponse.json(
                { error: "Auth record not found" },
                { status: 404 }
            );
        }

        // Generate token for member
        const newtoken = await generateToken({
            authId: login.id,
            memberId: login.mainMemberId,
            userType: "Member",
        });

        return NextResponse.json({
            message: "Logout from moderator successful",
            newtoken,
            userType: "Member",
            authId: login.memberAuthId,
            oldAuthId: login.moderatorAuthId
        }, { status: 200 });

    } catch (error) {
        console.error("Error logging out from moderator:", error);
        // Handle token verification errors
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Failed to logout from moderator" },
            { status: 500 }
        );
    }
}
