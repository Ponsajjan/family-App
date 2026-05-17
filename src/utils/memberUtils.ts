import prisma from "@/db/db";

export interface MemberResponse {
  generalInformation: {
    name?: string;
    gender?: string;
    verified?: boolean;
    deceased?: boolean;
    birthDate?: number;
    birthMonth?: number;
    birthYear?: number;
    deathDate?: number;
    deathMonth?: number;
    deathYear?: number;
  };
  relationInformation?: {
    father?: string;
    mother?: string;
    partner?: string;
    children?: Array<{ name: string; order: number }>;
    siblings?: Array<{ name: string; order: number | null }>;
    nonDescendantRelations?: {
      fatherName?: string;
      motherName?: string;
      siblingNames?: string;
    };
  };
  contactInformation?: {
    phoneNumber?: string;
    currentAddress?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  personalInformation?: {
    birthPlace?: string;
    occupation?: string;
    education?: string;
  };
  additionalInformation?: {
    additionalInfo?: string;
  }
  descendant?: boolean;
  mainMemberName?: string | null;
}

export async function fetchMemberData(id: number, loginAuthIdsCount: number) {
  const member = await prisma.member.findUnique({
    where: { id },
    select: {
      id: true,
      authId: true,
      name: true,
      gender: true,
      verified: true,
      phoneNumber: true,
      birthPlace: true,
      currentAddress: true,
      city: true,
      state: true,
      district: true,
      country: true,
      occupation: true,
      education: true,
      additionalInfo: true,
      birthDate: true,
      birthMonth: true,
      birthYear: true,
      deceased: true,
      deathDate: true,
      deathMonth: true,
      deathYear: true,
      descendant: true,
      fatherId: true,
      motherId: true,
      father: { select: { id: true, name: true } },
      mother: { select: { id: true, name: true } },
      partner: { select: { name: true } },
      fatherOf: { select: { name: true, order: true }, orderBy: { order: 'asc' } },
      motherOf: { select: { name: true, order: true }, orderBy: { order: 'asc' } },
      nonDescendantRelation: {
        select: { fatherName: true, motherName: true, siblingNames: true }
      },
      auth: {
        select: { mainMemberId: true }
      },
    },
  });

  if (!member) return null;

  const parentIds = [member.fatherId, member.motherId].filter(Boolean) as number[];

  const siblings = parentIds.length > 0
    ? await prisma.member.findMany({
      where: {
        OR: [
          { fatherId: { in: parentIds } },
          { motherId: { in: parentIds } }
        ],
        id: { not: id },
      },
      select: { name: true, order: true },
      orderBy: { order: 'asc' },
      distinct: ['name'],
    })
    : [];

  const mainMemberId = (member as any).auth?.mainMemberId;
  const mainMemberName = mainMemberId
    ? (await prisma.member.findUnique({
      where: { id: mainMemberId },
      select: { name: true }
    }))?.name || null
    : null;

  const responseData: MemberResponse = {
    generalInformation: buildGeneralInfo(member),
    relationInformation: buildRelationInfo(member, siblings),
    contactInformation: buildContactInfo(member),
    personalInformation: buildPersonalInfo(member),
    additionalInformation: buildAdditionalInfo(member),
    ...(member.descendant !== undefined && { descendant: member.descendant }),
    ...(mainMemberName && loginAuthIdsCount > 1 && { mainMemberName })
  };

  return responseData;
}

// Helper functions to build specific sections
function buildGeneralInfo(member: any) {
  return {
    ...(member.name && { name: member.name }),
    ...(member.gender && { gender: member.gender }),
    ...(member.verified !== undefined && { verified: member.verified }),
    ...(member.deceased !== undefined && { deceased: member.deceased }),
    ...(member.birthDate && { birthDate: member.birthDate }),
    ...(member.birthMonth && { birthMonth: member.birthMonth }),
    ...(member.birthYear && { birthYear: member.birthYear }),
    ...(member.deathDate && { deathDate: member.deathDate }),
    ...(member.deathMonth && { deathMonth: member.deathMonth }),
    ...(member.deathYear && { deathYear: member.deathYear })
  };
}

function buildRelationInfo(member: any, siblings: any[]) {
  const hasRelations = member.father || member.mother || member.partner ||
    member.fatherOf.length > 0 || member.motherOf.length > 0 ||
    siblings.length > 0 || member.nonDescendantRelation[0];
  if (!hasRelations) return undefined;

  return {
    ...(member.father && { father: member.father.name }),
    ...(member.mother && { mother: member.mother.name }),
    ...(member.partner && { partner: member.partner.name }),
    ...((member.fatherOf.length > 0 || member.motherOf.length > 0) && {
      children: [...new Set([...member.fatherOf, ...member.motherOf])]
    }),
    ...(siblings.length > 0 && { siblings }),
    ...(member.nonDescendantRelation[0] && {
      nonDescendantRelations: member.nonDescendantRelation[0]
    })
  };
}

function buildContactInfo(member: any) {
  return member.phoneNumber || member.currentAddress || member.city || member.state || member.country ? {
    ...(member.phoneNumber && { phoneNumber: member.phoneNumber }),
    ...(member.currentAddress && { currentAddress: member.currentAddress }),
    ...(member.city && { city: member.city }),
    ...(member.district && { district: member.district }),
    ...(member.state && { state: member.state }),
    ...(member.country && { country: member.country })
  } : undefined;
}

function buildPersonalInfo(member: any) {
  return member.occupation || member.education || member.birthPlace ? {
    ...(member.birthPlace && { birthPlace: member.birthPlace }),
    ...(member.occupation && { occupation: member.occupation }),
    ...(member.education && { education: member.education })
  } : undefined;
}

function buildAdditionalInfo(member: any) {
  return member.additionalInfo ? {
    ...(member.additionalInfo && { additionalInfo: member.additionalInfo })
  } : undefined;
}
