import prisma from "@/db/db";

/**
 * Resolves all numeric Auth IDs that a user has access to,
 * taking into account any switched accounts stored in the selectedAuthId cookie.
 *
 * @param authId          - The numeric auth ID of the currently logged-in user (from JWT).
 * @param selectedAuthId  - Raw cookie value of "selectedAuthId" (a JSON-stringified string[]).
 * @returns               - A deduplicated array of numeric Auth `id`s to use in DB queries.
 */
export async function getAllAuthIds(authId: number, selectedAuthId: string): Promise<number[]> {
    let loginAuthIds: string[] = [];
    try {
        const parsed = JSON.parse(selectedAuthId);
        if (Array.isArray(parsed)) {
            loginAuthIds = parsed;
        }
    } catch (e) {
        console.error("Error parsing selectedAuthId cookie", e);
    }

    if (loginAuthIds.length > 0) {
        try {
            const authRecords = await prisma.auth.findMany({
                where: {
                    OR: [
                        { memberAuthId: { in: loginAuthIds } },
                        { moderatorAuthId: { in: loginAuthIds } }
                    ]
                },
                select: { id: true }
            });
            const switchedIds = authRecords.map(record => record.id);
            return [...new Set(switchedIds)];
        } catch (e) {
            return [authId];
        }
    }

    return [authId];
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
