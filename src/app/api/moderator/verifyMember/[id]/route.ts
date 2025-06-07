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
      where: { id },
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
          select: { 
            id: true, 
            name: true,
            verified: true,
          },
        },
        mother: {
          select: { 
            id: true, 
            name: true,
            verified: true,
          },
        },
        partner: {
          select: { 
            name: true,
            verified: true,
          },
        },
        fatherOf: {
          select: { 
            name: true,
            verified: true,
            order: true
          },
        },
        motherOf: {
          select: { 
            name: true,
            verified: true,
            order: true
          },
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

    // Step 2: Fetch siblings using father's and mother's IDs
    type SiblingInfo = {
      name: string | null;
      verified: boolean | null;
      order: number | null;
    };
    
    const siblingMap = new Map<string | null, SiblingInfo>(); // Track by name
    
    if (member.father?.id) {
      const fatherChildren = await prisma.member.findMany({
        where: {
          fatherId: member.father.id,
          id: { not: id }, // Exclude the current member
        },
        select: { 
          name: true,
          verified: true,
          order: true
        },
      });
      fatherChildren.forEach((child) => {
        if (child.name && !siblingMap.has(child.name)) {
          siblingMap.set(child.name, { name: child.name, verified: child.verified, order: child.order });
        }
      });
    }
    
    if (member.mother?.id) {
      const motherChildren = await prisma.member.findMany({
        where: {
          motherId: member.mother.id,
          id: { not: id }, // Exclude the current member
        },
        select: { 
          name: true,
          verified: true,
          order: true
        },
      });
      motherChildren.forEach((child) => {
        if (child.name && !siblingMap.has(child.name)) {
          siblingMap.set(child.name, { name: child.name, verified: child.verified, order: child.order });
        }
      });
    }
    
    // Convert the Map values to an array (automatically unique by name)
    const siblings = Array.from(siblingMap.values());

    // Step 3: Respond with enriched data
    const responseData = {
      ...{generalInformation: {
          ...(member.id ? { id: member.id } : {}),
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
      ...(member.father || member.mother || member.partner || 
          member.fatherOf.length > 0 || member.motherOf.length > 0 || 
          siblings.length > 0 || member.nonDescendantRelation[0]) ? {
        relationInformation: {
          ...(member.father ? { father: member.father.name, v_father: member.father.verified } : {}),
          ...(member.mother ? { mother: member.mother.name, v_mother: member.mother.verified } : {}),
          ...(member.partner ? { partner: member.partner.name, v_partner: member.partner.verified } : {}),
          ...(member.fatherOf.length > 0 || member.motherOf.length > 0 ? { 
            children: [...member.fatherOf, ...member.motherOf] 
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
    // Handle token verification errors
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
    return NextResponse.json(
      { error: "Invalid member ID" },
      { status: 400 }
    );
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.userType !== "moderator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId

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
    if (decoded.userType !== "moderator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (memberId == mainMemberId) {
      return NextResponse.json({ error: "Main member cannot be deleted" }, { status: 400 });
    }

    // Fetch the member with their relationships
    const member = await prisma.member.findUnique({
      where: { 
        id: memberId,
        descendantOf: forDescendanceOf
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