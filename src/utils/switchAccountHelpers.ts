import prisma from "@/db/db";

/**
 * Resolves all numeric Auth IDs that a user has access to,
 * along with their respective update timestamps.
 *
 * @param authId          - The numeric auth ID of the currently logged-in user (from JWT).
 * @param selectedAuthId  - Raw cookie value of "selectedAuthId" (a JSON-stringified string[]).
 * @returns               - Object containing IDs, the latest timestamp, and a map of all timestamps.
 */
export async function getAllAuthIds(authId: number, userType: string, selectedAuthId: string): Promise<{
    allAuthIds: number[];
    updatedAt: Record<number, number>
}> {
    let loginAuthIds: string[] = [];
    try {
        const parsed = JSON.parse(selectedAuthId);
        if (Array.isArray(parsed)) {
            loginAuthIds = parsed;
        }
    } catch (e) {
        console.error("Error parsing selectedAuthId cookie", e);
    }

    const updatedAt: Record<any, number> = {};

    if (loginAuthIds.length > 0) {
        try {
            const authRecords = await prisma.auth.findMany({
                where: {
                    OR: [
                        { memberAuthId: { in: loginAuthIds } },
                        { moderatorAuthId: { in: loginAuthIds } }
                    ]
                },
                select: {
                    id: true,
                    memberAuthId: true,
                    moderatorAuthId: true,
                    updatedAt: true
                }
            });

            const switchedIds = authRecords.map(record => {
                const ts = record.updatedAt.getTime();
                if (record.memberAuthId && selectedAuthId.includes(record.memberAuthId)) {
                    updatedAt[record.memberAuthId] = ts;
                }
                if (record.moderatorAuthId && selectedAuthId.includes(record.moderatorAuthId)) {
                    updatedAt[record.moderatorAuthId] = ts;
                }
                return record.id;
            });

            return {
                allAuthIds: [...new Set(switchedIds)],
                updatedAt
            };
        } catch (e) {
            console.error("Error fetching auth records in getAllAuthIds:", e);
        }
    }

    // Fallback: Fetch the single record for the primary authId to get its updatedAt
    const primaryRecord = await prisma.auth.findUnique({
        where: { id: authId },
        select: {
            updatedAt: true,
            memberAuthId: true,
            moderatorAuthId: true
        }
    });

    const primaryTs = primaryRecord?.updatedAt.getTime() || 0;
    if (userType === 'Member' && primaryRecord?.memberAuthId) {
        updatedAt[primaryRecord.memberAuthId] = primaryTs;
    }
    if (userType === 'Moderator' && primaryRecord?.moderatorAuthId) {
        updatedAt[primaryRecord.moderatorAuthId] = primaryTs;
    }

    return {
        allAuthIds: [authId],
        updatedAt
    };
}


export async function getSelectedMembersData(mainMemberId: number, loginAuthIds: string[]) {
    let switchAccounts: { authId: string; name: string | null }[] = [];
    let member: { name: string | null } | null = null;

    if (loginAuthIds.length > 0) {
        try {
            const authRecords = await prisma.auth.findMany({
                where: {
                    OR: [
                        { memberAuthId: { in: loginAuthIds } },
                        { moderatorAuthId: { in: loginAuthIds } }
                    ]
                },
                select: {
                    memberAuthId: true,
                    moderatorAuthId: true,
                    mainMemberId: true,
                }
            });

            const mainMemberIds = authRecords
                .map(a => a.mainMemberId)
                .filter((id): id is number => id !== null);

            const members = await prisma.member.findMany({
                where: { id: { in: mainMemberIds } },
                select: { id: true, name: true }
            });

            const memberMap = new Map(members.map(m => [m.id, m.name]));

            switchAccounts = [];
            for (const auth of authRecords) {
                const name = auth.mainMemberId ? memberMap.get(auth.mainMemberId) : null;
                if (auth.memberAuthId && loginAuthIds.includes(auth.memberAuthId)) {
                    switchAccounts.push({ authId: auth.memberAuthId, name: name || null });
                }
                if (auth.moderatorAuthId && loginAuthIds.includes(auth.moderatorAuthId)) {
                    switchAccounts.push({ authId: auth.moderatorAuthId, name: name || null });
                }
            }

            if (mainMemberId) {
                member = await prisma.member.findUnique({
                    where: { id: mainMemberId },
                    select: { name: true }
                });
            }
        } catch (e) {
            console.error("Error in getSelectedMembersData:", e);
            switchAccounts = [];
        }
    }

    return {
        member,
        switchAccounts,
    };
}
