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
          id : id,
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

  // Ensure valid `memberId`
  if (isNaN(memberId)) {
    return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
  }

  try {
    // Parse the JSON body
    const updatedData = await request.json();

    console.log('updatedData', updatedData)

    // Validate the request body
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
    }

    // Update the member in the database
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updatedData,
    });

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