import prisma from "@/db/db";

export async function fetchRelativesData(allAuthIds: number[], page: number, limit: number, searchQuery: string) {
    const baseSkip = (page - 1) * limit;
    const skip = page === 1 ? baseSkip : baseSkip - 1;
    const take = page === 1 ? limit : limit + 1;

    const [members, totalCount] = await Promise.all([
        prisma.member.findMany({
            where: {
                authId: { in: allAuthIds },
                ...(searchQuery && { name: { contains: searchQuery, mode: "insensitive" } }),
            },
            select: {
                id: true,
                name: true,
                gender: true,
                phoneNumber: true,
                father: { select: { name: true } },
                mother: { select: { name: true } },
                partner: { select: { name: true } },
            },
            orderBy: { name: "asc" },
            skip,
            take,
        }),
        prisma.member.count({
            where: {
                authId: { in: allAuthIds },
                ...(searchQuery && { name: { contains: searchQuery, mode: "insensitive" } }),
            },
        })
    ]);

    const groupedData: any[] = [];
    let previousFirstLetter = '';
    
    // For pages after the first, we need to check against the previous item
    if (page > 1 && members.length > 0) {
        const previousItem = members.shift();
        if (previousItem) {
            previousFirstLetter = previousItem.name.charAt(0).toUpperCase();
        }
    }

    members.forEach((member, index) => {
        const firstLetter = member.name.charAt(0).toUpperCase();
        
        // Add letter header if:
        // - It's the first item on the first page, or
        // - The letter changed from the previous member
        if ((page === 1 && index === 0) || (firstLetter !== previousFirstLetter)) {
            groupedData.push({
                id: firstLetter,
                name: firstLetter,
                gender: "Letter",
                phoneNumber: null,
                father: null,
                mother: null,
                partner: null,
            });
            previousFirstLetter = firstLetter;
        }
        groupedData.push(member);
    });

    return {
        data: groupedData,
        totalCount: totalCount + 1,
    };
}
