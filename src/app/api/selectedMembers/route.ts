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

        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";
        const loginAuthIds = JSON.parse(selectedAuthId);

        let member = null;
        let switchAccounts: { authId: string; name: string | null }[] = [];

        if (loginAuthIds.length > 1) {
            const data = await getSelectedMembersData(mainMemberId, loginAuthIds);
            member = data.member;
            switchAccounts = data.switchAccounts;
        }

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
