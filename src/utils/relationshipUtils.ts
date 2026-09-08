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
    birthMonth: number | null;
    birthDate: number | null;
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
            birthMonth: true,
            birthDate: true,
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
    // Compare the birth date coarsest component first; a component that is missing on
    // either side, or equal on both, falls through to the next one. The day is only
    // meaningful once the month matches, so it is nested inside that check.
    if (a.birthYear != null && b.birthYear != null) {
        if (a.birthYear !== b.birthYear) return a.birthYear < b.birthYear ? 'aElder' : 'bElder';
        if (a.birthMonth != null && b.birthMonth != null) {
            if (a.birthMonth !== b.birthMonth) return a.birthMonth < b.birthMonth ? 'aElder' : 'bElder';
            if (a.birthDate != null && b.birthDate != null && a.birthDate !== b.birthDate) {
                return a.birthDate < b.birthDate ? 'aElder' : 'bElder';
            }
        }
    }
    // `order` is a birth-order position within one set of parents, so it only ranks
    // full siblings. Across half-siblings or any other pair it means nothing.
    const fullSiblings =
        a.fatherId != null && a.motherId != null &&
        a.fatherId === b.fatherId && a.motherId === b.motherId;
    if (fullSiblings && a.order != null && b.order != null && a.order !== b.order) {
        return a.order < b.order ? 'aElder' : 'bElder';
    }
    return 'unknown';
}

// Which of `member`'s two parents descends from the shared ancestor `commonId` — i.e.
// the parent through whom `member` is connected to the other side of the relationship.
function linkingParent(
    member: RelationshipGraphMember,
    commonId: number,
    membersById: Map<number, RelationshipGraphMember>
): RelationshipGraphMember | undefined {
    for (const parentId of [member.fatherId, member.motherId]) {
        const parent = parentId ? membersById.get(parentId) : undefined;
        if (parent && (parent.fatherId === commonId || parent.motherId === commonId)) return parent;
    }
    return undefined;
}

// Sibling terms for `to` as seen by `from`, ranked by age where it is known. Also used
// for parallel cousins, who are addressed as siblings.
function siblingLabel(to: RelationshipGraphMember, from: RelationshipGraphMember): string {
    const order = ageOrder(to, from);
    if (order === 'unknown') {
        return to.gender === 'Male' ? 'சகோதரன்' : to.gender === 'Female' ? 'சகோதரி' : 'உடன்பிறப்பு';
    }
    const toIsElder = order === 'aElder';
    if (to.gender === 'Male') return toIsElder ? 'அண்ணன்' : 'தம்பி';
    if (to.gender === 'Female') return toIsElder ? 'அக்கா' : 'தங்கை';
    return 'உடன்பிறப்பு';
}

// Distant relatives use the same title as a direct ancestor/descendant at the same
// generation gap (e.g. a grandfather's brother is also "தாத்தா"). `offset` is that gap:
// positive is generations above `from`; negative is below; 0 is the same generation.
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
 * Blood relationship of `toId` relative to `fromId`. No marriage links.
 * Returns null if they share no common ancestor.
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
        return { label: siblingLabel(to, from), distance };
    }

    // Nephew / Niece — from's sibling's child. 'மருமகன்/மருமகள்' also mean
    // son-/daughter-in-law, so spell out which sibling the child belongs to.
    if (up === 1 && down === 2) {
        const sibling = linkingParent(to, bestCommonId, membersById);
        const siblingTerm = sibling?.gender === 'Male' ? 'சகோதரரின்' : sibling?.gender === 'Female' ? 'சகோதரியின்' : 'உடன்பிறப்பின்';
        const childTerm = to.gender === 'Male' ? 'மகன்' : to.gender === 'Female' ? 'மகள்' : 'குழந்தை';
        return {
            label: to.gender === 'Male' ? 'மருமகன்' : to.gender === 'Female' ? 'மருமகள்' : 'உடன்பிறப்பின் குழந்தை',
            description: `${siblingTerm} ${childTerm}`,
            distance,
        };
    }

    // Uncle / Aunt — from's parent's sibling (or an equivalent relative one
    // generation up). Father's side vs. mother's side decides மாமா vs பெரியப்பா/சித்தப்பா.
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

    // First cousins. Dravidian kinship splits them by the sexes of the two siblings
    // that link the cousins: same sex (father's brother's or mother's sister's child)
    // makes them parallel cousins, addressed exactly as siblings; opposite sex
    // (father's sister's or mother's brother's child) makes them cross cousins, who are
    // marriageable and take the மச்சான்/மைத்துனி terms instead.
    if (up === 2 && down === 2) {
        const fromSide = linkingParent(from, bestCommonId, membersById)?.gender;
        const toSide = linkingParent(to, bestCommonId, membersById)?.gender;
        const sexesKnown =
            (fromSide === 'Male' || fromSide === 'Female') && (toSide === 'Male' || toSide === 'Female');

        if (sexesKnown && fromSide !== toSide) {
            return {
                label: to.gender === 'Male' ? 'மச்சான்' : to.gender === 'Female' ? 'மைத்துனி' : 'முறை உறவினர்',
                description: fromSide === 'Male' ? 'தந்தையின் சகோதரி வழி' : 'தாயின் சகோதரர் வழி',
                distance,
            };
        }
        // Parallel cousins, and any pair whose linking siblings' sexes are unknown.
        return { label: siblingLabel(to, from), distance };
    }

    return { ...genericFallback(up, down, to.gender), distance };
}

