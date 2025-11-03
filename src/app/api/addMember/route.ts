import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  const deceased = formData.deceased === true;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // Utility function to capitalize words
    const capitalizeWords = (name: string) => {
      return name
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace(/\b\w+\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .replace(/,\s*\w/g, (char) => char.toUpperCase());
    };

    // Utility function to format two digits
    const formatTwoDigits = (value: number | null) => {
      return value !== null ? parseInt(String(value).padStart(2, "0"), 10) : null;
    };

    // Validate required fields
    if (!formData.name || !formData.gender) {
      return NextResponse.json(
        { error: "Name and gender are required." },
        { status: 400 }
      );
    }

    // Prepare member data
    const member = {
      authId: authId,
      name: capitalizeWords(formData.name),
      gender: formData.gender,
      birthDate: formData.birthDate ? formatTwoDigits(formData.birthDate) : null,
      birthMonth: formData.birthMonth ? formatTwoDigits(formData.birthMonth) : null,
      birthYear: formData.birthYear ? parseInt(formData.birthYear, 10) : null,
      deceased: deceased,
      deathDate: (deceased && formData.deathDate) ? formatTwoDigits(formData.deathDate) : null,
      deathMonth: (deceased && formData.deathMonth) ? formatTwoDigits(formData.deathMonth) : null,
      deathYear: (deceased && formData.deathYear) ? parseInt(formData.deathYear, 10) : null,
      phoneNumber: formData.phoneNumber || null,
      occupation: formData.occupation || null,
      education: formData.education || null,
      address: formData.address || null,
      descendant: formData.descendant,
    };

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the member
      const newMember = await prisma.member.create({
        data: member,
      });

      // If the member is not a descendant and has relatives, create nonDescendantRelation
      let nonDescendantRelatives = null;
      if (formData.descendant === false && (formData.father || formData.mother || formData.siblings)) {
        nonDescendantRelatives = await prisma.nonDescendantRelation.create({
          data: {
            fatherName: formData.father ? capitalizeWords(formData.father) : null,
            motherName: formData.mother ? capitalizeWords(formData.mother) : null,
            siblingNames: formData.siblings ? capitalizeWords(formData.siblings) : null,
            memberId: newMember.id, // Link nonDescendantRelation to the newly created Member
          },
        });
      }

      return { member: newMember, nonDescendantRelatives };
    });

    revalidatePath('/api/relatives');

    return NextResponse.json({
      success: true,
      message: "Member added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // Handle other errors
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    );
  }
} 