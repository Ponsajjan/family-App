import prisma from "@/db/db";
import { prioritizeSearchResults } from "./searchUtils";

interface Member {
    id: number;
    name: string;
    gender: string;
    verified?: boolean | null;
    birthYear?: number | null;
    father?: { name: string } | null;
    mother?: { name: string } | null;
    partner?: { name: string } | null;
}

interface LetterHeader {
    id: string;
    name: string;
    gender: "Letter";
    father: null;
    mother: null;
    partner: null;
}

export type MemberListForType = "selectMember" | "selectPartner" | "selectChildren" | "editRelationship" | "editMember";

export const MEMBER_LIST_FOR_TYPES: MemberListForType[] = [
    "selectMember",
    "selectPartner",
    "selectChildren",
    "editRelationship",
    "editMember",
];

export async function fetchMemberListData(
    authId: number,
    mainMemberId: number,
    options: {
        forType: MemberListForType;
        gender: string | null;
        descendant: string | null;
        showCousin: boolean;
        excludeId: number[];
        searchQuery: string | undefined;
        page: number;
        limit: number;
        lastLetterId?: string;
    }
): Promise<{ data: Array<Member | LetterHeader>; totalCount: number }> {
    const { forType, gender, descendant, showCousin, excludeId, searchQuery, page, limit, lastLetterId = "" } = options;

    // Calculate skip with one extra item for letter detection
    const baseSkip = (page - 1) * limit;
    const skip = page === 1 ? baseSkip : baseSkip - 1;
    const take = page === 1 ? limit : limit + 1;

    let memberList: Member[] = [];
    const groupedData: Array<Member | LetterHeader> = [];

    const baseWhere: any = {
        ...(searchQuery && {
            name: {
                contains: searchQuery,
                mode: "insensitive",
            },
        }),
        authId: authId,
    };

    switch (forType) {
        case "selectMember":
            memberList = await prisma.member.findMany({
                where: {
                    ...baseWhere,
                },
                select: {
                    id: true,
                    name: true,
                    gender: true,
                    father: { select: { name: true } },
                    mother: { select: { name: true } },
                    partner: { select: { name: true } },
                },
                orderBy: { name: "asc" },
                skip,
                take,
            });
            break;

        case "selectPartner":
            memberList = await prisma.member.findMany({
                where: {
                    ...baseWhere,
                    gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
                    partnerId: null,
                    id: { notIn: excludeId },
                    descendant: descendant === 'true' ? showCousin : true,
                },
                select: {
                    id: true,
                    name: true,
                    gender: true,
                    birthYear: true,
                    father: { select: { name: true } },
                    mother: { select: { name: true } },
                },
                orderBy: { name: "asc" },
                skip,
                take,
            });
            break;

        case "selectChildren":
            memberList = await prisma.member.findMany({
                where: {
                    ...baseWhere,
                    id: { notIn: [...excludeId, mainMemberId] },
                    fatherId: null,
                    motherId: null,
                    descendant: true,
                },
                select: {
                    id: true,
                    name: true,
                    gender: true,
                    verified: true,
                    birthYear: true,
                    partner: { select: { name: true } },
                },
                orderBy: { name: "asc" },
                skip,
                take,
            });
            break;

        case "editRelationship":
            memberList = await prisma.member.findMany({
                where: {
                    ...baseWhere,
                    OR: [
                        { fatherOf: { some: {} } },
                        { motherOf: { some: {} } },
                        { partnerId: { not: null } },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    gender: true,
                    birthYear: true,
                    father: { select: { name: true } },
                    mother: { select: { name: true } },
                    partner: { select: { name: true } },
                },
                orderBy: { name: "asc" },
                skip,
                take,
            });
            break;

        case "editMember":
            memberList = await prisma.member.findMany({
                where: {
                    ...baseWhere,
                },
                select: {
                    id: true,
                    name: true,
                    gender: true,
                    father: { select: { name: true } },
                    mother: { select: { name: true } },
                    partner: { select: { name: true } },
                },
                orderBy: { name: "asc" },
                skip,
                take,
            });
            break;
    }

    // Total count with the same filters
    const countWhere: any = {
        ...baseWhere,
        ...(forType === "selectPartner" && {
            gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
            partnerId: null,
            id: { notIn: excludeId },
            descendant: descendant === 'true' ? showCousin : undefined,
        }),
        ...(forType === "selectChildren" && {
            id: { notIn: [...excludeId, mainMemberId] },
            fatherId: null,
            motherId: null,
            descendant: true,
        }),
        ...(forType === "editRelationship" && {
            OR: [
                { fatherOf: { some: {} } },
                { motherOf: { some: {} } },
                { partnerId: { not: null } },
            ],
        }),
    };

    const totalCount = await prisma.member.count({ where: countWhere });

    // Prioritize results starting with the search query
    prioritizeSearchResults(memberList, searchQuery, (m) => m.name);

    // Process the data to add letter headers
    let previousFirstLetter = lastLetterId;

    // For pages after the first, we need to check against the previous item
    if (page > 1 && memberList.length > 0) {
        const previousItem = memberList.shift(); // Remove the extra item
        previousFirstLetter = previousItem!.name.charAt(0).toUpperCase();
    }

    memberList.forEach((member) => {
        const firstLetter = member.name.charAt(0).toUpperCase();

        // Add letter header if the letter changed. Search results are reordered into
        // "starts with" vs. "contains" priority groups (see prioritizeSearchResults), so the
        // same letter can recur non-contiguously — the header id is scoped to the member that
        // follows it so repeated letters still get distinct React keys on the client.
        if (firstLetter !== previousFirstLetter) {
            groupedData.push({
                id: `${firstLetter}-${member.id}`,
                name: firstLetter,
                gender: "Letter",
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
