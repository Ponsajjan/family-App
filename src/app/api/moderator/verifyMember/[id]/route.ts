import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);
  const verifiedOnly = url.searchParams.get('verified');
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
          select: { id: true, name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        mother: {
          select: { id: true, name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        partner: {
          select: { name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        fatherOf: {
          select: { name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        motherOf: {
          select: { name: true },
          where: verifiedOnly ? { verified: true } : undefined,
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
    const siblingSet = new Set<string>(); // To avoid duplicate names

    if (member.father?.id) {
      const fatherChildren = await prisma.member.findMany({
        where: {
          fatherId: member.father.id,
          id: { not: id }, // Exclude the current member
          ...(verifiedOnly && { verified: true }),
        },
        select: { name: true },
      });
      fatherChildren.forEach((child) => siblingSet.add(child.name));
    }

    if (member.mother?.id) {
      const motherChildren = await prisma.member.findMany({
        where: {
          motherId: member.mother.id,
          id: { not: id }, // Exclude the current member
          ...(verifiedOnly && { verified: true }),
        },
        select: { name: true },
      });
      motherChildren.forEach((child) => siblingSet.add(child.name));
    }

    // Convert the sibling set to an array
    const siblings = Array.from(siblingSet);

    // Step 3: Respond with enriched data
    return NextResponse.json({
      data: {
        ...member,
        siblings,
      },
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