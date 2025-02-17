import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');
    
    if (!id) {
      return NextResponse.json({ error: "Member ID is required and should be a valid number." });
    }

    try {
      const fetchedData = await prisma.member.findMany({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          gender: true,
          descendant: true,
          father: {
            select: {
              id: true,
              fatherOf: true
            },
          },
          mother: {
            select: {
              id: true,
              motherOf: true
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              fatherId: true,
              motherId: true
            },
          }, 
          fatherOf: {
            select: {
              id: true,
              name: true,
              partnerId: true,
            },
          },
          motherOf: {
            select: {
              id: true,
              name: true,
              partnerId: true
            },
          },
        },
      });

      const dbData = fetchedData[0];
      // Extract sibling and children data
      const siblingData = [new Set([
        ...(Array.isArray(dbData.father?.fatherOf) ? dbData.father.fatherOf : []),
        ...(Array.isArray(dbData.mother?.motherOf) ? dbData.mother.motherOf : []),
      ])];
      const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;
      const inLaw = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

      // Format the data
      const data = {
        id: dbData.id,
        name: dbData.name,
        gender: dbData.gender,
        descendant: dbData.descendant,
        partner: dbData.partner,
        childrenData: childrenData,
        excludeIds: [
          dbData?.id ? dbData.id : null,
          dbData.father?.id ? dbData.father?.id : null,
          dbData.mother?.id ? dbData.mother?.id : null,
          dbData.partner?.id ? dbData.partner.id : null,
          dbData.partner?.fatherId ? dbData.partner?.fatherId : null,
          dbData.partner?.motherId ? dbData.partner?.motherId : null,
          ...(siblingData ? siblingData.map((sibling: any) => sibling.id) : []),
          ...(childrenData ? childrenData.map((child: any) => child.id) : []),
          ...(inLaw ? childrenData.map((child: any) => child.partnerId) : []),
        ].filter(Boolean), // Remove null values from the array // also need to include the logged in Sembahalingum's ID to exclude from the list

      };
      return NextResponse.json({ data });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch data" });
    }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);

  // Ensure valid memberId
  if (isNaN(memberId)) {
    return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
  }

  try {
    const updatedData = await request.json(); // Parse the JSON body

    if (!updatedData || Object.keys(updatedData).length === 0) { // Ensure data is provided
      return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
    }

    // Update the member in the database
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updatedData,
    });

    // Handle updating the partner's relationships
    if (updatedData.partnerId) {
      const partnerUpdateData: any = {};
      
      partnerUpdateData.partnerId = memberId;
      if (updatedData.fatherOf) {
        partnerUpdateData.motherOf = updatedData.fatherOf;
      } 
      if (updatedData.motherOf) {
        partnerUpdateData.fatherOf = updatedData.motherOf;
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