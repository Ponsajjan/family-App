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

  // Validate memberId
  if (isNaN(memberId)) {
    return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
  }

  try {
    const deleteData = await request.json();

    // Validate request body
    if (!deleteData || Object.keys(deleteData).length === 0) {
      return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
    }

    // Start processing updates
    const updatePromises: Promise<any>[] = [];

    // Handle partner removal
    if (deleteData.partnerId) {
      const partnerId = deleteData.partnerId;

      updatePromises.push(
        prisma.$transaction([
          prisma.member.update({
            where: { id: partnerId },
            data: { partnerId: null },
          }),
          prisma.member.update({
            where: { id: memberId },
            data: { partnerId: null },
          }),
        ])
      );
    }

    // Handle children relations removal
    if (deleteData.childrenId) {
      const removeChildRelation:number[] = Array.from(new Set(deleteData.childrenId)); // Deduplicate

      updatePromises.push(
        Promise.all(
          removeChildRelation.map((childId) =>
            prisma.member.update({
              where: { id: childId },
              data: { fatherId: null, motherId: null },
            })
          )
        )
      );
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating member:', error);

    // Handle specific Prisma error codes
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
