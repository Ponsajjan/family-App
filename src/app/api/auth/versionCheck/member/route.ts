import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchMemberData } from "@/utils/memberUtils";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const memberId = parseInt(searchParams.get("memberId") || "");
    const clientVersion = searchParams.get("version");

    if (isNaN(memberId)) {
        return NextResponse.json({ error: "Invalid memberId" }, { status: 400 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "";
        const loginAuthIds = selectedAuthId ? JSON.parse(selectedAuthId) : [];

        const { updatedAt } = await getAllAuthIds(authId, userType);

        const serverVersionString = JSON.stringify(updatedAt);

        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        const responseData = await fetchMemberData(memberId, loginAuthIds.length);

        if (!responseData) return NextResponse.json({ error: "Member not found" }, { status: 404 });

        return NextResponse.json({
            mismatch: true,
            data: {
                data: responseData,
                _version: updatedAt
            }
        });
    } catch (error) {
        console.error('Member Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

