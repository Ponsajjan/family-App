import prisma from "@/db/db";

// Type for circular relationship conflicts
export type CircularConflict = {
    parentMemberId: number;
    parentMemberName: string;
    childMemberId: number;
    childMemberName: string;
    conflictType: 'circular_relationship';
    message: string;
};

export type FamilyTreeResult = {
    tree: any[];
    conflicts: CircularConflict[];
};

export async function fetchFamilyTreeData(
    memberId: number[],
    visitedIds: Set<number> = new Set(),
    conflicts: CircularConflict[] = [],
    parentContext?: { id: number, name: string },
    visitedMembers: Map<number, string> = new Map()
): Promise<FamilyTreeResult> {
    try {
        if (!memberId || memberId.length === 0) return { tree: [], conflicts };

        // Detect circular relationships - track which IDs are already visited
        const circularIds = memberId.filter(id => visitedIds.has(id));

        // Record conflicts for circular relationships
        if (circularIds.length > 0 && parentContext) {
            circularIds.forEach(childId => {
                const childName = visitedMembers.get(childId) || `Unknown (ID: ${childId})`;
                conflicts.push({
                    parentMemberId: parentContext.id,
                    parentMemberName: parentContext.name,
                    childMemberId: childId,
                    childMemberName: childName,
                    conflictType: 'circular_relationship',
                    message: `Circular relationship detected: Member "${parentContext.name}" (ID: ${parentContext.id}) has child "${childName}" (ID: ${childId}) that creates a cycle in the family tree.`
                });
            });
        }

        // Filter out already visited IDs to prevent infinite recursion
        const newMemberIds = memberId.filter(id => !visitedIds.has(id));
        if (newMemberIds.length === 0) return { tree: [], conflicts };

        // Add new IDs to visited set (names will be added after fetch)
        newMemberIds.forEach(id => visitedIds.add(id));

        let members = [];
        try {
            if (!prisma?.member?.findMany) {
                throw new Error("Prisma is not initialized or 'findMany' method is unavailable.");
            }

            // Fetch members with their relationships and order field
            members = await prisma.member.findMany({
                where: { id: { in: newMemberIds }, verified: true },
                include: {
                    fatherOf: {
                        where: { verified: true },
                        select: { id: true, name: true, gender: true, order: true }
                    },
                    motherOf: {
                        where: { verified: true },
                        select: { id: true, name: true, gender: true, order: true }
                    },
                    partner: {
                        where: { verified: true },
                        select: { id: true, name: true, gender: true }
                    },
                }
            });
        } catch (error) {
            console.error("Error fetching members:", error);
            throw new Error("Failed to fetch members data.");
        }

        // Sort members by their order value
        // members.sort((a, b) => a.order - b.order);
        members.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // Add member names to visitedMembers map for conflict reporting
        members.forEach(member => {
            visitedMembers.set(member.id, member.name);
        });

        const treeData = await Promise.all(
            members.map(async (member) => {
                try {
                    // Combine fatherOf and motherOf children and deduplicate by ID
                    const childIds = [
                        ...member.fatherOf.map((child) => child.id),
                        ...member.motherOf.map((child) => child.id),
                    ];

                    // Fetch the next generation recursively, passing visitedIds, conflicts, and visitedMembers to prevent cycles
                    const result = await fetchFamilyTreeData(
                        childIds,
                        visitedIds,
                        conflicts,
                        { id: member.id, name: member.name },
                        visitedMembers
                    );
                    const nextGen = result.tree;

                    // Current generation data
                    const currentGen = [
                        { id: member.id, name: member.name, gender: member.gender },
                        ...(member.partner ? [{ id: member.partner.id, name: member.partner.name, gender: member.partner.gender }] : []),
                    ];

                    return {
                        gen: currentGen,
                        next_gen: nextGen,
                    };
                } catch (innerError) {
                    console.error(`Error processing member ${member.id}:`, innerError);
                    return null;
                }
            })
        );

        return { tree: treeData, conflicts };
    } catch (error) {
        console.error("Error fetching family tree:", error);
        return { tree: [], conflicts };
    }
}

export async function fetchPrebuiltTree(authId: number) {
    const familyTree = await prisma.familyTree.findUnique({
        where: { authId },
        select: { data: true }
    });
    return familyTree?.data || null;
}
