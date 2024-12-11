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
      const data = await prisma.member.findMany({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
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
          additionalInfo: true,
          descendant: true,
          partnerId: true,
          fatherId: true,
          motherId: true,
          fatherOf: true,
          motherOf: true,
          partnersRelation: {
            select: {
              id: true,
              fatherName: true,
              motherName: true,
              SiblingsNames: true,
            },
          },
        },
      });

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
    // Parse the JSON body
    const updatedData = await request.json();

    console.log('updatedData', updatedData);

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



    // Handle `partnersRelation` update if descendant is false
    if (updatedData.descendant === false) {
      await prisma.partnersRelation.upsert({
        where: { memberId: memberId },
        update: {
          fatherName: updatedData.fatherName || null,
          motherName: updatedData.motherName || null,
          SiblingsNames: updatedData.siblingName || null,
        },
        create: {
          memberId: memberId,
          fatherName: updatedData.fatherName || null,
          motherName: updatedData.motherName || null,
          SiblingsNames: updatedData.siblingName || null,
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