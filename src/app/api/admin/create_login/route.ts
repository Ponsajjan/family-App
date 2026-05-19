import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = await verifyToken(token);
    const userType = decoded.userType;

    if (userType !== "Admin") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
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

    function generateUniqueString(addSeconds = 0): string {
      const timestamp = (Date.now() + (addSeconds * 1000)).toString(36).padStart(8, '0');
      const randomNum = Math.floor(Math.random() * 10);
      const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      return `${timestamp}${randomNum}${randomChar}`
    }

    const moderatorUniqueString = generateUniqueString();
    const memberUniqueString = generateUniqueString(6);
    // Prepare member data
    const member = {
      name: formData.name,
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
      country: formData.country || null,
      state: formData.state || null,
      city: formData.city || null,
      district: formData.district || null,
      address: formData.address || null,
    };

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(
      async (tx) => {
        // Step 1: Create the Auth entry first (without mainMemberId)
        const authEntry = await tx.auth.create({
          data: {
            moderatorPassword: formData.moderatorPassword,
            memberAuthId: memberUniqueString,
            moderatorAuthId: moderatorUniqueString,
            password: formData.memberPassword,
            mainMemberId: null, // Initially set to null
          },
        });

        // Step 2: Create the member
        const newMember = await tx.member.create({
          data: {
            ...member,
            authId: authEntry.id,
          },
        });

        // Step 3: If the member has relatives, create nonDescendantRelation
        let nonDescendantRelatives = null;
        if (formData.father || formData.mother || formData.siblings) {
          nonDescendantRelatives = await tx.nonDescendantRelation.create({
            data: {
              fatherName: formData.father ? formData.father : null,
              motherName: formData.mother ? formData.mother : null,
              siblingNames: formData.siblings ? formData.siblings : null,
              memberId: newMember.id,
            },
          });
        }

        // Step 4: Update the Auth entry with the mainMemberId
        const updatedAuthEntry = await tx.auth.update({
          where: { id: authEntry.id },
          data: {
            mainMemberId: newMember.id,
          },
        });
        return { member: newMember, nonDescendantRelatives, authEntry: updatedAuthEntry };
      },
      {
        timeout: 20000, // 20 seconds timeout to handle database load
      }
    );

    return NextResponse.json({
      success: true,
      message: "Member and Auth entry added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error adding member and auth entry:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to add member and auth entry" },
      { status: 500 }
    );
  }
}