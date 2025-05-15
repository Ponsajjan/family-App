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
      include: {
        father: { select: { id: true, name: true } },
        mother: { select: { id: true, name: true } },
        partnerships: {
          include: {
            partner: { select: { id: true, name: true } }
          }
        },
        fatherOf: { select: { id: true } },
        motherOf: { select: { id: true } },
        nonDescendantRelation: true,
      }
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
        verified: false, // Set this to false to allow editing
        pendingVerification: 0,
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
        editGender: true, // Set this to false to allow editing
        editDescendant: true, // Set this to false to allow editing
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

export async function PUT(request: Request) {
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
      select: {
        id: true
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
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