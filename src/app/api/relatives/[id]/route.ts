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
    return NextResponse.json({ error: "Member ID is required and should be a valid number." });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Step 1: Fetch the member and their direct relations
    const member = await prisma.member.findUnique({
      where: { 
        id, 
        descendantOf: forDescendanceOf 
      },
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
        father: {
          select: { id: true, name: true },
        },
        mother: {
          select: { id: true, name: true },
        },
        partnerships: {
          select: {
            partner: {
              select: { name: true }
            }
          }
        },
        partneredWith: {
          select: {
            member: {
              select: { name: true }
            }
          }
        },
        fatherOf: {
          select: { name: true, order: true },
          orderBy: { order: 'asc' }
        },
        motherOf: {
          select: { name: true, order: true },
          orderBy: { order: 'asc' }
        },
        nonDescendantRelation: {
          select: {
            id: true,
            fatherName: true,
            motherName: true,
            siblingNames: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Combine partnerships and partneredWith into a single partners array
    const partners = [
      ...new Set([
        ...member.partnerships.map(p => p.partner.name),
        ...member.partneredWith.map(p => p.member.name)
      ]),
    ];

    // Step 2: Fetch siblings using father's and mother's IDs
    type SiblingInfo = {
      name: string | null;
      order: number | null;
    };
    
    const siblingMap = new Map<string, SiblingInfo>();
    
    if (member.father?.id) {
      const fatherChildren = await prisma.member.findMany({
        where: {
          fatherId: member.father.id,
          id: { not: member.id },
        },
        select: { 
          name: true,
          order: true,
        },
      });
      fatherChildren.forEach((child) => {
        if (child.name) {
          siblingMap.set(child.name, child);
        }
      });
    }
    
    if (member.mother?.id) {
      const motherChildren = await prisma.member.findMany({
        where: {
          motherId: member.mother.id,
          id: { not: member.id },
        },
        select: { 
          name: true,
          order: true,
        },
      });
      motherChildren.forEach((child) => {
        if (child.name) {
          siblingMap.set(child.name, child);
        }
      });
    }
    
    const siblings = Array.from(siblingMap.values());

    // Step 3: Respond with enriched data
    const responseData = {
      ...{generalInformation: {
          ...(member.name ? { name: member.name } : {}),
          ...(member.gender ? { gender: member.gender } : {}),
          ...(member.verified !== undefined ? { verified: member.verified } : {}),
          ...(member.deceased !== undefined ? { deceased: member.deceased } : {}),
          ...(member.birthDate ? { birthDate: member.birthDate } : {}),
          ...(member.birthMonth ? { birthMonth: member.birthMonth } : {}),
          ...(member.birthYear ? { birthYear: member.birthYear } : {}),
          ...(member.deathDate ? { deathDate: member.deathDate } : {}),
          ...(member.deathMonth ? { deathMonth: member.deathMonth } : {}),
          ...(member.deathYear ? { deathYear: member.deathYear } : {}),
        }
      },
      ...(member.father || member.mother || partners.length > 0 || 
          member.fatherOf.length > 0 || member.motherOf.length > 0 || 
          siblings.length > 0 || member.nonDescendantRelation[0]) ? {
        relationInformation: {
          ...(member.father ? { father: member.father.name } : {}),
          ...(member.mother ? { mother: member.mother.name } : {}),
          ...(partners.length > 0 ? { partners: partners } : {}),
          ...(member.fatherOf.length > 0 || member.motherOf.length > 0 ? { 
            children: [...new Set([...member.fatherOf, ...member.motherOf])] 
          } : {}),
          ...(siblings.length > 0 ? { siblings: siblings } : {}),
          ...(member.nonDescendantRelation[0] ? { 
            nonDescendantRelations: member.nonDescendantRelation[0] 
          } : {}),
        }
      } : {},
    
      ...(member.phoneNumber || member.address) ? {
        contactInformation: {
          ...(member.phoneNumber ? { phoneNumber: member.phoneNumber } : {}),
          ...(member.address ? { address: member.address } : {}),
        }
      } : {},
    
      ...(member.occupation || member.education) ? {
        personalInformation: {
          ...(member.occupation ? { occupation: member.occupation } : {}),
          ...(member.education ? { education: member.education } : {}),
        }
      } : {},
    
      ...(member.descendant !== undefined ? { descendant: member.descendant } : {})
    };

    return NextResponse.json({
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching member data:", error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}