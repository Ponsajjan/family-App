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
