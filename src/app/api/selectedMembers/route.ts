import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getSelectedMembersData } from "@/utils/switchAccountHelpers";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const mainMemberId = decoded.memberId;

        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const selectedAuthId = request.cookies.get("authId")?.value || "[]";
        const loginAuthIds = JSON.parse(selectedAuthId);

        const { member, switchAccounts } = await getSelectedMembersData(mainMemberId, loginAuthIds);

        return NextResponse.json({
            member,
            switchAccounts,
        });
    } catch (error) {
        console.error("Error fetching selected members:", error);
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Failed to fetch data: ${error.message}` },
                { status: 500 }
            );
        }
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
