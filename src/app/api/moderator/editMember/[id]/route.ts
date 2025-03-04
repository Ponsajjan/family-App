import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function PUT(request: Request, context: any) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);

  if (isNaN(memberId)) {
    return NextResponse.json(
      { error: "Invalid member ID" },
      { status: 400 }
    );
  }

  try {
    const updatedData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const existingMember = await prisma.member.findUnique({
      where: { id: memberId },
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