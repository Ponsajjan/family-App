import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { revalidatePath } from "next/cache";

interface MemberResponse {
  generalInformation: {
    id?: number;
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
    v_father?: boolean;
    mother?: string;
    v_mother?: boolean;
    partner?: string;
    v_partner?: boolean;
    children?: Array<{ name: string; verified: boolean; order: number }>;
    siblings?: Array<{ name: string | null; verified: boolean | null; order: number | null }>;
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
  additionalInformation?: {
    additionalInfo?: string;
  };
  isMainMember?: boolean;
}

export async function GET(request: NextRequest) {
  // Input validation
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '');
  const token = request.cookies.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNaN(id)) return NextResponse.json({ error: "Invalid Member ID" }, { status: 400 });

  try {
    // Authentication
    const decoded = await verifyToken(token);
    const authId = decoded.authId;
    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let isMainMember = false;
    const mainMemberId = decoded.memberId
    if (id === mainMemberId) {
      isMainMember = true;
    }
    // Fetch data in parallel using transaction
    const [member, siblings] = await prisma.$transaction([
      prisma.member.findUnique({
        where: { id, authId: authId },
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
          father: { select: { id: true, name: true, verified: true } },
          mother: { select: { id: true, name: true, verified: true } },
          partner: { select: { name: true, verified: true } },
          fatherOf: { select: { name: true, order: true, verified: true }, orderBy: { order: 'asc' } },
          motherOf: { select: { name: true, order: true, verified: true }, orderBy: { order: 'asc' } },
          nonDescendantRelation: {
            select: { fatherName: true, motherName: true, siblingNames: true }
          },
          additionalInfo: true
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
          authId: authId
        },
        select: { name: true, order: true, verified: true },
        orderBy: { order: 'asc' },
        distinct: ['name'] // Ensure unique siblings
      })
    ]);

    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Build response
    const responseData: MemberResponse = {
      generalInformation: buildGeneralInfo(member),
      relationInformation: buildRelationInfo(member, siblings),
      contactInformation: buildContactInfo(member),
      personalInformation: buildPersonalInfo(member),
      additionalInformation: buildAdditionalInfo(member),
      ...(member.descendant !== undefined && { descendant: member.descendant }),
      isMainMember
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

// Helper functions
async function getParentIds(memberId: number): Promise<number[]> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { fatherId: true, motherId: true }
  });
  return [member?.fatherId, member?.motherId].filter(Boolean) as number[];
}

function buildGeneralInfo(member: any) {
  return {
    ...(member.id && { id: member.id }),
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
    ...(member.father && {
      father: member.father.name,
      v_father: member.father.verified
    }),
    ...(member.mother && {
      mother: member.mother.name,
      v_mother: member.mother.verified
    }),
    ...(member.partner && {
      partner: member.partner.name,
      v_partner: member.partner.verified
    }),
    ...((member.fatherOf.length > 0 || member.motherOf.length > 0) && {
      children: [...member.fatherOf, ...member.motherOf]
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

function buildAdditionalInfo(member: any) {
  return member.additionalInfo ? {
    additionalInfo: member.additionalInfo
  } : undefined;
}


export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(memberId)) {
    return NextResponse.json(
      { error: "Invalid member ID" },
      { status: 400 }
    );
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.userType !== "Moderator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authId = decoded.authId;
    const mainMemberId = decoded.memberId

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (memberId == mainMemberId) {
      return NextResponse.json({ error: "Main member cannot be unverified" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        authId: authId
      },
      select: {
        verified: true
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        verified: !(member.verified)
      },
    });

    revalidatePath('/api/relatives');
    revalidatePath('/api/calendar/[month]/[year]');
    revalidatePath('/api/relatives/[id]');
    revalidatePath('/tree');

    return NextResponse.json({
      success: true,
      message: `${updatedMember.verified ? 'Switched to verified member' : 'Switched to unverified member'}`,
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating member:", error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update member." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.userType !== "Moderator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authId = decoded.authId;
    const mainMemberId = decoded.memberId

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (memberId == mainMemberId) {
      return NextResponse.json({ error: "Main member cannot be deleted" }, { status: 400 });
    }

    // Fetch the member with their relationships
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        authId: authId
      },
      select: {
        verified: true
      },
    });

    // If the member doesn't exist, return an error
    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      // Delete associated nonDescendantRelation (if it exists)
      await prisma.nonDescendantRelation.deleteMany({
        where: { memberId: memberId },
      });

      // Delete the member
      await prisma.member.delete({
        where: { id: memberId },
      });
    });

    revalidatePath('/api/relatives');
    revalidatePath('/api/calendar/[month]/[year]');
    revalidatePath('/api/relatives/[id]');
    revalidatePath('/tree');

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting member:", error);

    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error.code === "P2025") {
      // Prisma-specific error for "Record not found"
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  