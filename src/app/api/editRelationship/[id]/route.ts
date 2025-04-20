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

    // Check if any member (main member, partner, or children) is verified
    const hasVerified =
      member.verified || // Check if the main member is verified
      (member.partner && member.partner.verified) || // Check if the partner is verified
      children.some((child) => child.verified); // Check if any child is verified

    // Format the data
    const data = {
      id: member.id,
      name: member.name,
      gender: member.gender,
      partner: member.partner,
      children: children,
      pendingVerification: member.pendingVerification?.length,
      hasVerified, // Add hasVerified to the response
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

interface ChildRelation {
  id: number;
  order: number;
}

interface DeleteData {
  partnerId?: number;
  childrenId?: ChildRelation[];
}

interface UpdateRequest {
  deleteData: DeleteData;
  hasPartner?: number | null;
  childrenPrevOrder?: ChildRelation[];
}

export async function PUT(request: Request) {
  // Authentication & Validation
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNaN(memberId)) return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    if (!forDescendanceOf) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { deleteData, hasPartner, childrenPrevOrder } = await request.json() as UpdateRequest;

    if (!deleteData || Object.keys(deleteData).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }

    // Verify member and relationships
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

    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Check verification status
    const hasVerified = [
      member.verified,
      member.partner?.verified,
      ...member.fatherOf.map(c => c.verified),
      ...member.motherOf.map(c => c.verified)
    ].some(Boolean);

    if (hasVerified) {
      await prisma.requestDetails.create({
        data: {
          descendantOf: forDescendanceOf,
          type: "Edit Relationship",
          details: JSON.stringify({ deleteData, hasPartner, childrenPrevOrder }),
          memberId
        }
      });
      return NextResponse.json({ 
        success: true,
        message: "Update request has been added for verification.",
      });
    }

    // Execute updates
    await prisma.$transaction(async (prisma) => {
      // Partner removal
      if (deleteData.partnerId) {
        await prisma.member.updateMany({
          where: { id: { in: [memberId, deleteData.partnerId] } },
          data: { partnerId: null }
        });
      }

      // Children removal
      if (deleteData.childrenId?.length) {
        const childIds = deleteData.childrenId.map(c => c.id);
        const uniqueIds = [...new Set(childIds)];

        const updates = [
          prisma.member.update({
            where: { id: memberId },
            data: {
              fatherOf: { disconnect: uniqueIds.map(id => ({ id })) },
              motherOf: { disconnect: uniqueIds.map(id => ({ id })) }
            }
          })
        ];

        if (hasPartner && !deleteData.partnerId) {
          updates.push(
            prisma.member.update({
              where: { id: hasPartner },
              data: {
                fatherOf: { disconnect: uniqueIds.map(id => ({ id })) },
                motherOf: { disconnect: uniqueIds.map(id => ({ id })) }
              }
            })
          );
        }

        await Promise.all(updates);
      }

      // Children order updates
      if (childrenPrevOrder?.length) {
        await Promise.all(
          childrenPrevOrder.map((child, index) => 
            prisma.member.update({
              where: { id: child.id },
              data: { order: index + 1 }
            })
          )
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: "Member updated successfully"
    });

  } catch (error: any) {
    console.error("Update error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}