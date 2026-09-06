import prisma from "@/db/db";

export interface RelationshipGraphMember {
    id: number;
    name: string;
    gender: string;
    fatherId: number | null;
    motherId: number | null;
    partnerId: number | null;
    order: number;
    birthYear: number | null;
}

export interface RelationshipResult {
    label: string;
    description?: string;
}

interface ConsanguineResult extends RelationshipResult {
    distance: number;
}

export async function fetchRelationshipGraph(authId: number): Promise<RelationshipGraphMember[]> {
    return prisma.member.findMany({
        where: { authId },
        select: {
            id: true,
            name: true,
            gender: true,
            fatherId: true,
            motherId: true,
            partnerId: true,
            order: true,
            birthYear: true,
        },
    });
}

interface AncestorInfo {
    distance: number;
    side: 'father' | 'mother' | null;
}

function buildAncestorMap(id: number, membersById: Map<number, RelationshipGraphMember>): Map<number, AncestorInfo> {
    const result = new Map<number, AncestorInfo>();
    const queue: Array<{ id: number; distance: number; side: 'father' | 'mother' | null }> = [
        { id, distance: 0, side: null },
    ];

    while (queue.length > 0) {
        const node = queue.shift()!;
        if (result.has(node.id)) continue;
        result.set(node.id, { distance: node.distance, side: node.side });

        const member = membersById.get(node.id);
        if (!member) continue;

        if (member.fatherId) {
            queue.push({ id: member.fatherId, distance: node.distance + 1, side: node.side ?? 'father' });
        }
        if (member.motherId) {
            queue.push({ id: member.motherId, distance: node.distance + 1, side: node.side ?? 'mother' });
        }
    }

    return result;
}

function ageOrder(a: RelationshipGraphMember, b: RelationshipGraphMember): 'aElder' | 'bElder' | 'unknown' {
    if (a.birthYear != null && b.birthYear != null && a.birthYear !== b.birthYear) {
        return a.birthYear < b.birthYear ? 'aElder' : 'bElder';
    }
    if (a.order != null && b.order != null && a.order !== b.order) {
        return a.order < b.order ? 'aElder' : 'bElder';
    }
    return 'unknown';
}

// Tamil convention addresses a collateral relative by the same title as whichever direct
// ancestor/descendant sits at the same generational distance — a grandfather's brother, his
// brother's son, and his brother's grandson are all "தாத்தா" (2 generations up from ego),
// exactly like an actual grandfather. `offset` is that generational distance: positive means
// `to` sits that many generations above `from`, negative means that many below, 0 is a peer.
function genericFallback(up: number, down: number, toGender: string): RelationshipResult {
    const offset = up - down;

    if (offset >= 4) return { label: 'மூதாதையர்' };
    if (offset === 3) return { label: toGender === 'Male' ? 'கொள்ளுத்தாத்தா' : toGender === 'Female' ? 'கொள்ளுப்பாட்டி' : 'கொள்ளுத்தாத்தா/பாட்டி' };
    if (offset === 2) return { label: toGender === 'Male' ? 'தாத்தா' : toGender === 'Female' ? 'பாட்டி' : 'பாட்டன்/பாட்டி' };
    if (offset === 1) return { label: toGender === 'Male' ? 'பெரியப்பா/சித்தப்பா' : toGender === 'Female' ? 'பெரியம்மா/சித்தி' : 'உறவினர்' };
    if (offset === 0) return { label: toGender === 'Male' ? 'சகோதரன்' : toGender === 'Female' ? 'சகோதரி' : 'உறவினர்' };
    if (offset === -1) return { label: toGender === 'Male' ? 'மருமகன்' : toGender === 'Female' ? 'மருமகள்' : 'உறவினர்' };
    if (offset === -2) return { label: toGender === 'Male' ? 'பேரன்' : toGender === 'Female' ? 'பேத்தி' : 'பேரக்குழந்தை' };
    if (offset === -3) return { label: toGender === 'Male' ? 'கொள்ளுப்பேரன்' : toGender === 'Female' ? 'கொள்ளுப்பேத்தி' : 'கொள்ளுப்பேரக்குழந்தை' };
    return { label: 'வழித்தோன்றல்' };
}

