import { prioritizeSearchResults } from "./searchUtils";

export interface FormattedAuthEntry {
    id: number;
    mainMemberId: number | null;
    mainMemberName: string;
    memberPassword: string;
    moderatorPassword: string;
    moderators: {
        id: number;
        name: string;
        contactNumber: string;
    }[];
}

/**
 * Formats raw Auth and Member data into a structured response for the Admin dashboard.
 */
export function formatAdminAuthEntries(
    authEntries: any[],
    mainMemberMap: Map<number, { name: string }>,
    searchTerm?: string
): FormattedAuthEntry[] {
    const formatted: FormattedAuthEntry[] = authEntries.map((auth) => {
        const mainMember = auth.mainMemberId ? mainMemberMap.get(auth.mainMemberId) : null;

        return {
            id: auth.id,
            mainMemberId: auth.mainMemberId,
            mainMemberName: mainMember?.name || 'Unknown',
            memberPassword: auth.password,
            moderatorPassword: auth.moderatorPassword,
            moderators: auth.moderatorList.map((moderator: any) => ({
                id: moderator.id,
                name: moderator.moderatorName,
                contactNumber: moderator.moderatorContact,
            })),
        };
    });

    if (searchTerm) {
        return prioritizeSearchResults(formatted, searchTerm, (item) => item.mainMemberName);
    }

    return formatted;
}
