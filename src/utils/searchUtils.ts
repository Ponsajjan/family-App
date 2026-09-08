import prisma from "@/db/db";

/**
 * Prioritizes search results that start with the query string.
 * @param results The array of items to sort
 * @param searchQuery The search query
 * @param getName A function to extract the name/string to compare from an item
 */
export function prioritizeSearchResults<T>(
    results: T[],
    searchQuery: string | undefined | null,
    getName: (item: T) => string
): T[] {
    if (!searchQuery || !searchQuery.trim()) return results;

    const query = searchQuery.toLowerCase().trim();

    return results.sort((a, b) => {
        const aName = getName(a).toLowerCase();
        const bName = getName(b).toLowerCase();

        const aStarts = aName.startsWith(query);
        const bStarts = bName.startsWith(query);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Maintain alphabetical order for items within the same priority group
        return aName.localeCompare(bName);
    });
}

/**
 * Fetches one page of `Member` rows, prioritizing names that start with
 * `searchQuery` ahead of names that merely contain it. The two groups are
 * paginated at the DB level, across the boundary between them, so a page can
 * never come back missing "starts with" matches just because
 * alphabetically/chronologically-earlier "contains" matches filled up the
 * page first — which is what let matches on common letters (e.g. "T") get
 * buried or dropped entirely when the priority reorder was only ever applied
 * after pagination, to whatever slice happened to land on that page.
 *
 * `where` must not itself constrain `name` — this function applies the search
 * filter (when `searchQuery` is set) to build the two priority groups.
 */
export async function fetchPrioritizedMembers<T = any>(
    where: any,
    select: any,
    orderBy: any,
    searchQuery: string | undefined,
    skip: number,
    take: number
): Promise<T[]> {
    if (!searchQuery) {
        const result = await prisma.member.findMany({ where, select, orderBy, skip, take });
        return result as unknown as T[];
    }

    const startsWhere = { ...where, name: { startsWith: searchQuery, mode: "insensitive" } };
    const containsOnlyWhere = {
        ...where,
        name: { contains: searchQuery, mode: "insensitive" },
        NOT: { name: { startsWith: searchQuery, mode: "insensitive" } },
    };

    const startsCount = await prisma.member.count({ where: startsWhere });

    if (skip < startsCount) {
        const firstPart = await prisma.member.findMany({ where: startsWhere, select, orderBy, skip, take }) as unknown as T[];

        const remaining = take - firstPart.length;
        const secondPart = remaining > 0
            ? (await prisma.member.findMany({ where: containsOnlyWhere, select, orderBy, skip: 0, take: remaining })) as unknown as T[]
            : [];

        return [...firstPart, ...secondPart];
    }

    const result = await prisma.member.findMany({ where: containsOnlyWhere, select, orderBy, skip: skip - startsCount, take });
    return result as unknown as T[];
}