/**
 * Pure blood (consanguine) relationship of `toId` relative to `fromId` — no spouse/in-law
 * links are followed here. Returns null when the two share no common ancestor.
 */
function consanguineRelation(
    fromId: number,
    toId: number,
    membersById: Map<number, RelationshipGraphMember>
): ConsanguineResult | null {
    if (fromId === toId) {
        return { label: 'Same person', distance: 0 };
    }

    const from = membersById.get(fromId);
    const to = membersById.get(toId);
    if (!from || !to) return null;

    const ancestorsFrom = buildAncestorMap(fromId, membersById);
    const ancestorsTo = buildAncestorMap(toId, membersById);

    let bestCommonId: number | null = null;
    let bestTotal = Infinity;
    let bestMax = Infinity;

    for (const [id, infoFrom] of ancestorsFrom) {
        const infoTo = ancestorsTo.get(id);
        if (!infoTo) continue;
        const total = infoFrom.distance + infoTo.distance;
        const max = Math.max(infoFrom.distance, infoTo.distance);
        if (total < bestTotal || (total === bestTotal && max < bestMax)) {
            bestTotal = total;
            bestMax = max;
            bestCommonId = id;
        }
    }

    if (bestCommonId === null) return null;

    const up = ancestorsFrom.get(bestCommonId)!.distance;
    const down = ancestorsTo.get(bestCommonId)!.distance;
    const sideFrom = ancestorsFrom.get(bestCommonId)!.side;
    const distance = up + down;

    // Direct lineal relationships
    if (up === 0 && down === 1) {
        return { label: to.gender === 'Male' ? 'மகன்' : to.gender === 'Female' ? 'மகள்' : 'குழந்தை', distance };
    }
    if (up === 1 && down === 0) {
        return { label: to.gender === 'Male' ? 'தந்தை' : to.gender === 'Female' ? 'தாய்' : 'பெற்றோர்', distance };
    }
    if (up === 0 && down === 2) {
        return { label: to.gender === 'Male' ? 'பேரன்' : to.gender === 'Female' ? 'பேத்தி' : 'பேரக்குழந்தை', distance };
    }
    if (up === 2 && down === 0) {
        const sideNote = sideFrom === 'father' ? ' (paternal side)' : sideFrom === 'mother' ? ' (maternal side)' : '';
        return {
            label: to.gender === 'Male' ? 'தாத்தா' : to.gender === 'Female' ? 'பாட்டி' : 'பாட்டன்/பாட்டி',
            description: sideNote || undefined,
            distance,
        };
    }
    if (up === 0 && down === 3) {
        return { label: to.gender === 'Male' ? 'கொள்ளுப்பேரன்' : to.gender === 'Female' ? 'கொள்ளுப்பேத்தி' : 'கொள்ளுப்பேரக்குழந்தை', distance };
    }
    if (up === 3 && down === 0) {
        return { label: to.gender === 'Male' ? 'கொள்ளுத்தாத்தா' : to.gender === 'Female' ? 'கொள்ளுப்பாட்டி' : 'கொள்ளுத்தாத்தா/பாட்டி', distance };
    }

    // Siblings
    if (up === 1 && down === 1) {
        const order = ageOrder(to, from);
        if (order === 'unknown') {
            return { label: to.gender === 'Male' ? 'சகோதரன்' : to.gender === 'Female' ? 'சகோதரி' : 'உடன்பிறப்பு', distance };
        }
        const toIsElder = order === 'aElder';
        if (to.gender === 'Male') return { label: toIsElder ? 'அண்ணன்' : 'தம்பி', distance };
        if (to.gender === 'Female') return { label: toIsElder ? 'அக்கா' : 'தங்கை', distance };
        return { label: 'உடன்பிறப்பு', distance };
    }

    // Nephew / Niece (from's sibling's child)
    if (up === 1 && down === 2) {
        return {
            label: to.gender === 'Male' ? 'மருமகன்' : to.gender === 'Female' ? 'மருமகள்' : 'உடன்பிறப்பின் குழந்தை',
            description: "(sibling's son/daughter)",
            distance,
        };
    }

    // Uncle / Aunt (from's parent's sibling — and, by the same classificatory rule,
    // any more distant collateral one generation "removed" upward, e.g. a first
    // cousin's child looking at `to`. `from`'s immediate parent on the side that
    // leads to the common ancestor is the sibling-equivalent pivot in both cases,
    // so the father-side/mother-side split still determines மாமா vs பெரியப்பா/சித்தப்பா.)
    if (up - down === 1 && down >= 1) {
        const intermediateId = sideFrom === 'father' ? from.fatherId : sideFrom === 'mother' ? from.motherId : null;
        const intermediate = intermediateId ? membersById.get(intermediateId) : undefined;
        const order = intermediate ? ageOrder(to, intermediate) : 'unknown';

        if (sideFrom === 'father') {
            if (to.gender === 'Male') {
                if (order === 'unknown') return { label: 'தந்தையின் சகோதரர்', distance };
                return { label: order === 'aElder' ? 'பெரியப்பா' : 'சித்தப்பா', distance };
            }
            if (to.gender === 'Female') return { label: 'அத்தை', distance };
        }
        if (sideFrom === 'mother') {
            if (to.gender === 'Male') return { label: 'மாமா', distance };
            if (to.gender === 'Female') {
                if (order === 'unknown') return { label: 'தாயின் சகோதரி', distance };
                return { label: order === 'aElder' ? 'பெரியம்மா' : 'சித்தி', distance };
            }
        }
        return { label: to.gender === 'Male' ? 'சித்தப்பா/மாமா' : 'அத்தை/சித்தி', distance };
    }

    // First cousins
    if (up === 2 && down === 2) {
        return { label: to.gender === 'Male' ? 'சகோதரன்' : to.gender === 'Female' ? 'சகோதரி' : 'உறவினர்', distance };
    }

    return { ...genericFallback(up, down, to.gender), distance };
}

