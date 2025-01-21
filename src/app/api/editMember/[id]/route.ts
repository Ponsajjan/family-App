import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/db/db";

export async function GET(request: Request, context: any) {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');
    
    if (!id) {
      return NextResponse.json({ error: "Member ID is required and should be a valid number." });
    }

    try {
      const dbData = await prisma.member.findMany({
        where: {
          id: id,
        },
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

      // const capitalizeWords = (name: string) => {
      //   return name.replace(/\b\w/g, (char) => char.toUpperCase())
      //   .replace(/\b\w+\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()); 
      // }

      const member = dbData[0];
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
          descendant: (member.descendant === true) ? 'Yes' : 'No',
          father: member.nonDescendantRelation?.[0]?.fatherName,
          mother: member.nonDescendantRelation?.[0]?.motherName,
          siblings: member.nonDescendantRelation?.[0]?.siblingNames,
        },
        allowEdit: {
          dataLocked: member.verified,
          editGender: (member.fatherOf.length > 0 || member.motherOf.length > 0 || member.partnerId),
          editDescendant: (member.fatherId || member.motherId)
        }
      }

      return NextResponse.json({ data });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch data" });
    }
}

export async function PUT(request: Request, context: any) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);

  // Ensure valid memberId
  if (isNaN(memberId)) {
    return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
  }

  try {
    // Utility function to capitalize each word
    // const capitalizeWords = (str: string) => {
    //   return str.replace(/\b\w/g, (char) => char.toUpperCase());
    // };

    // Parse the JSON body
    const updatedData = await request.json();

    // Validate the request body
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
    }

    // Fetch the current member data
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
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Check if the member has a partner
    if (existingMember.partner) {
      const currentGender = existingMember.gender;
      const updatedGender = updatedData.gender;

      // If the gender is being updated, validate it against the current gender
      if (updatedGender && (currentGender !== updatedGender)) {
        return NextResponse.json({
          error: `Gender mismatch: Cannot update gender to ${updatedGender} as the member has a partner.`,
        }, { status: 400 });
      }
    }

    // Check if the member is a father or mother
    if (existingMember.fatherOf.length > 0 || existingMember.motherOf.length > 0) {
      const currentGender = existingMember.gender;
      const updatedGender = updatedData.gender;

      // If the gender is being updated, validate it against the current gender
      if (updatedGender && currentGender !== updatedGender) {
        return NextResponse.json({
          error: 'Update not allowed: The member is listed as a parent of one or more children.',
        }, { status: 400 });
      }
    }

    if (existingMember.father || existingMember.mother) {
      return NextResponse.json({
        error: 'Update not allowed: The member is already assigned as a descendant',
      }, { status: 400 });
    }
    const deceased = updatedData.deceased === true; // Handle as a boolean

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

    // Update the member in the database
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: memberUpdateData,
    });



    // Handle `nonDescendantRelation` update if descendant is false
    if (updatedData.descendant === false) {
      await prisma.nonDescendantRelation.upsert({
        where: { memberId: memberId },
        update: {
          fatherName: updatedData.father ? updatedData.father : null,
          motherName: updatedData.mother ? updatedData.mother : null,
          siblingNames: updatedData.siblings ? updatedData.siblings : null,
        },
        create: {
          memberId: memberId,
          fatherName: updatedData.father ? updatedData.father : null,
          motherName: updatedData.mother ? updatedData.mother : null,
          siblingNames: updatedData.siblings ? updatedData.siblings : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember,
    });
  } catch (error: any) {
    console.error('Error updating member:', error);

    if (error.code === 'P2025') {
      // Prisma-specific error for "Record not found"
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}