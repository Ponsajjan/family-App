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
      return NextResponse.json({ error: "Member ID is required and should be a valid number." });
    }

    try {
      const decoded = await verifyToken(token);
      const forDescendanceOf = decoded.forDescendanceOf;

      if (!forDescendanceOf) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const fetchedData = await prisma.member.findMany({
        where: {
          id: id,
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

      const dbData = fetchedData[0];

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
        verified: dbData.verified,
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
      return NextResponse.json({ error: "Failed to fetch data" });
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

    const updatedData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    // Extract IDs from payload
    const idsToCheck: number[] = [];

    if (updatedData.partnerId) {
      idsToCheck.push(updatedData.partnerId);
    }
    if (updatedData.fatherOf?.connect) {
      updatedData.fatherOf.connect.forEach((item: { id: number }) => idsToCheck.push(item.id));
    }
    if (updatedData.motherOf?.connect) {
      updatedData.motherOf.connect.forEach((item: { id: number }) => idsToCheck.push(item.id));
    }
    idsToCheck.push(memberId)
    
    // Remove duplicate IDs using a Set
    const uniqueIdsToCheck = Array.from(new Set(idsToCheck));

    // Check if any of the IDs belong to verified members
    const hasVerifiedMembers = await prisma.member.findMany({
      where: {
        id: { in: uniqueIdsToCheck },
        verified: true,
      },
      select: {
        id: true,
      },
    });

    // Get current member data including relationships
    const currentMember = await prisma.member.findUnique({
      where: {
        id: memberId,
        descendantOf: forDescendanceOf
      },
      select: {
        fatherOf: true,
        motherOf: true,
        partnerId: true,
      },
    });

    if (!currentMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Check if member is verified
    if (hasVerifiedMembers.length > 0) {
      // Filter only new relationships that don't exist currently
      const newRelationships: any = {};
      
      newRelationships.partnerId = updatedData.partnerId;

      // Check for new fatherOf relationships
      if (updatedData.fatherOf?.connect) {
        const currentFatherOfIds = currentMember.fatherOf.map(f => f.id);
        const newFatherOf = updatedData.fatherOf.connect.filter(
          (child: { id: number }) => !currentFatherOfIds.includes(child.id)
        );
        if (newFatherOf.length > 0) {
          newRelationships.fatherOf = { connect: newFatherOf };
        }
      }

      // Check for new motherOf relationships
      if (updatedData.motherOf?.connect) {
        const currentMotherOfIds = currentMember.motherOf.map(m => m.id);
        const newMotherOf = updatedData.motherOf.connect.filter(
          (child: { id: number }) => !currentMotherOfIds.includes(child.id)
        );
        if (newMotherOf.length > 0) {
          newRelationships.motherOf = { connect: newMotherOf };
        }
      }

      // If there are new relationships, create verification request
      if (Object.keys(newRelationships).length > 0) {
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

    // If member is not verified, proceed with direct update
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updatedData,
    });

    // Function to update the order of children
    const updateChildrenOrder = async (childrenIds: { id: number }[]) => {
      for (let i = 0; i < childrenIds.length; i++) {
        const childId = childrenIds[i].id;
        await prisma.member.update({
          where: { id: childId },
          data: {
            order: i + 1, // Update the order based on the sequence
          },
        });
      }
    };

    // Handle updating the partner's relationships and children's order
    if (updatedData.partnerId) {
      const partnerUpdateData: any = {};

      partnerUpdateData.partnerId = memberId;
      if (updatedData.fatherOf) {
        partnerUpdateData.motherOf = updatedData.fatherOf;
        await updateChildrenOrder(updatedData.fatherOf.connect);
      }

      if (updatedData.motherOf) {
        partnerUpdateData.fatherOf = updatedData.motherOf;
        await updateChildrenOrder(updatedData.motherOf.connect);
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
      message: "Member updated successfully",
      data: updatedMember,
    });

  } catch (error: any) {
    console.error("Error updating member:", error);

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}