// Given the blood-relation label of X (relative to `from`), what `from` calls X's spouse.
const SPOUSE_OF_LABEL: Record<string, string> = {
    'மகன்': 'மருமகள்', // son's wife
    'மகள்': 'மருமகன்', // daughter's husband
    'அண்ணன்': 'அண்ணி', // elder brother's wife
    'தம்பி': 'தம்பியின் மனைவி', // younger brother's wife
    'அக்கா': 'அக்காவின் கணவர்', // elder sister's husband
    'தங்கை': 'மைத்துனர்', // younger sister's husband
    'சகோதரன்': 'சகோதரனின் மனைவி',
    'சகோதரி': 'மைத்துனர்',
    'மாமா': 'மாமி', // mother's brother's wife
    'அத்தை': 'மாமா', // father's sister's husband
    'பெரியப்பா': 'பெரியம்மா',
    'சித்தப்பா': 'சித்தி',
    'தந்தை': 'சவதி தாய்', // father's other wife (step-mother)
    'தாய்': 'சவதி தந்தை', // mother's other husband (step-father)
};

// Given the blood-relation label of `to` relative to `from`'s partner, what `from` calls `to`.
const MY_SPOUSE_RELATIVE_LABEL: Record<string, string> = {
    'தந்தை': 'மாமனார்', // spouse's father
    'தாய்': 'மாமியார்', // spouse's mother
    'மகன்': 'சவதி மகன்', // spouse's son (step-son)
    'மகள்': 'சவதி மகள்', // spouse's daughter (step-daughter)
    'அண்ணன்': 'மைத்துனன்', // spouse's brother
    'தம்பி': 'மைத்துனன்',
    'சகோதரன்': 'மைத்துனன்',
    'அக்கா': 'நாத்தனார்', // spouse's sister
    'தங்கை': 'நாத்தனார்',
    'சகோதரி': 'நாத்தனார்',
};

