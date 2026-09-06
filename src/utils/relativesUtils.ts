import prisma from "@/db/db";
import { prioritizeSearchResults } from "./searchUtils";

export async function fetchRelativesData(
    allAuthIds: number[],
    page: number,
    limit: number,
    searchQuery: string,
    filters: {
        occupation?: string | string[];
        education?: string | string[];
        birthPlace?: string | string[];
        country?: string;
        state?: string;
        district?: string;
        city?: string;
        birthYearStart?: number | null;
        birthYearEnd?: number | null;
    } = {}
) {
    const { occupation, education, birthPlace, country, state, district, city, birthYearStart, birthYearEnd } = filters;
    const baseSkip = (page - 1) * limit;
    const skip = page === 1 ? baseSkip : baseSkip - 1;
    const take = page === 1 ? limit : limit + 1;

    const where: any = {
        authId: { in: allAuthIds },
        ...(searchQuery && { name: { contains: searchQuery, mode: "insensitive" } }),
        ...(country && { country: { equals: country, mode: "insensitive" } }),
        ...(state && { state: { equals: state, mode: "insensitive" } }),
        ...(district && { district: { equals: district, mode: "insensitive" } }),
        ...(city && { city: { equals: city, mode: "insensitive" } }),
    };

    if (birthYearStart !== undefined && birthYearStart !== null || birthYearEnd !== undefined && birthYearEnd !== null) {
        where.birthYear = {};
        if (birthYearStart !== undefined && birthYearStart !== null) where.birthYear.gte = birthYearStart;
        if (birthYearEnd !== undefined && birthYearEnd !== null) where.birthYear.lte = birthYearEnd;
    }

    const andConditions: any[] = [];
    
    if (occupation) {
        if (Array.isArray(occupation) && occupation.length > 0) {
            andConditions.push({ OR: occupation.map(o => ({ occupation: { equals: o, mode: "insensitive" } })) });
        } else if (typeof occupation === 'string') {
            andConditions.push({ occupation: { equals: occupation, mode: "insensitive" } });
        }
    }

    if (education) {
        if (Array.isArray(education) && education.length > 0) {
            andConditions.push({ OR: education.map(e => ({ education: { equals: e, mode: "insensitive" } })) });
        } else if (typeof education === 'string') {
            andConditions.push({ education: { equals: education, mode: "insensitive" } });
        }
    }

    if (birthPlace) {
        if (Array.isArray(birthPlace) && birthPlace.length > 0) {
            andConditions.push({ OR: birthPlace.map(b => ({ birthPlace: { equals: b, mode: "insensitive" } })) });
        } else if (typeof birthPlace === 'string') {
            andConditions.push({ birthPlace: { equals: birthPlace, mode: "insensitive" } });
        }
    }

    if (andConditions.length > 0) {
        where.AND = andConditions;
    }

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
        // Search results are reordered into "starts with" vs. "contains" priority groups (see
        // prioritizeSearchResults), so the same letter can recur non-contiguously — the header
        // id is scoped to the member that follows it so repeated letters still get distinct
        // React keys on the client.
        if ((page === 1 && index === 0) || (firstLetter !== previousFirstLetter)) {
            groupedData.push({
                id: `${firstLetter}-${member.id}`,
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
        totalCount,
    };
}
