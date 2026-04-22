import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getModeratorData } from "@/utils/moderatorCounts";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const clientVersion = searchParams.get("version");

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "";

        const data = await getModeratorData(authId, userType, selectedAuthId);

        const serverVersionString = JSON.stringify(data._version);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        return NextResponse.json({
            mismatch: true,
            data: data
        });
    } catch (error) {
        console.error('Moderator Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

