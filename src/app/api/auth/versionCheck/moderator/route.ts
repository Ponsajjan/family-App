import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const clientVersion = searchParams.get("version");

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";

        const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);
        
        const serverVersionString = JSON.stringify(updatedAt);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        const otherAuthIds = allAuthIds.filter(id => id !== authId);
        let anyOtherAccountHasIssues = false;

        if (otherAuthIds.length > 0) {
            const [otherUnverifiedCount, otherPendingRequestCount] = await Promise.all([
                prisma.member.count({ where: { authId: { in: otherAuthIds }, verified: false } }),
                prisma.requestDetails.count({ where: { authId: { in: otherAuthIds } } }),
            ]);
            anyOtherAccountHasIssues = (otherUnverifiedCount + otherPendingRequestCount) > 0;
        }

        const [unverifiedCount, pendingRequestCount, familyTree] = await Promise.all([
            prisma.member.count({ where: { authId, verified: false } }),
            prisma.requestDetails.count({ where: { authId } }),
            prisma.familyTree.findUnique({
                where: { authId },
                select: { status: true, lastBuildStartedAt: true, updatedAt: true }
            })
        ]);

        let chartStatus = familyTree?.status || "not_built";
        const TIMEOUT_MS = 5 * 60 * 1000;
        if (chartStatus === "building" && familyTree?.lastBuildStartedAt && Date.now() - familyTree.lastBuildStartedAt.getTime() > TIMEOUT_MS) {
            chartStatus = "timeout";
        }

        return NextResponse.json({
            mismatch: true,
            data: {
                unverifiedMembers: unverifiedCount,
                pendingRequests: pendingRequestCount,
                chartStatus: chartStatus,
                anyOtherAccountHasIssues: anyOtherAccountHasIssues,
                lastBuildStartedAt: familyTree?.lastBuildStartedAt || null,
                updatedAt: familyTree?.updatedAt || null,
                _version: updatedAt,
            }
        });
    } catch (error) {
        console.error('Moderator Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
