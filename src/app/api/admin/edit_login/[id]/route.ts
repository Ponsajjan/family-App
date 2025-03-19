import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() || "", 10); // Extract the member ID from the URL

    // Validate the ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid member ID. Please provide a valid number." },
        { status: 400 }
      );
    }

    // Fetch the member and related data
    const member = await prisma.member.findUnique({
      where: { id: id },
      include: {
        nonDescendantRelation: {
          select: {
            fatherName: true,
            motherName: true,
            siblingNames: true,
          },
        },
      },
    });

    // If the member is not found, return a 404 error
    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Fetch the Auth entry for the member
    const authEntry = await prisma.auth.findUnique({
      where: { mainMemberId: id },
    });

    // If the auth entry is not found, return a 404 error
    if (!authEntry) {
      return NextResponse.json(
        { error: "Auth entry not found for the member" },
        { status: 404 }
      );
    }

    // Prepare the response data
    const responseData = {
      id: member.id,
      name: member.name,
      gender: member.gender,
      birth_date: member.birthDate ? String(member.birthDate).padStart(2, '0') : null,
      birth_month: member.birthMonth ? String(member.birthMonth).padStart(2, '0') : null,
      birth_year: member.birthYear ? String(member.birthYear) : null,
      death_date: member.deathDate ? String(member.deathDate).padStart(2, '0') : null,
      death_month: member.deathMonth ? String(member.deathMonth).padStart(2, '0') : null,
      death_year: member.deathYear ? String(member.deathYear) : null,
      phone_number: member.phoneNumber,
      occupation: member.occupation,
      education: member.education,
      address: member.address,
      father: member.nonDescendantRelation[0]?.fatherName || null,
      mother: member.nonDescendantRelation[0]?.motherName || null,
      siblings: member.nonDescendantRelation[0]?.siblingNames || null,
      member_password: authEntry.password,
      moderator_password: authEntry.moderatorPassword,
    };

    console.log("Member data fetched successfully:", responseData);

    // Return the response
    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching member data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch member data" },
      { status: 500 }
    );
  }
}
  
export async function PUT(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const formData = await request.json();
    const deceased = !!(formData.deathDate || formData.deathMonth || formData.deathYear);

    // Utility function to format two digits
    const formatTwoDigits = (value: number | null) => {
      return value !== null ? parseInt(String(value).padStart(2, "0"), 10) : null;
    };

    // Validate required fields
    if (!formData.id || !formData.name || !formData.gender || !formData.memberPassword || !formData.moderatorPassword) {
      return NextResponse.json(
        { error: "ID, name, gender, member password, and moderator password are required." },
        { status: 400 }
      );
    }

    // Prepare member data for update
    const memberData = {
      name: formData.name,
      gender: formData.gender,
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
      // Update the member
      const updatedMember = await prisma.member.update({
        where: { id: formData.id }, // Use the ID to find the member to update
        data: memberData,
      });

      // Update nonDescendantRelation if it exists
      let updatedNonDescendantRelatives = null;
      if (formData.father || formData.mother || formData.siblings) {
        updatedNonDescendantRelatives = await prisma.nonDescendantRelation.upsert({
          where: { memberId: formData.id }, // Use the member ID to find the relation
          update: {
            fatherName: formData.father ? formData.father : null,
            motherName: formData.mother ? formData.mother : null,
            siblingNames: formData.siblings ? formData.siblings : null,
          },
          create: {
            fatherName: formData.father ? formData.father : null,
            motherName: formData.mother ? formData.mother : null,
            siblingNames: formData.siblings ? formData.siblings : null,
            memberId: formData.id,
          },
        });
      }

      // Update the Auth entry
      const updatedAuthEntry = await prisma.auth.update({
        where: { mainMemberId: formData.id },
        data: {
          moderatorPassword: formData.moderatorPassword,
          password: formData.memberPassword,
        },
      });

      return { member: updatedMember, nonDescendantRelatives: updatedNonDescendantRelatives, authEntry: updatedAuthEntry };
    });

    return NextResponse.json({
      success: true,
      message: "Member details updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating member and auth entry:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: "Failed to update member and auth entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const authId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(authId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const moderator = await prisma.auth.findUnique({
      where: { id: authId },
    });
    
    if (!moderator) {
      return NextResponse.json(
        { error: "Invalid moderator. The referenced moderator does not exist." },
        { status: 400 }
      );
    }
    // Delete the auth entry
    await prisma.auth.delete({
      where: { id: authId },
    });

    // Return a success message
    return NextResponse.json(
      { message: "Moderator deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting moderator:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to delete moderator." },
      { status: 500 }
    );
  }
}