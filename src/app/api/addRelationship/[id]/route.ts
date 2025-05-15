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
        partnerships: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                fatherId: true,
                motherId: true,
              }
            }
          }
        },
        partneredWith: {
          select: {
            member: {
              select: {
                id: true,
                name: true,
                fatherId: true,
                motherId: true,
              }
            }
          }
        },
        fatherOf: {
          select: {
            id: true,
            name: true,
            order: true,
          },
          orderBy: {
            order: 'asc'
          }
        },
        motherOf: {
          select: {
            id: true,
            name: true,
            order: true,
          },
          orderBy: {
            order: 'asc'
          }
        },
      }
    });

    if (!fetchedData) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Combine partnerships and partneredWith into a single partners array
    interface Member {
      id: number;
      name: string;
      fatherId: number | null;
      motherId: number | null;
    }
    
    const partnerEntries: [string, Member][] = [
      ...fetchedData.partneredWith.map(
        (p): [string, Member] => [p.member.id.toString(), p.member]
      ),
      ...fetchedData.partnerships.map(
        (p): [string, Member] => [p.partner.id.toString(), p.partner]
      ),
    ];
    
    const partners: Member[] = Array.from(new Map<string, Member>(partnerEntries).values());

    // Extract sibling data
    const siblingData = [
      ...new Set([
        ...(fetchedData.father?.fatherOf || []),
        ...(fetchedData.mother?.motherOf || []),
      ]),
    ].filter(sibling => sibling.id !== id); // Exclude self

    // Get children data based on gender
    const childrenData = fetchedData.gender === 'Male' ? fetchedData.fatherOf : fetchedData.motherOf;

    // Format the data
    const data = {
      id: fetchedData.id,
      name: fetchedData.name,
      gender: fetchedData.gender,
      verified: fetchedData.verified,
      descendant: fetchedData.descendant,
      partners: partners,
      childrenData: childrenData,
      pendingVerification: fetchedData.pendingVerification.length,
      excludeIds: [
        fetchedData.id,
        fetchedData.father?.id,
        fetchedData.mother?.id,
        ...partners.map(partner => partner.id),
        ...partners.flatMap(partner => [partner.fatherId, partner.motherId]),
        ...(siblingData ? siblingData.map((sibling: any) => sibling.id) : []),
        ...(childrenData ? childrenData.map((child: any) => child.id) : []),
      ].filter(Boolean), // Remove null/undefined values
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

interface ChildRelation {
  id: number;
  order?: number;
}

interface UpdateData {
  partners?: number[];
  fatherOf?: ChildRelation[];
  motherOf?: ChildRelation[];
}

export async function PUT(request: Request) {
  try {
    // Authentication & Validation
    const url = new URL(request.url);
    const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (isNaN(memberId)) return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });

    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    if (!forDescendanceOf) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const updatedData: UpdateData = await request.json();

    if (!updatedData || updatedData.partners?.length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }

    // Get current relationships
    const currentMember = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
          gender: true,
          partnerships: { select: { partnerId: true } },
          partneredWith: { select: { memberId: true } },
          fatherOf: { select: { id: true } },
          motherOf: { select: { id: true } }
      }
    });

    if (!currentMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Check if any relationships need verification
    const allIds = [
      memberId,
      ...(updatedData.partners || []),
      ...(updatedData.fatherOf?.map(c => c.id) || []),
      ...(updatedData.motherOf?.map(c => c.id) || [])
    ];

    const verifiedMembers = await prisma.member.findMany({
      where: { id: { in: allIds }, verified: true },
      select: { id: true }
    });

    if (verifiedMembers.length > 0) {
      // Handle verified relationships (create verification requests)
      const newRelationships: Partial<UpdateData> = {};

      // Check for new partners
      const currentPartnerIds = [
          ...currentMember.partnerships.map(p => p.partnerId),
          ...currentMember.partneredWith.map(p => p.memberId)
      ];
      newRelationships.partners = updatedData.partners?.filter(
        partnerId => !currentPartnerIds.includes(partnerId)
      );

      // Check for new children
      newRelationships.fatherOf = updatedData.fatherOf?.filter(
        child => !currentMember.fatherOf.some(c => c.id === child.id)
      );
      newRelationships.motherOf = updatedData.motherOf?.filter(
        child => !currentMember.motherOf.some(c => c.id === child.id)
      );

      if (Object.values(newRelationships).some(v => v && v.length > 0)) {
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

    // Process updates in a transaction
    await prisma.$transaction(async (tx) => {
      // Update partnerships
      if (updatedData.partners) {
        // First, remove existing partnerships
        await tx.partnership.deleteMany({
          where: {
            OR: [
              { memberId: memberId },
              { partnerId: memberId }
            ]
          }
        });

        // Create new partnerships
        await tx.partnership.createMany({
          data: updatedData.partners.flatMap(partnerId => [
            {
              memberId: memberId,
              partnerId: partnerId
            },
            {
              memberId: partnerId,
              partnerId: memberId
            }
          ])
        });
      }

      // Update children relationships and orders
      if (updatedData.fatherOf || updatedData.motherOf) {
        // Determine which parent relationship to update based on gender
        const isMale = currentMember.gender === 'Male';
        const childrenToUpdate = isMale ? updatedData.fatherOf : updatedData.motherOf;

        if (childrenToUpdate) {
          // Update parent-child relationship for current member
          await tx.member.update({
            where: { id: memberId },
            data: {
              [isMale ? 'fatherOf' : 'motherOf']: {
                set: childrenToUpdate.map(({ id }) => ({ id }))
              }
            }
          });

          // Update the partner's parent-child relationship
          if (updatedData.partners?.length) {
            for (const partnerId of updatedData.partners) {
              await tx.member.update({
                where: { id: partnerId },
                data: {
                  [isMale ? 'motherOf' : 'fatherOf']: {
                    set: childrenToUpdate.map(({ id }) => ({ id }))
                  }
                }
              });
            }
          }

          // Update children orders (only once per child)
          const uniqueChildren = childrenToUpdate.filter(
            (child, index, self) => index === self.findIndex(c => c.id === child.id)
          );

          await Promise.all(
            uniqueChildren.map(child => 
              child.order !== undefined 
                ? tx.member.update({
                    where: { id: child.id },
                    data: { order: child.order }
                  })
                : Promise.resolve()
            )
          );
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Member relationships updated successfully",
    });

} catch (error: any) {
    console.error("Update error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ 
      error: "Server error",
      details: error.message 
    }, { status: 500 });
  }
}