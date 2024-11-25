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
          father: {
            select: {
              id: true,
              name: true,
            },
          },
          mother: {
            select: {
              id: true,
              name: true,
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
            },
          },
          fatherOf: {
            select: {
              id: true,
              name: true, // Fetch only id and name of the children if the member is a father
            },
          },
          motherOf: {
            select: {
              id: true,
              name: true, // Fetch only id and name of the children if the member is a mother
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

    // Prepare the update data for the member
    const updateData: any = { ...updatedData };

    // Handle member's children relationships dynamically
    if (updatedData.gender === "Male" && updatedData.fatherOf) {
      updateData.fatherOf = {
        connect: updatedData.fatherOf.map((childId: number) => ({ id: childId })),
      };
    } else if (updatedData.gender === "Female" && updatedData.motherOf) {
      updateData.motherOf = {
        connect: updatedData.motherOf.map((childId: number) => ({ id: childId })),
      };
    }

    // Update the member in the database
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updateData,
    });

    // Handle updating the partner's relationships
    if (updatedData.partnerId) {
      const partnerUpdateData: any = {};

      if (updatedData.gender === "Male" && updatedData.fatherOf) {
        partnerUpdateData.motherOf = {
          connect: updatedData.fatherOf.map((childId: number) => ({ id: childId })),
        };
      } else if (updatedData.gender === "Female" && updatedData.motherOf) {
        partnerUpdateData.fatherOf = {
          connect: updatedData.motherOf.map((childId: number) => ({ id: childId })),
        };
      }

      if (Object.keys(partnerUpdateData).length > 0) {
        await prisma.member.update({
          where: { id: updatedData.partnerId },
          data: partnerUpdateData,
        });
      }
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