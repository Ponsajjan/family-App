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
        partner: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        fatherOf: {
          select: {
            id: true,
            name: true,
            verified: true,
            order: true,
          },
        },
        motherOf: {
          select: {
            id: true,
            name: true,
            verified: true,
            order: true,
          },
        },
      },
    });

    const member = dbData[0];

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Combine fatherOf and motherOf children
    const children = member.fatherOf.length > 0 ? member.fatherOf : member.motherOf.length > 0 ? member.motherOf : [];

    // Sort children by order
    if (children && Array.isArray(children)) {
      children.sort((a, b) => a.order - b.order);
    }

    // Format the data
    const data = {
      id: member.id,
      name: member.name,
      gender: member.gender,
      partner: member.partner,
      children: children,
      pendingVerification: 0,
      hasVerified: false,
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

    // Handle partner removal
    if (deleteData.partnerId) {
      const partnerIdToRemove = deleteData.partnerId;

      updatePromises.push(
        prisma.$transaction([
          prisma.member.update({
            where: { id: partnerIdToRemove },
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
    if (deleteData.childrenId && Array.isArray(deleteData.childrenId)) {
      const removeChildRelation: number[] = Array.from(new Set(deleteData.childrenId)); // Deduplicate

      // Update the member's fatherOf and motherOf relationships
      updatePromises.push(
        prisma.member.update({
          where: { id: memberId },
          data: {
            // Remove children from fatherOf if it exists
            fatherOf: {
              disconnect: removeChildRelation.map((childId) => ({ id: childId })),
            },
            // Remove children from motherOf if it exists
            motherOf: {
              disconnect: removeChildRelation.map((childId) => ({ id: childId })),
            },
          },
        })
      );

      // Update the partner's fatherOf and motherOf relationships (if partner exists)
      if (hasPartner !== null && hasPartner !== undefined && !deleteData.partnerId) {
        updatePromises.push(
          prisma.member.update({
            where: { id: hasPartner },
            data: {
              // Remove children from fatherOf if it exists
              fatherOf: {
                disconnect: removeChildRelation.map((childId) => ({ id: childId })),
              },
              // Remove children from motherOf if it exists
              motherOf: {
                disconnect: removeChildRelation.map((childId) => ({ id: childId })),
              },
            },
          })
        );
      }
    }

    // Handle children order update
    if (childrenOrder && Array.isArray(childrenOrder)) {
      for (let i = 0; i < childrenOrder.length; i++) {
        const child = childrenOrder[i];
        updatePromises.push(
          prisma.member.update({
            where: { id: child.id },
            data: { order: i + 1 }, // Update the order based on the position in the array
          })
        );
      }
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