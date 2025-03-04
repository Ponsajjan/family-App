import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const deceased = !!(formData.deathDate || formData.deathMonth || formData.deathYear);

    // Utility function to format two digits
    const formatTwoDigits = (value: number | null) => {
      return value !== null ? parseInt(String(value).padStart(2, "0"), 10) : null;
    };

    // Validate required fields
    if (!formData.name || !formData.gender || !formData.memberPassword || !formData.moderatorPassword) {
      return NextResponse.json(
        { error: "Name, gender, member password, and moderator password are required." },
        { status: 400 }
      );
    }

    // Check if the member password already exists
    const existingAuth = await prisma.auth.findUnique({
      where: { password: formData.memberPassword },
    });

    if (existingAuth) {
      return NextResponse.json(
        { error: "Member password already taken" },
        { status: 400 }
      );
    }

    function unique_descendantOf_string(input: string) {
      const lowercased = input.toLowerCase();
      const withUnderscores = lowercased.replace(/\s+/g, '_');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const result = `${withUnderscores}_${randomDigits}`;
    
      return result;
    }

    // Prepare member data
    const member = {
      name: formData.name,
      descendantOf: unique_descendantOf_string(formData.name),
      gender: formData.gender,
      verified: true,
      descendant: true,
      birthDate: formData.birthDate ? formatTwoDigits(formData.birthDate) : null,
      birthMonth: formData.birthMonth ? formatTwoDigits(formData.birthMonth) : null,
      birthYear: formData.birthYear ? parseInt(formData.birthYear, 10) : null,
      deceased: deceased,
      deathDate: formData.deathDate ? formatTwoDigits(formData.deathDate) : null,
      deathMonth: formData.deathMonth ? formatTwoDigits(formData.deathMonth) : null,
      deathYear: formData.deathYear ? parseInt(formData.deathYear, 10) : null,
      phoneNumber: formData.phoneNumber,
      occupation: formData.occupation || null,
      education: formData.education || null,
      address: formData.address || null,
    };

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the member
      const newMember = await prisma.member.create({
        data: member,
      });

      // If the member is not a descendant and has relatives, create nonDescendantRelation
      let nonDescendantRelatives = null;
      if (formData.father || formData.mother || formData.siblings) {
        nonDescendantRelatives = await prisma.nonDescendantRelation.create({
          data: {
            fatherName: formData.father ? formData.father : null,
            motherName: formData.mother ? formData.mother : null,
            siblingNames: formData.siblings ? formData.siblings : null,
            memberId: newMember.id,
          },
        });
      }

      // Create an Auth entry
      const authEntry = await prisma.auth.create({
        data: {
          forDescendanceOf: newMember.descendantOf,
          mainMemberId: newMember.id,
          moderatorPassword: formData.moderatorPassword,
          password: formData.memberPassword,
        },
      });

      return { member: newMember, nonDescendantRelatives, authEntry };
    });

    return NextResponse.json({
      success: true,
      message: "Member and Auth entry added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error adding member and auth entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add member and auth entry" },
      { status: 500 }
    );
  }
}