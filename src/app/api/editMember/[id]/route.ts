import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request, context: any) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '');
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { error: "Member ID is required and should be a valid number." },
      { status: 400 }
    );
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        verified: true,
        gender: true,
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
        partnerId: true,
        fatherId: true,
        motherId: true,
        fatherOf: true,
        motherOf: true,
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
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const data = {
      formData: {
        id: member.id,
        name: member.name,
        gender: member.gender,
        birth_date: member.birthDate ? String(member.birthDate).padStart(2, '0') : null,
        birth_month: member.birthMonth ? String(member.birthMonth).padStart(2, '0') : null,
        birth_year: member.birthYear ? String(member.birthYear) : null,
        deceased: member.deceased,
        death_date: member.deathDate ? String(member.deathDate).padStart(2, '0') : null,
        death_month: member.deathMonth ? String(member.deathMonth).padStart(2, '0') : null,
        death_year: member.deathYear ? String(member.deathYear) : null,
        phone_number: member.phoneNumber,
        occupation: member.occupation,
        education: member.education,
        address: member.address,
        descendant: member.descendant ? 'Yes' : 'No',
        father: member.nonDescendantRelation?.[0]?.fatherName,
        mother: member.nonDescendantRelation?.[0]?.motherName,
        siblings: member.nonDescendantRelation?.[0]?.siblingNames,
      },
      allowEdit: {
        dataLocked: member.verified,
        editGender: member.fatherOf.length > 0 || member.motherOf.length > 0 || member.partnerId,
        editDescendant: member.fatherId || member.motherId,
        deleteOption: !member.fatherId && !member.motherId && !member.partnerId && member.fatherOf.length === 0 && member.motherOf.length === 0,
      },
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: any) {
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

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const updatedData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const existingMember = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        father: true,
        mother: true,
        partner: true,
        fatherOf: true,
        motherOf: true,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    if (existingMember.partner) {
      const currentGender = existingMember.gender;
      const updatedGender = updatedData.gender;

      if (updatedGender && (currentGender !== updatedGender)) {
        return NextResponse.json(
          { error: "Gender mismatch: Cannot update gender." },
          { status: 400 }
        );
      }
    }

    if (existingMember.fatherOf.length > 0 || existingMember.motherOf.length > 0) {
      const currentGender = existingMember.gender;
      const updatedGender = updatedData.gender;

      if (updatedGender && (currentGender !== updatedGender)) {
        return NextResponse.json(
          { error: "Update not allowed." },
          { status: 400 }
        );
      }
    }

    if (existingMember.father || existingMember.mother) {
      const currentDescendant = existingMember.descendant;
      const updatedDescendant = updatedData.descendant;

      if (currentDescendant !== updatedDescendant) {
        return NextResponse.json(
          { error: "Update not allowed: The member is already assigned as a descendant." },
          { status: 400 }
        );
      }
    }

    const deceased = updatedData.deceased === true;

    const memberUpdateData = {
      name: updatedData.name,
      gender: updatedData.gender,
      birthDate: updatedData.birthDate ? parseInt(updatedData.birthDate, 10) : null,
      birthMonth: updatedData.birthMonth ? parseInt(updatedData.birthMonth, 10) : null,
      birthYear: updatedData.birthYear ? parseInt(updatedData.birthYear, 10) : null,
      deceased: deceased,
      deathDate: deceased && updatedData.deathDate ? parseInt(updatedData.deathDate, 10) : null,
      deathMonth: deceased && updatedData.deathMonth ? parseInt(updatedData.deathMonth, 10) : null,
      deathYear: deceased && updatedData.deathYear ? parseInt(updatedData.deathYear, 10) : null,
      phoneNumber: updatedData.phoneNumber,
      occupation: updatedData.occupation || null,
      education: updatedData.education || null,
      address: updatedData.address || null,
      descendant: updatedData.descendant,
    };

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: memberUpdateData,
    });

    if (updatedData.descendant === false && (updatedData.father || updatedData.mother || updatedData.siblings)) {
      await prisma.nonDescendantRelation.upsert({
        where: { memberId: memberId },
        update: {
          fatherName: updatedData.father || null,
          motherName: updatedData.mother || null,
          siblingNames: updatedData.siblings || null,
        },
        create: {
          memberId: memberId,
          fatherName: updatedData.father || null,
          motherName: updatedData.mother || null,
          siblingNames: updatedData.siblings || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error: any) {
    console.error("Error updating member:", error);

    if (error.code === "P2025") {
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

export async function DELETE(request: Request, context: any) {
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

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch the member with their relationships
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        partner: true,
        fatherOf: true,
        motherOf: true,
        father: true,
        mother: true,
      },
    });

    // If the member doesn't exist, return an error
    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Check if the member is a descendant
    if (member.father || member.mother) {
      return NextResponse.json(
        { error: "Cannot delete member: Member is a descendant." },
        { status: 400 }
      );
    }

    // Check if the member has a partner
    if (member.partner) {
      return NextResponse.json(
        { error: "Cannot delete member: Member has a partner." },
        { status: 400 }
      );
    }

    // Check if the member is listed as a father or mother
    if (member.fatherOf.length > 0 || member.motherOf.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete member: Member is listed as a parent of one or more children." },
        { status: 400 }
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