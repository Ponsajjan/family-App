import prisma from "@/db/db";
import { prioritizeSearchResults } from "./searchUtils";

export async function fetchRelativesData(
    allAuthIds: number[],
    page: number,
    limit: number,
    searchQuery: string,
    filters: {
        occupation?: string;
        education?: string;
        birthPlace?: string;
        country?: string;
        state?: string;
        city?: string;
    } = {}
) {
    const { occupation, education, birthPlace, country, state, city } = filters;
    const baseSkip = (page - 1) * limit;
    const skip = page === 1 ? baseSkip : baseSkip - 1;
    const take = page === 1 ? limit : limit + 1;

    const where: any = {
        authId: { in: allAuthIds },
        ...(searchQuery && { name: { contains: searchQuery, mode: "insensitive" } }),
        ...(occupation && { occupation: { contains: occupation, mode: "insensitive" } }),
        ...(education && { education: { contains: education, mode: "insensitive" } }),
        ...(birthPlace && { birthPlace: { equals: birthPlace, mode: "insensitive" } }),
        ...(country && { country: { equals: country, mode: "insensitive" } }),
        ...(state && { state: { equals: state, mode: "insensitive" } }),
        ...(city && { city: { equals: city, mode: "insensitive" } }),
    };

    const [members, totalCount] = await Promise.all([
        prisma.member.findMany({
            where,
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
        prisma.member.count({ where })
    ]);
    
    // Prioritize results starting with the search query
    prioritizeSearchResults(members, searchQuery, (m) => m.name);

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
