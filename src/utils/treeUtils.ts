import prisma from "@/db/db";

export async function fetchFamilyTreeData(memberId: number[]): Promise<any[]> {
    try {
        if (!memberId || memberId.length === 0) return [];

        let members = [];
        try {
            if (!prisma?.member?.findMany) {
                throw new Error("Prisma is not initialized or 'findMany' method is unavailable.");
            }

            // Fetch members with their relationships and order field
            members = await prisma.member.findMany({
                where: { id: { in: memberId }, verified: true },
                include: {
                    fatherOf: { select: { id: true, name: true, gender: true, order: true } },
                    motherOf: { select: { id: true, name: true, gender: true, order: true } },
                    partner: { select: { id: true, name: true, gender: true } },
                }
            });
        } catch (error) {
            console.error("Error fetching members:", error);
            throw new Error("Failed to fetch members data.");
        }

        // Sort members by their order value
        members.sort((a, b) => a.order - b.order);

        return await Promise.all(
            members.map(async (member) => {
                try {
                    // Combine fatherOf and motherOf children and deduplicate by ID
                    const childIds = [
                        ...member.fatherOf.map((child) => child.id),
                        ...member.motherOf.map((child) => child.id),
                    ];

                    // Fetch the next generation recursively
                    const nextGen = await fetchFamilyTreeData(childIds);

                    // Sort nextGen based on the order value of each child
                    nextGen.sort((a, b) => a.order - b.order);

                    // Current generation data
                    const currentGen = [
                        { name: member.name, gender: member.gender },
                        ...(member.partner ? [{ name: member.partner.name, gender: member.partner.gender }] : []),
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
    } catch (error) {
        console.error("Error fetching family tree:", error);
        return [];
    }
}
