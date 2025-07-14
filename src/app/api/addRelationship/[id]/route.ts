import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');

    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Member ID is required and should be a valid number." }, { status: 404 });
    }

    try {
      const decoded = await verifyToken(token);
      const forDescendanceOf = decoded.forDescendanceOf;

      if (!forDescendanceOf) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const fetchedData = await prisma.member.findUnique({
        where: {
          id: id,
        descendantOf: forDescendanceOf
        },
        select: {
          id: true,
          name: true,
          gender: true,
          verified: true,
          descendant: true,
          pendingVerification: {
            where: {
              type: "Add Relationship"
            }
          },
          father: {
            select: {
              id: true,
              fatherOf: true,
            },
          },
          mother: {
            select: {
              id: true,
              motherOf: true,
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              verified: true,
              fatherId: true,
              motherId: true,
            },
          },
          fatherOf: {
            select: {
              id: true,
              name: true,
              partnerId: true,
              order: true,
            },
          },
          motherOf: {
            select: {
              id: true,
              name: true,
              partnerId: true,
              order: true,
            },
          },
        },
      });

      if (!fetchedData) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }

      const dbData = fetchedData;

      // Extract sibling and children data
      const siblingData = [
        ...new Set([
          ...(Array.isArray(dbData.father?.fatherOf) ? dbData.father.fatherOf : []),
          ...(Array.isArray(dbData.mother?.motherOf) ? dbData.mother.motherOf : []),
        ]),
      ];

      // Get children data based on gender
      const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

      // Sort childrenData by order
      if (childrenData && Array.isArray(childrenData)) {
        childrenData.sort((a, b) => a.order - b.order);
      }

      // Format the data
      const data = {
        id: dbData.id,
        name: dbData.name,
        gender: dbData.gender,
        verified: dbData.verified || dbData.partner?.verified,
        descendant: dbData.descendant,
        partner: dbData.partner,
        childrenData: childrenData,
        pendingVerification: dbData.pendingVerification?.length,
        excludeIds: [
          dbData?.id ? dbData.id : null,
          dbData.father?.id ? dbData.father?.id : null,
          dbData.mother?.id ? dbData.mother?.id : null,
          dbData.partner?.id ? dbData.partner.id : null,
          dbData.partner?.fatherId ? dbData.partner?.fatherId : null,
          dbData.partner?.motherId ? dbData.partner?.motherId : null,
          ...(siblingData ? siblingData.map((sibling: any) => sibling.id) : []),
          ...(childrenData ? childrenData.map((child: any) => child.id) : []),
          ...(childrenData ? childrenData.map((child: any) => child.partnerId) : []),
        ].filter(Boolean), // Remove null values from the array
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

interface ChildRelation {
  id: number;
  order?: number;
}

interface UpdateData {
  partnerId?: number;
  fatherOf?: ChildRelation[];
  motherOf?: ChildRelation[];
}

export async function PUT(request: NextRequest) {
  try {
    // Authentication & Validation
    const url = new URL(request.url);
    const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
    const token = request.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (isNaN(memberId)) return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });

    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    if (!forDescendanceOf) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const updatedData: UpdateData = await request.json();
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Relationship Validation
    const allIds = [
      memberId,
      ...(updatedData.partnerId ? [updatedData.partnerId] : []),
      ...(updatedData.fatherOf?.map(c => c.id) || []),
      ...(updatedData.motherOf?.map(c => c.id) || [])
    ];

    const verifiedMembers = await prisma.member.findMany({
      where: { id: { in: allIds }, verified: true },
      select: { id: true }
    });

    const currentMember = await prisma.member.findUnique({
      where: { 
        id: memberId, 
        descendantOf: forDescendanceOf 
      },
      select: { 
        fatherOf: { select: { id: true } }, 
        motherOf: { select: { id: true } }, 
        partnerId: true }
    });

    if (!currentMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    
    if (!currentMember.partnerId && !updatedData.partnerId) {
      return NextResponse.json({ error: "Partner not defined" }, { status: 400 })
    }

    // Handle Verified Relationships
    if (verifiedMembers.length > 0) {
      const newRelationships: Partial<UpdateData> = {};

      newRelationships.partnerId = updatedData.partnerId;


      const getNewRelationships = (currentIds: number[], updated?: ChildRelation[]) => 
        updated?.filter(child => !currentIds.includes(child.id)) || [];

      newRelationships.fatherOf = getNewRelationships(
        currentMember.fatherOf.map(f => f.id),
        updatedData.fatherOf
      );

      newRelationships.motherOf = getNewRelationships(
        currentMember.motherOf.map(m => m.id),
        updatedData.motherOf
      );

      if (Object.values(newRelationships).some(Boolean)) {
        await prisma.requestDetails.create({
          data: {
            descendantOf: forDescendanceOf,
            type: "Add Relationship",
            details: JSON.stringify(newRelationships),
            memberId: memberId,
          },
        });
        return NextResponse.json({ 
          success: true,
          message: "New relationships added for verification",
        });
      }
      return NextResponse.json({ 
        success: true,
        message: "No new relationships to update",
      });
    }

    // Update Member
    const sanitizedUpdateData = {
      ...(updatedData.partnerId !== undefined && { partnerId: updatedData.partnerId }),
      ...(updatedData.fatherOf && { 
        fatherOf: { connect: updatedData.fatherOf.map(({ id }) => ({ id })) }
      }),
      ...(updatedData.motherOf && { 
        motherOf: { connect: updatedData.motherOf.map(({ id }) => ({ id })) }
      })
    };

    await prisma.$transaction([
      prisma.member.update({
        where: { id: memberId },
        data: sanitizedUpdateData,
      }),
      ...(updatedData.fatherOf || []).map(({ id, order }) => 
        prisma.member.update({ where: { id }, data: { order } })
      ),
      ...(updatedData.motherOf || []).map(({ id, order }) => 
        prisma.member.update({ where: { id }, data: { order } })
      ),
      ...(updatedData.partnerId ? [prisma.member.update({
        where: { id: updatedData.partnerId },
        data: { 
          partnerId: memberId,
          ...(updatedData.fatherOf && { motherOf: { connect: updatedData.fatherOf.map(({ id }) => ({ id })) } }),
          ...(updatedData.motherOf && { fatherOf: { connect: updatedData.motherOf.map(({ id }) => ({ id })) } })
        }
      })] : [])
    ]);

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
    });

  } catch (error: any) {
    console.error("Update error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}