import prisma from "@/db/db";

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
