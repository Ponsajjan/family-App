import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (isNaN(id)) {
    return NextResponse.json({ error: "Member ID is required and should be a valid number." }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch the member with all relationships
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        father: { select: { id: true, name: true, verified: true } },
        mother: { select: { id: true, name: true, verified: true } },
        partnerships: {
          select: {
            partner: {
              select: { name: true, verified: true }
            }
          }
        },
        partneredWith: {
          select: {
            member: {
              select: { name: true, verified: true }
            }
          }
        },
        fatherOf: { select: { name: true, verified: true, order: true } },
        motherOf: { select: { name: true, verified: true, order: true } },
        nonDescendantRelation: true
      }
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Get partners from both sides of the relationship// Get partners from both sides of the relationship
    interface PartnerInfo {
      name: string;
      verified: boolean | null;
    }

    const partnerEntries: PartnerInfo[] = [
      ...member.partneredWith.map(p => ({
        name: p.member.name,
        verified: p.member.verified
      })),
      ...member.partnerships.map(p => ({
        name: p.partner.name,
        verified: p.partner.verified
      }))
    ];

    // Deduplicate partners by name
    const partners = Array.from(new Map(
      partnerEntries.map(partner => [partner.name, partner])
    ).values());

    // const partners = [
    //   ...member.partnerships.map(p => p.partner),
    //   ...(await prisma.partnership.findMany({
    //     where: { 
    //       partnerId: member.id 
    //     },
    //     select: { 
    //       member: { 
    //         select: { 
    //           name: true, 
    //           verified: true 
    //         } 
    //       } 
    //     }
    //   })).map(p => p.member)
    // ];

    // Get siblings
    const siblingConditions = [];
    if (member.father) siblingConditions.push({ fatherId: member.father.id });
    if (member.mother) siblingConditions.push({ motherId: member.mother.id });

    const siblings = siblingConditions.length > 0
      ? await prisma.member.findMany({
          where: {
            AND: [
              { id: { not: member.id } },
              { OR: siblingConditions }
            ]
          },
          select: { name: true, verified: true, order: true }
        })
      : [];

    // Format the response data
    const responseData = {
      generalInformation: {
        id: member.id,
        name: member.name,
        gender: member.gender,
        verified: member.verified,
        deceased: member.deceased,
        birthDate: member.birthDate,
        birthMonth: member.birthMonth,
        birthYear: member.birthYear,
        deathDate: member.deathDate,
        deathMonth: member.deathMonth,
        deathYear: member.deathYear,
        descendant: member.descendant
      },
      relationInformation: {
        ...(member.father && { 
          father: member.father.name, 
          v_father: member.father.verified 
        }),
        ...(member.mother && { 
          mother: member.mother.name, 
          v_mother: member.mother.verified 
        }),
        ...(partners.length > 0 && { 
          partners: partners
        }),
        ...((member.fatherOf.length > 0 || member.motherOf.length > 0) && { 
          children: [...member.fatherOf, ...member.motherOf] 
        }),
        ...(siblings.length > 0 && { siblings }),
        ...(member.nonDescendantRelation && { 
          nonDescendantRelations: member.nonDescendantRelation 
        })
      },
      ...(member.phoneNumber || member.address) && {
        contactInformation: {
          ...(member.phoneNumber && { phoneNumber: member.phoneNumber }),
          ...(member.address && { address: member.address })
        }
      },
      ...(member.occupation || member.education) && {
        personalInformation: {
          ...(member.occupation && { occupation: member.occupation }),
          ...(member.education && { education: member.education })
        }
      }
    };

    return NextResponse.json({ data: responseData });

  } catch (error) {
    console.error("Error fetching member data:", error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (memberId == mainMemberId) {
      return NextResponse.json({ error: "Main member cannot be unverified" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { 
        id: memberId,
        descendantOf: forDescendanceOf 
      },
      select: { verified: true }
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: { verified: !member.verified }
    });

    return NextResponse.json({
      success: true,
      message: `${updatedMember.verified ? 'Verified' : 'Unverified'} successfully`,
      data: updatedMember
    });

  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (memberId == mainMemberId) {
      return NextResponse.json({ error: "Main member cannot be deleted" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.nonDescendantRelation.deleteMany({ where: { memberId } }),
      prisma.partnership.deleteMany({
        where: { OR: [{ memberId }, { partnerId: memberId }] }
      }),
      prisma.member.delete({ where: { id: memberId } })
    ]);

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully"
    });

  } catch (error: any) {
    console.error("Error deleting member:", error);

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}