// Given the blood-relation label of `toPartner` relative to `fromPartner` (i.e. what
// `from`'s partner calls `to`'s partner as a sibling), what `from` calls `to` — the
// co-sister/co-brother-in-law terms used between people married into the same
// sibling group, which are distinct from both SPOUSE_OF_LABEL (my own sibling's
// spouse) and MY_SPOUSE_RELATIVE_LABEL (my spouse's sibling, unmarried).
const SPOUSE_SIBLING_SPOUSE_LABEL: Record<string, string> = {
    'அண்ணன்': 'அத்திகை', // spouse's elder brother's wife
    'தம்பி': 'கொழுந்தியாள்', // spouse's younger brother's wife
    'சகோதரன்': 'சகோதரனின் மனைவி',
    'அக்கா': 'அக்காவின் கணவர்', // spouse's elder sister's husband
    'தங்கை': 'மைத்துனர்', // spouse's younger sister's husband
    'சகோதரி': 'மைத்துனர்',
};

interface Candidate {
    result: RelationshipResult;
    distance: number;
}

export function computeRelationship(
    fromId: number,
    toId: number,
    members: RelationshipGraphMember[]
): RelationshipResult {
    const membersById = new Map(members.map((m) => [m.id, m]));

    if (fromId === toId) {
        return { label: 'Same person' };
    }

    const from = membersById.get(fromId);
    const to = membersById.get(toId);
    if (!from || !to) {
        return { label: 'Could not determine relationship' };
    }

    if (from.partnerId === toId || to.partnerId === fromId) {
        return { label: to.gender === 'Male' ? 'கணவர்' : to.gender === 'Female' ? 'மனைவி' : 'துணைவர்' };
    }

    const blood = consanguineRelation(fromId, toId, membersById);
    if (blood) {
        const { distance: _distance, ...result } = blood;
        return result;
    }

    // Not blood related directly — look for a relationship through either partner.
    const candidates: Candidate[] = [];

    // `to`'s partner is `from`'s blood relative (e.g. to is from's son's wife)
    if (to.partnerId) {
        const toPartner = membersById.get(to.partnerId);
        if (toPartner) {
            const r = consanguineRelation(fromId, toPartner.id, membersById);
            if (r) {
                const mapped = SPOUSE_OF_LABEL[r.label];
                candidates.push({
                    result: mapped
                        ? { label: mapped }
                        : { label: `${r.label}-இன் துணைவர்`, description: "(relative's spouse)" },
                    distance: r.distance,
                });
            }
        }
    }

    // `to` is `from`'s partner's blood relative (e.g. to is from's spouse's father)
    if (from.partnerId) {
        const fromPartner = membersById.get(from.partnerId);
        if (fromPartner) {
            const r = consanguineRelation(fromPartner.id, toId, membersById);
            if (r) {
                const mapped = MY_SPOUSE_RELATIVE_LABEL[r.label];
                candidates.push({
                    result: mapped
                        ? { label: mapped }
                        : { label: `${r.label} (துணைவர் வழி)`, description: "(spouse's relative)" },
                    distance: r.distance,
                });
            }
        }
    }

    // Both have partners and those two partners are blood related to each other
    // (e.g. `to` is from's partner's sibling's spouse — mom's husband's brother's
    // wife — or two men who each married one of two sisters). `r.label` is what
    // `fromPartner` calls `toPartner` as a blood relative.
    if (from.partnerId && to.partnerId && from.partnerId !== to.partnerId) {
        const fromPartner = membersById.get(from.partnerId);
        const toPartner = membersById.get(to.partnerId);
        if (fromPartner && toPartner) {
            const r = consanguineRelation(fromPartner.id, toPartner.id, membersById);
            if (r) {
                const mapped = SPOUSE_SIBLING_SPOUSE_LABEL[r.label];
                candidates.push({
                    result: mapped
                        ? { label: mapped }
                        : { label: `${r.label} (இரு துணைவர்கள் வழி உறவு)` },
                    distance: r.distance + 2,
                });
            }
        }
    }

    if (candidates.length > 0) {
        candidates.sort((a, b) => a.distance - b.distance);
        return candidates[0].result;
    }

    return {
        label: 'நேரடி உறவு இல்லாதவர்',
        description: 'No common ancestor or marital relationship found between the two selected people',
    };
}
