import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '');
  const token = request.cookies.get("token")?.value;

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

    const dbData: any = await prisma.member.findUnique({
      where: {
        id: id,
        descendantOf: forDescendanceOf
      },
      select: {
        id: true,
        name: true,
        gender: true,
        verified: true,
        pendingVerification: {
          where: {
            type: "Edit Relationship"
          }
        },
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

    const member = dbData;

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Get children values
    const children = member.fatherOf.length > 0 ? member.fatherOf : member.motherOf.length > 0 ? member.motherOf : [];

    // Sort children by order
    if (children && Array.isArray(children)) {
      children.sort((a, b) => a.order - b.order);
    }

    // Check if any member (main member, partner, or children) is verified
    const hasVerified =
      member.verified || // Check if the main member is verified
      (member.partner && member.partner.verified) || // Check if the partner is verified
      children.some((child: any) => child.verified); // Check if any child is verified

    // Format the data
    const data = {
      id: member.id,
      name: member.name,
      gender: member.gender,
      partner: member.partner,
      children: children,
      pendingVerification: member.pendingVerification?.length,
      hasVerified,
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
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { deleteData, hasPartner, childrenOrder } = await request.json();

    // Check if any of the members are verified
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        descendantOf: forDescendanceOf
      },
      select: {
        name: true,
        gender: true,
        verified: true,
        partner: {
          select: {
            verified: true,
          },
        },
        fatherOf: {
          select: {
            verified: true,
          },
        },
        motherOf: {
          select: {
            verified: true,
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

    // Check if any member (main member, partner, or children) is verified
    const hasVerified =
      member?.verified || // Check if the main member is verified
      member?.partner?.verified || // Check if the partner is verified
      member?.fatherOf.some((child) => child.verified) || // Check if any child in fatherOf is verified
      member?.motherOf.some((child) => child.verified); // Check if any child in motherOf is verified

    // If any verified members are found, add the update request to pending verification
    if (hasVerified) {
      await prisma.requestDetails.create({
        data: {
          descendantOf: forDescendanceOf,
          type: "Edit Relationship", // Type of request
          details: JSON.stringify({ deleteData, hasPartner, childrenOrder }), // Store the update data as a JSON string
          memberId: memberId, // Associate the request with the main member
        },
      });

      return NextResponse.json({
        success: true,
        message: "Update request has been added for verification.",
      });
    }

    // If no verified members are involved, proceed with the update logic

    // Start processing updates
    const updatePromises: Promise<any>[] = [];

    // Handle partner removal
    if (deleteData.partnerId) {
      updatePromises.push(
        prisma.$transaction([
          prisma.member.update({
            where: { id: deleteData.partnerId },
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
    if (deleteData.childrenId.length > 0 && Array.isArray(deleteData.childrenId)) {
      const removeChildRelation: number[] = Array.from(new Set(deleteData.childrenId)); // Deduplicate

      // Update the member's fatherOf and motherOf relationships (remove child from member)
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

      // Update the partner's fatherOf and motherOf relationships (remove child from partner)
      if (hasPartner && !deleteData.partnerId) {
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

    revalidatePath('/api/relatives');
    revalidatePath('/api/calendar/[month]/[year]');
    revalidatePath('/api/relatives/[id]');
    revalidatePath('/tree');

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