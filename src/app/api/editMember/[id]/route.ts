import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
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
        pendingVerification: {
          where: {
            type: "Edit Member"
          }
        },
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
        verified: member.verified,
        pendingVerification: member.pendingVerification?.length,
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
        editGender: member.fatherOf.length > 0 || member.motherOf.length > 0 || member.partnerId,
        editDescendant: member.fatherId || member.motherId,
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
  // const { params } = context
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

    const member = await prisma.member.findUnique({
      where: { 
        id: memberId,
        descendantOf: forDescendanceOf 
      },
      select: {
        name: true,
        gender: true,
        descendant: true,
        father: true,
        mother: true,
        partner: true,
        fatherOf: true,
        motherOf: true,
        verified: true
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    if (member.partner) {
      const currentGender = member.gender;
      const updatedGender = updatedData.gender;

      if (updatedGender && (currentGender !== updatedGender)) {
        return NextResponse.json(
          { error: "Gender mismatch: Cannot update gender." },
          { status: 400 }
        );
      }
    }

    if (member.fatherOf.length > 0 || member.motherOf.length > 0) {
      const currentGender = member.gender;
      const updatedGender = updatedData.gender;

      if (updatedGender && (currentGender !== updatedGender)) {
        return NextResponse.json(
          { error: "Update not allowed." },
          { status: 400 }
        );
      }
    }

    if (member.father || member.mother) {
      const currentDescendant = member.descendant;
      const updatedDescendant = updatedData.descendant;

      if (currentDescendant !== updatedDescendant) {
        return NextResponse.json(
          { error: "Update not allowed: The member is already assigned as a descendant." },
          { status: 400 }
        );
      }
    }

    // Check if the member is verified
    if (member.verified) {
      // If verified, create a pending verification request instead of updating the member
      await prisma.requestDetails.create({
        data: {
          name: member.name,
          gender: member.gender,
          descendantOf: forDescendanceOf,
          type: "Edit Member",
          details: JSON.stringify(updatedData),
          memberId: memberId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Update request has been added for verification.",
      });
    }

    // If the member is not verified, proceed with the update logic
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