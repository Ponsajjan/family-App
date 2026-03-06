import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
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

        let switchAccounts: { authId: string; name: string | null }[] = [];
        if (loginAuthIds.length > 1) {
            const data = await getSelectedMembersData(mainMemberId, loginAuthIds);
            switchAccounts = data.switchAccounts;
        }

        const familyTree = await prisma.familyTree.findUnique({
            where: { authId: authId },
            select: { data: true }
        });

        if (!familyTree) {
            return NextResponse.json({ error: "No chart found. Please update the chart first." }, { status: 404 });
        }

        return NextResponse.json({ treeData: familyTree.data, switchAccounts });
    } catch (error) {
        console.error("Error fetching relations chart:", error);
        return NextResponse.json(
            { error: "Failed to fetch relations chart" },
            { status: 500 }
        );
    }
}
