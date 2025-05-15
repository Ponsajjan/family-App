import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '');
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "Member ID is required and should be a valid number." }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const dbData = await prisma.member.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        verified: true,
        partnerships: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                verified: true,
              }
            }
          }
        },
        fatherOf: {
          select: {
            id: true,
            name: true,
            verified: true,
            order: true,
          },
          orderBy: { order: 'asc' }
        },
        motherOf: {
          select: {
            id: true,
            name: true,
            verified: true,
            order: true,
          },
          orderBy: { order: 'asc' }
        },
      },
    });

    const member = dbData[0];

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Get partner from first partnership (if exists)
    const partners = member.partnerships.map((p) => p.partner) || null;

    // Combine fatherOf and motherOf children
    const children = member.fatherOf.length > 0 ? member.fatherOf : member.motherOf.length > 0 ? member.motherOf : [];

    // Format the data
    const data = {
      id: member.id,
      name: member.name,
      gender: member.gender,
      partners,
      children: children,
      pendingVerification: 0,
      hasVerified: false, // Set to false to allow editing
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { deleteData, hasPartner, childrenOrder } = await request.json();

    // Validate request body
    if (!deleteData || Object.keys(deleteData).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }

    // Start processing updates
    const updatePromises: Promise<any>[] = [];

    // Handle partnership removal
    if (deleteData.partnersId?.length) {
      // Delete all partnerships between memberId and any partner in the partnersId array
      updatePromises.push(
        prisma.partnership.deleteMany({
          where: {
            OR: [
              // Member is in memberId position
              {
                memberId: memberId,
                partnerId: { in: deleteData.partnersId }
              },
              // Member is in partnerId position
              {
                memberId: { in: deleteData.partnersId },
                partnerId: memberId
              }
            ]
          }
        })
      );
    }

    // Handle children relations removal
    if (deleteData.childrenId?.length > 0) {
      const childrenIds: number[] = Array.from(new Set(deleteData.childrenId));

      updatePromises.push(
        prisma.member.update({
          where: { id: memberId },
          data: {
            fatherOf: { disconnect: childrenIds.map(id => ({ id })) },
            motherOf: { disconnect: childrenIds.map(id => ({ id })) }
          }
        })
      );

      // Also disconnect from partner if exists
      if (hasPartner?.length && !deleteData.partnersId?.length) {
        // Disconnect children from all partners in the hasPartner list
        await Promise.all(
          hasPartner.map((partnerId: number) => 
            prisma.member.update({
              where: { id: partnerId },
              data: {
                fatherOf: { disconnect: childrenIds.map(id => ({ id })) },
                motherOf: { disconnect: childrenIds.map(id => ({ id })) }
              }
            })
          )
        );
      }
    }

    // Handle children order update
    if (childrenOrder?.length > 0) {
      childrenOrder.forEach((child: { id: number, order: number }) => {
        updatePromises.push(
          prisma.member.update({
            where: { id: child.id },
            data: { order: child.order }
          })
        );
      });
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating member:", error);

    // Handle token verification errors
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Handle specific Prisma error codes
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}