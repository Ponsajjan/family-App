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
    return NextResponse.json({ error: "Member ID is required and should be a valid number." }, { status: 404 });
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const fetchedData = await prisma.member.findFirst({
      where: {
        id: id,
        authId: authId
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
      verified: dbData.verified, // || dbData.partner?.verified,
      descendant: dbData.descendant,
      partner: dbData.partner,
      childrenData: childrenData,
      pendingVerification: dbData.pendingVerification?.length,
      excludeIds: [
        dbData.id,
        dbData.father?.id,
        dbData.mother?.id,
        dbData.partner?.id,
        dbData.partner?.fatherId,
        dbData.partner?.motherId,
        ...(siblingData?.map((sibling: any) => sibling.id) || []),
        ...(childrenData?.map((child: any) => child.id) || []),
        ...(childrenData?.map((child: any) => child.partnerId) || []),
      ].filter(Boolean), // Remove null/undefined values
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
    const authId = decoded.authId;
    if (!authId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const updatedData: UpdateData = await request.json();
    const currentMember = await prisma.member.findFirst({
      where: {
        id: memberId,
        authId: authId
      },
      select: {
        id: true,
        gender: true,
        fatherOf: {
          select: {
            id: true,
            name: true,
            motherId: true,
            mother: { select: { id: true, name: true } }
          }
        },
        motherOf: {
          select: {
            id: true,
            name: true,
            fatherId: true,
            father: { select: { id: true, name: true } }
          }
        },
        partnerId: true
      }
    });

    if (!currentMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Enhanced Child Validation - Check if children already have parents
    const existingChildren = currentMember?.gender === 'Male' ? currentMember.fatherOf : currentMember.motherOf;
    const newChildIds = [
      ...(updatedData.fatherOf?.map(c => c.id) || []),
      ...(updatedData.motherOf?.map(c => c.id) || [])
    ];

    // Use provided partnerId or fall back to existing partner
    const effectivePartnerId = updatedData.partnerId !== undefined ? updatedData.partnerId : currentMember.partnerId;

    // All children that need to be checked (newly added + existing children if a partner is being added/changed)
    const childrenToCheckIds = [...new Set([
      ...newChildIds,
      ...(updatedData.partnerId ? (existingChildren?.map(c => c.id) || []) : [])
    ])];

    if (childrenToCheckIds.length > 0) {
      const childrenWithParents = await prisma.member.findMany({
        where: {
          id: { in: childrenToCheckIds },
          OR: [
            { fatherId: { not: null } },
            { motherId: { not: null } }
          ]
        },
        select: {
          id: true,
          name: true,
          fatherId: true,
          motherId: true,
          father: { select: { id: true, name: true } },
          mother: { select: { id: true, name: true } }
        }
      });



      // Filter children that have conflicting parents
      const conflictingChildren = childrenWithParents.filter(child => {
        // Determine expected parents for this family unit
        let expectedFatherId: number | null | undefined;
        let expectedMotherId: number | null | undefined;

        if (currentMember.gender === 'Male') {
          expectedFatherId = memberId;
          expectedMotherId = effectivePartnerId;
        } else {
          expectedMotherId = memberId;
          expectedFatherId = effectivePartnerId;
        }

        // Check for conflicts
        // 1. Check Father Conflict
        // We only check if we expect a father (it's part of the new state) AND the child already has a DIFFERENT father
        if (expectedFatherId && child.fatherId && child.fatherId !== expectedFatherId) {
          // Only flag as conflict if this child is actually being touched/added in a way that implies this parentage
          // If we are just adding a child, we imply BOTH parents (if partner exists)
          // If we are changing partner, we imply existing children get new partner

          // If this child is in the 'to be added/updated' list for this operation:
          // - It's in updatedData.fatherOf/motherOf
          // - OR it's an existing child and we are changing partner (which affects the other parent role)
          return true;
        }

        // 2. Check Mother Conflict
        if (expectedMotherId && child.motherId && child.motherId !== expectedMotherId) {
          return true;
        }

        return false;
      });

      if (conflictingChildren.length > 0) {
        const errorMessages = conflictingChildren.map(child => {
          const isMemberMale = currentMember?.gender === 'Male';

          if (isMemberMale) {
            if (child.fatherId && child.fatherId !== memberId && updatedData.fatherOf?.some(c => c.id === child.id)) {
              return `${child.name} already has ${child.father?.name} assigned as father`;
            }
            if (updatedData.partnerId && child.motherId && child.motherId !== updatedData.partnerId) {
              return `${child.name} already has ${child.mother?.name} assigned as mother`;
            }
          } else {
            if (child.motherId && child.motherId !== memberId && updatedData.motherOf?.some(c => c.id === child.id)) {
              return `${child.name} already has ${child.mother?.name} assigned as mother`;
            }
            if (updatedData.partnerId && child.fatherId && child.fatherId !== updatedData.partnerId) {
              return `${child.name} already has ${child.father?.name} assigned as father`;
            }
          }

          return `${child.name} has parent conflict`;
        });

        return NextResponse.json({
          success: false,
          error: Array.from(new Set(errorMessages)).join(', '),
        }, { status: 400 });
      }
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
            authId: authId,
            type: "Add Relationship",
            details: JSON.stringify(newRelationships),
            memberId: memberId,
          },
        });
        return NextResponse.json({
          success: true,
          message: "New relationships added for <b>verification</b>",
        });
      }
      return NextResponse.json({
        success: true,
        message: "No new relationships to update",
      });
    }

    // Update Member (mirror applyHandleAddRelationship)
    const sanitizedUpdateData = {
      ...(updatedData.partnerId !== undefined && { partnerId: updatedData.partnerId }),
      ...(updatedData.fatherOf && {
        fatherOf: { connect: updatedData.fatherOf.map(({ id }) => ({ id })) }
      }),
      ...(updatedData.motherOf && {
        motherOf: { connect: updatedData.motherOf.map(({ id }) => ({ id })) }
      })
    };

    // Use provided partnerId or fall back to existing partner


    await prisma.member.update({
      where: { id: memberId },
      data: sanitizedUpdateData,
    });

    // Batch update children orders
    const childrenUpdates: Promise<any>[] = [];

    if (updatedData.fatherOf) {
      childrenUpdates.push(...updatedData.fatherOf.map(child =>
        prisma.member.update({
          where: { id: child.id },
          data: { order: child.order }
        })
      ));
    }

    if (updatedData.motherOf) {
      childrenUpdates.push(...updatedData.motherOf.map(child =>
        prisma.member.update({
          where: { id: child.id },
          data: { order: child.order }
        })
      ));
    }

    if (childrenUpdates.length > 0) {
      await Promise.all(childrenUpdates);
    }

    // Update partner relationships (with effective partner)
    if (effectivePartnerId) {
      await prisma.member.update({
        where: { id: effectivePartnerId },
        data: {
          partnerId: memberId,
          ...(currentMember.gender === 'Male'
            ? { motherOf: { connect: [...(updatedData.fatherOf?.map(({ id }) => ({ id })) || []), ...(currentMember.fatherOf.map(({ id }) => ({ id })))] } }
            : { fatherOf: { connect: [...(updatedData.motherOf?.map(({ id }) => ({ id })) || []), ...(currentMember.motherOf.map(({ id }) => ({ id })))] } }
          )
        }
      });
    }

    revalidatePath('/api/relatives');

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