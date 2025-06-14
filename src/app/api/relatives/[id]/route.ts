import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

interface MemberResponse {
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
    address?: string;
  };
  personalInformation?: {
    occupation?: string;
    education?: string;
  };
  descendant?: boolean;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;
  
  // Validate inputs
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNaN(id)) return NextResponse.json({ error: "Invalid Member ID" }, { status: 400 });

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    if (!forDescendanceOf) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Fetch member with all relations in a single query using transactions
    const [member, siblings] = await prisma.$transaction([
      prisma.member.findUnique({
        where: { id, descendantOf: forDescendanceOf },
        select: {
          id: true,
          name: true,
          gender: true,
          verified: true,
          phoneNumber: true,
          address: true,
          occupation: true,
          education: true,
          birthDate: true,
          birthMonth: true,
          birthYear: true,
          deceased: true,
          deathDate: true,
          deathMonth: true,
          deathYear: true,
          descendant: true,
          father: { select: { id: true, name: true } },
          mother: { select: { id: true, name: true } },
          partner: { select: { name: true } },
          fatherOf: { select: { name: true, order: true }, orderBy: { order: 'asc' } },
          motherOf: { select: { name: true, order: true }, orderBy: { order: 'asc' } },
          nonDescendantRelation: {
            select: { fatherName: true, motherName: true, siblingNames: true }
          },
        },
      }),
      // Fetch siblings in parallel
      prisma.member.findMany({
        where: {
          OR: [
            { fatherId: { not: null, in: await getParentIds(id) } },
            { motherId: { not: null, in: await getParentIds(id) } }
          ],
          id: { not: id },
          descendantOf: forDescendanceOf
        },
        select: { name: true, order: true },
        distinct: ['name'] // Ensure unique siblings
      })
    ]);

    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Build response data
    const responseData: MemberResponse = {
      generalInformation: buildGeneralInfo(member),
      relationInformation: buildRelationInfo(member, siblings),
      contactInformation: buildContactInfo(member),
      personalInformation: buildPersonalInfo(member),
      ...(member.descendant !== undefined && { descendant: member.descendant })
    };

    return NextResponse.json({ data: responseData });
  } catch (error) {
    console.error("Error fetching member data:", error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// Helper function to get parent IDs
async function getParentIds(memberId: number): Promise<number[]> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { fatherId: true, motherId: true }
  });
  return [member?.fatherId, member?.motherId].filter(Boolean) as number[];
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
  return member.phoneNumber || member.address ? {
    ...(member.phoneNumber && { phoneNumber: member.phoneNumber }),
    ...(member.address && { address: member.address })
  } : undefined;
}

function buildPersonalInfo(member: any) {
  return member.occupation || member.education ? {
    ...(member.occupation && { occupation: member.occupation }),
    ...(member.education && { education: member.education })
  } : undefined;
}