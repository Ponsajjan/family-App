import prisma from "@/db/db";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

export async function getModeratorData(authId: number, userType: string, selectedAuthIdsCookie: string) {
    const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthIdsCookie);

    // Filter out current authId for "other accounts" check
    const otherAuthIds = allAuthIds.filter(id => id !== authId);
    let anyOtherAccountHasIssues = false;

    if (otherAuthIds.length > 0) {
        const [otherUnverifiedCount, otherPendingRequestCount] = await Promise.all([
            prisma.member.count({
                where: {
                    authId: { in: otherAuthIds },
                    verified: false,
                },
            }),
            prisma.requestDetails.count({
                where: {
                    authId: { in: otherAuthIds },
                },
            }),
        ]);
        anyOtherAccountHasIssues = (otherUnverifiedCount + otherPendingRequestCount) > 0;
    }

    const [unverifiedCount, pendingRequestCount, familyTree] = await Promise.all([
        prisma.member.count({
            where: {
                authId: authId,
                verified: false,
            },
        }),
        prisma.requestDetails.count({
            where: {
                authId: authId,
            },
        }),
        prisma.familyTree.findUnique({
            where: { authId: authId },
            select: {
                status: true,
                lastBuildStartedAt: true,
                updatedAt: true
            }
        })
    ]);

    let chartStatus = "not_built";
    if (familyTree) {
        chartStatus = familyTree.status;

        // Check for timeout: if status is "building" and more than 5 minutes old
        const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
        if (
            familyTree.status === "building" &&
            familyTree.lastBuildStartedAt &&
            Date.now() - familyTree.lastBuildStartedAt.getTime() > TIMEOUT_MS
        ) {
            chartStatus = "timeout";
        }
    }

    return {
        unverifiedMembers: unverifiedCount,
        pendingRequests: pendingRequestCount,
        chartStatus: chartStatus,
        anyOtherAccountHasIssues: anyOtherAccountHasIssues,
        lastBuildStartedAt: familyTree?.lastBuildStartedAt || null,
        updatedAt: familyTree?.updatedAt || null,
        _version: updatedAt
    };
}

