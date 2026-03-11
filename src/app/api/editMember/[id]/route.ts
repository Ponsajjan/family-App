import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '');
  const token = request.cookies.get("token")?.value;

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
    const authId = decoded.authId;
    const mainMemberId = decoded.memberId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const member = await prisma.member.findFirst({
      where: {
        id: id,
        authId: authId
      },
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
        additionalInfo: true,
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
        additionalInfo: member.additionalInfo,
        descendant: member.descendant ? 'Yes' : 'No',
        father: member.nonDescendantRelation?.[0]?.fatherName,
        mother: member.nonDescendantRelation?.[0]?.motherName,
        siblings: member.nonDescendantRelation?.[0]?.siblingNames,
      },
      allowEdit: {
        //----- New World Order gone wrong -----
        // editGender: member.fatherOf.length > 0 || member.motherOf.length > 0 || member.partnerId,
        editDescendant: member.fatherId || member.motherId || member.id == mainMemberId,
      },
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;

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
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const updatedData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        authId: authId
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        address: true,
        occupation: true,
        education: true,
        additionalInfo: true,
        birthDate: true,
        birthMonth: true,
        birthYear: true,
        deceased: true,
        deathDate: true,
        deathMonth: true,
        deathYear: true,
        descendant: true,
        father: true,
        mother: true,
        partner: true,
        fatherOf: true,
        motherOf: true,
        verified: true,
        partnerId: true,
        fatherId: true,
        motherId: true,
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

    //----- New World Order gone wrong -----

    // if (member.partner) {
    //   const currentGender = member.gender;
    //   const updatedGender = updatedData.gender;

    //   if (updatedGender && (currentGender !== updatedGender)) {
    //     return NextResponse.json(
    //       { error: "Gender mismatch: Cannot update gender." },
    //       { status: 400 }
    //     );
    //   }
    // }

    // if (member.fatherOf.length > 0 || member.motherOf.length > 0) {
    //   const currentGender = member.gender;
    //   const updatedGender = updatedData.gender;

    //   if (updatedGender && (currentGender !== updatedGender)) {
    //     return NextResponse.json(
    //       { error: "Update not allowed." },
    //       { status: 400 }
    //     );
    //   }
    // }

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

    // Helper function to normalize values for comparison
    const normalizeValue = (value: any): any => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'string') return value.trim();
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value;
      if (Array.isArray(value)) return value.map(item => normalizeValue(item));
      return value;
    };

    // Helper function to compare values robustly
    const valuesAreEqual = (value1: any, value2: any): boolean => {
      const normalized1 = normalizeValue(value1);
      const normalized2 = normalizeValue(value2);

      // Handle null/undefined cases
      if (normalized1 === null && normalized2 === null) return true;
      if (normalized1 === null || normalized2 === null) return normalized1 === normalized2;

      // Handle numbers (convert strings to numbers for comparison)
      if (!isNaN(Number(normalized1)) && !isNaN(Number(normalized2))) {
        return Number(normalized1) === Number(normalized2);
      }

      // Handle arrays
      if (Array.isArray(normalized1) && Array.isArray(normalized2)) {
        if (normalized1.length !== normalized2.length) return false;
        return JSON.stringify(normalized1.sort()) === JSON.stringify(normalized2.sort());
      }

      // Handle booleans
      if (typeof normalized1 === 'boolean' || typeof normalized2 === 'boolean') {
        return Boolean(normalized1) === Boolean(normalized2);
      }

      // Default to string comparison
      return String(normalized1) === String(normalized2);
    };

    const deceased = updatedData.deceased === true;

    // Prepare the update data
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
      additionalInfo: updatedData.additionalInfo || null,
      descendant: updatedData.descendant,
    };

    // Filter out unchanged fields
    const filteredUpdateData: Record<string, any> = {};

    Object.entries(memberUpdateData).forEach(([key, value]) => {
      // Skip undefined values (means field wasn't provided for update)
      if (value === undefined) return;

      const currentValue = member[key as keyof typeof member];

      if (!valuesAreEqual(value, currentValue)) {
        filteredUpdateData[key] = value;
      }
    });

    // Check for non-descendant relation changes (only if descendant is false)
    let nonDescendantChanges: Record<string, any> = {};
    if (updatedData.descendant === false) {
      const currentNonDescendant = member.nonDescendantRelation?.[0];

      // Normalize and compare father name
      if (updatedData.father !== undefined) {
        const newFather = updatedData.father ? String(updatedData.father).trim() : null;
        const currentFather = currentNonDescendant?.fatherName ? String(currentNonDescendant.fatherName).trim() : null;

        if (!valuesAreEqual(newFather, currentFather)) {
          nonDescendantChanges.father = newFather;
        }
      }

      // Normalize and compare mother name
      if (updatedData.mother !== undefined) {
        const newMother = updatedData.mother ? String(updatedData.mother).trim() : null;
        const currentMother = currentNonDescendant?.motherName ? String(currentNonDescendant.motherName).trim() : null;

        if (!valuesAreEqual(newMother, currentMother)) {
          nonDescendantChanges.mother = newMother;
        }
      }

      // Normalize and compare siblings
      if (updatedData.siblings !== undefined) {
        const newSiblings = updatedData.siblings || null;
        const currentSiblings = currentNonDescendant?.siblingNames || null;

        if (!valuesAreEqual(newSiblings, currentSiblings)) {
          nonDescendantChanges.siblings = newSiblings;
        }
      }
    }

    // If descendant is being changed to true, and there are existing non-descendant relations, ensure we remove non-descendant relations
    if (updatedData.descendant === true && member.nonDescendantRelation?.[0]) {
      nonDescendantChanges = {
        father: '',
        mother: '',
        siblings: '',
      };
    }

    // Clean up empty values from nonDescendantChanges
    const cleanedNonDescendantChanges: Record<string, any> = {};
    Object.entries(nonDescendantChanges).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanedNonDescendantChanges[key] = value;
      }
    });

    // If no fields are changed, return early
    if (Object.keys(filteredUpdateData).length === 0 && Object.keys(cleanedNonDescendantChanges).length === 0) {
      return NextResponse.json(
        { error: "No changes to update." },
        { status: 400 }
      );
    }

    // Check if the member is verified
    if (member.verified) {
      // If there are any changes (either member data or non-descendant relations)
      if (Object.keys(filteredUpdateData).length > 0 || Object.keys(cleanedNonDescendantChanges).length > 0) {
        const requestDetails: Record<string, any> = {
          ...(Object.keys(filteredUpdateData).length > 0 && { ...filteredUpdateData }),
          ...(Object.keys(cleanedNonDescendantChanges).length > 0 && { ...cleanedNonDescendantChanges }),
        };

        // If descendant is changing to true, mark non-descendant relations as empty
        if (requestDetails.descendant === true && member.nonDescendantRelation?.[0]) {
          requestDetails.father = '';
          requestDetails.mother = '';
          requestDetails.siblings = '';
        }

        // Convert descendant to Yes/No for consistency with other parts of the app
        if ('descendant' in requestDetails) {
          requestDetails.descendant = requestDetails.descendant ? 'Yes' : 'No';
        }

        await prisma.requestDetails.create({
          data: {
            authId: authId,
            type: "Edit Member",
            details: JSON.stringify(requestDetails),
            memberId: memberId,
          },
        });

        return NextResponse.json({
          success: true,
          message: `Update request has been added for <b>verification</b>.`,
        });
      }

      return NextResponse.json({
        success: true,
        message: "No changes to update.",
      });
    }

    // Non-verified member update logic
    try {
      // Only update if there are changes to member data
      if (Object.keys(filteredUpdateData).length > 0) {
        await prisma.member.update({
          where: { id: memberId },
          data: filteredUpdateData,
        });
      }

      // Handle non-descendant relations
      if (Object.keys(cleanedNonDescendantChanges).length > 0) {
        if (updatedData.descendant === false) {
          await prisma.nonDescendantRelation.upsert({
            where: { memberId: memberId },
            update: {
              fatherName: cleanedNonDescendantChanges.father !== undefined ? cleanedNonDescendantChanges.father : undefined,
              motherName: cleanedNonDescendantChanges.mother !== undefined ? cleanedNonDescendantChanges.mother : undefined,
              siblingNames: cleanedNonDescendantChanges.siblings !== undefined ? cleanedNonDescendantChanges.siblings : undefined,
            },
            create: {
              memberId: memberId,
              fatherName: cleanedNonDescendantChanges.father || null,
              motherName: cleanedNonDescendantChanges.mother || null,
              siblingNames: cleanedNonDescendantChanges.siblings || null,
            },
          });
        } else if (updatedData.descendant === true) {
          // Remove non-descendant relations if descendant is true
          await prisma.nonDescendantRelation.deleteMany({
            where: { memberId: memberId },
          });
        }
      }

      revalidatePath('/api/relatives');
      revalidatePath('/api/calendar/[month]/[year]');
      revalidatePath('/api/relatives/[id]');
      revalidatePath('/tree');

      return NextResponse.json({
        success: true,
        message: "Member updated successfully",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      return NextResponse.json(
        { error: "Failed to update member" },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Error updating member:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}