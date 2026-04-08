import prisma from "@/db/db";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

export async function getModeratorCounts(authId: number, userType: string, selectedAuthIdsCookie: string) {
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

    const [unverifiedCount, pendingRequestCount] = await Promise.all([
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
    ]);

    return {
        unverifiedMembers: unverifiedCount,
        pendingRequests: pendingRequestCount,
        anyOtherAccountHasIssues: anyOtherAccountHasIssues,
        updatedAt: updatedAt
    };
}