// What `from` calls the spouse of a blood relative X, given X's label.
const SPOUSE_OF_LABEL: Record<string, string> = {
    'மகன்': 'மருமகள்', // son's wife
    'மகள்': 'மருமகன்', // daughter's husband
    'அண்ணன்': 'அண்ணி', // elder brother's wife
    'தம்பி': 'கொழுந்தியாள்', // younger brother's wife
    'அக்கா': 'அத்தான்', // elder sister's husband
    'தங்கை': 'மச்சான்', // younger sister's husband
    'சகோதரன்': 'சகோதரனின் மனைவி',
    'சகோதரி': 'அத்தான்/மச்சான்', // sister's husband (age unknown)
    'மாமா': 'மாமி', // mother's brother's wife
    'அத்தை': 'மாமா', // father's sister's husband
    'பெரியப்பா': 'பெரியம்மா',
    'சித்தப்பா': 'சித்தி',
    'பெரியம்மா': 'பெரியப்பா', // mother's elder sister's husband
    'சித்தி': 'சித்தப்பா', // mother's younger sister's husband
    'தந்தை': 'மாற்றாந்தாய்', // father's other wife (step-mother)
    'தாய்': 'மாற்றாந்தந்தை', // mother's other husband (step-father)
};

// Given the blood-relation label of `to` relative to `from`'s partner, what `from` calls `to`.
// Sibling-in-law terms differ depending on `from`'s own gender — a husband's terms for his
// wife's siblings (மைத்துனர்/கொழுந்தியாள்) are not the same words a wife uses for her husband's
// siblings (கொழுந்தன்/கொழுந்தியாள்) — so these are split into two tables below. The
// non-sibling entries (spouse's parents/children) are gender-symmetric and shared by both.
const MY_SPOUSE_RELATIVE_LABEL_SHARED: Record<string, string> = {
    'தந்தை': 'மாமனார்', // spouse's father
    'தாய்': 'மாமியார்', // spouse's mother
    'மகன்': 'சவதி மகன்', // spouse's son (step-son)
    'மகள்': 'சவதி மகள்', // spouse's daughter (step-daughter)
};

// `from` is the husband — `to` is his wife's sibling.
const MY_SPOUSE_RELATIVE_LABEL_MALE: Record<string, string> = {
    ...MY_SPOUSE_RELATIVE_LABEL_SHARED,
    'அண்ணன்': 'மைத்துனர்/மச்சான்', // wife's elder brother
    'தம்பி': 'கொழுந்தன்/மச்சான்', // wife's younger brother
    'சகோதரன்': 'மைத்துனன்',
    'அக்கா': 'மைனி', // wife's elder sister
    'தங்கை': 'கொழுந்தியாள்', // wife's younger sister
    'சகோதரி': 'கொழுந்தியாள்',
};

// `from` is the wife — `to` is her husband's sibling.
const MY_SPOUSE_RELATIVE_LABEL_FEMALE: Record<string, string> = {
    ...MY_SPOUSE_RELATIVE_LABEL_SHARED,
    'அண்ணன்': 'மைத்துனர்', // husband's elder brother
    'தம்பி': 'கொழுந்தன்', // husband's younger brother
    'சகோதரன்': 'மைத்துனர்',
    'அக்கா': 'நாத்தனார்', // husband's elder sister
    'தங்கை': 'கொழுந்தியாள்', // husband's younger sister
    'சகோதரி': 'நாத்தனார்',
};

// Given the blood-relation label of `toPartner` relative to `fromPartner` (i.e. what
// `from`'s partner calls `to`'s partner as a sibling), what `from` calls `to` — the
// co-sister/co-brother-in-law terms used between people married into the same
// sibling group, which are distinct from both SPOUSE_OF_LABEL (my own sibling's
// spouse) and MY_SPOUSE_RELATIVE_LABEL_MALE/FEMALE (my spouse's sibling, unmarried).
// Like those, these terms depend on `from`'s own gender, so they're split in two.

// `from` is the husband — `to` is his wife's sibling's spouse.
const SPOUSE_SIBLING_SPOUSE_LABEL_MALE: Record<string, string> = {
    'அண்ணன்': 'அண்ணி', // wife's elder brother's wife
    'தம்பி': 'தங்கை', // wife's younger brother's wife
    'சகோதரன்': 'அண்ணி', // wife's brother's wife (age unknown)
    'அக்கா': 'சகலை', // wife's elder sister's husband
    'தங்கை': 'சகலை', // wife's younger sister's husband
    'சகோதரி': 'சகலை', // wife's sister's husband (age unknown)
};

// `from` is the wife — `to` is her husband's sibling's spouse.
const SPOUSE_SIBLING_SPOUSE_LABEL_FEMALE: Record<string, string> = {
    'அண்ணன்': 'ஓரகத்தி', // husband's elder brother's wife
    'தம்பி': 'கொழுந்தியாள்', // husband's younger brother's wife
    'சகோதரன்': 'ஓரகத்தி', // husband's brother's wife (age unknown)
    'அக்கா': 'அத்தான்', // husband's elder sister's husband
    'தங்கை': 'மைத்துனர்', // husband's younger sister's husband
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
                const spouseRelativeLabels = from.gender === 'Male' ? MY_SPOUSE_RELATIVE_LABEL_MALE : MY_SPOUSE_RELATIVE_LABEL_FEMALE;
                const mapped = spouseRelativeLabels[r.label];
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
                const spouseSiblingSpouseLabels = from.gender === 'Male' ? SPOUSE_SIBLING_SPOUSE_LABEL_MALE : SPOUSE_SIBLING_SPOUSE_LABEL_FEMALE;
                const mapped = spouseSiblingSpouseLabels[r.label];
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
