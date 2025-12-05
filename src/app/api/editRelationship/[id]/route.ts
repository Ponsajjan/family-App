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
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const dbData: any = await prisma.member.findUnique({
      where: {
        id: id,
        authId: authId
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
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { deleteData, hasPartner, childrenOrder } = await request.json();

    // Check if any of the members are verified
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        authId: authId
      },
      select: {
        name: true,
        gender: true,
        verified: true,
        partner: {
          select: {
            id: true,
            verified: true,
          },
        },
        fatherOf: {
          select: {
            id: true,
            verified: true,
          },
        },
        motherOf: {
          select: {
            id: true,
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
          authId: authId,
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

    // Get all children of the member to determine custody split
    const memberChildren = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        fatherOf: { select: { id: true } },
        motherOf: { select: { id: true } }
      }
    });

    const allMemberChildren = [
      ...(memberChildren?.fatherOf?.map(child => child.id) || []),
      ...(memberChildren?.motherOf?.map(child => child.id) || [])
    ];

    // Handle partner removal (divorce)
    if (deleteData.partnerId) {
      // Remove partner from member
      updatePromises.push(
        prisma.member.update({
          where: { id: deleteData.partnerId },
          data: { partnerId: null },
        }),
      );
      // Remove member from partner
      updatePromises.push(
        prisma.member.update({
          where: { id: memberId },
          data: { partnerId: null },
        }),
      );

      // If no children specified during divorce, keep all children with both parents
      // Children maintain relationships with both parents after divorce

      // Custody split during divorce (only if children specified)
      if (deleteData.childrenId.length > 0 && Array.isArray(deleteData.childrenId)) {
        const memberRemovedChildren: number[] = Array.from(new Set(deleteData.childrenId)); // Children removed from member
        const memberKeptChildren: number[] = allMemberChildren.filter(childId => !memberRemovedChildren.includes(childId)); // Children kept by member

        // Remove specified children from MEMBER (member loses custody)
        if (memberRemovedChildren.length > 0) {
          updatePromises.push(
            prisma.member.update({
              where: { id: memberId },
              data: {
                fatherOf: {
                  disconnect: memberRemovedChildren.map((childId) => ({ id: childId })),
                },
                motherOf: {
                  disconnect: memberRemovedChildren.map((childId) => ({ id: childId })),
                },
              },
            })
          );
        }

        // Remove kept children from PARTNER (partner loses custody of the ones member keeps)
        if (memberKeptChildren.length > 0) {
          updatePromises.push(
            prisma.member.update({
              where: { id: deleteData.partnerId },
              data: {
                fatherOf: {
                  disconnect: memberKeptChildren.map((childId) => ({ id: childId })),
                },
                motherOf: {
                  disconnect: memberKeptChildren.map((childId) => ({ id: childId })),
                },
              },
            })
          );
        }
      }
    } else {
      // Handle children relations removal (NOT during divorce)
      if (deleteData.childrenId.length > 0 && Array.isArray(deleteData.childrenId)) {
        const removeChildRelation: number[] = Array.from(new Set(deleteData.childrenId)); // Deduplicate

        // Update the member's fatherOf and motherOf relationships (remove child from member)
        updatePromises.push(
          prisma.member.update({
            where: { id: memberId },
            data: {
              fatherOf: { disconnect: removeChildRelation.map((childId) => ({ id: childId })), },
              motherOf: { disconnect: removeChildRelation.map((childId) => ({ id: childId })), },
            },
          })
        );

        // Update the partner's fatherOf and motherOf relationships (remove child from partner)
        if (hasPartner) {
          updatePromises.push(
            prisma.member.update({
              where: { id: hasPartner },
              data: {
                fatherOf: { disconnect: removeChildRelation.map((childId) => ({ id: childId })) },
                motherOf: { disconnect: removeChildRelation.map((childId) => ({ id: childId })) },
              },
            })
          );
        }
      }
    }

    // Handle children order updates
    if (childrenOrder && Array.isArray(childrenOrder)) {
      updatePromises.push(
        ...childrenOrder.map((child, index) =>
          prisma.member.update({
            where: { id: child.id },
            data: { order: index + 1 },
          })
        )
      );
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