import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

let memberListCurrentLetter = "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skip = (page - 1) * limit;

  if (page === 1) {
    memberListCurrentLetter = "";
  }
  // Parse excludeId to a number array
  const excludeIdParam = searchParams.get("excludeId");
  const excludeId = excludeIdParam
    ? excludeIdParam.split(",").map(Number).filter(Boolean)
    : [];

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId;
    
    if (!forDescendanceOf || !mainMemberId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch members with their partnerships
    const members = await prisma.member.findMany({
      where: {
        name: {
          contains: searchQuery,
          // mode: "insensitive", // PostgreSQL-specific support in Prisma
        },
        descendantOf: forDescendanceOf,
        id: { notIn: excludeId },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        father: { select: { name: true } },
        mother: { select: { name: true } },
        partnerships: {
          select: {
            partner: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    // Format members with their partners
    const formattedMembers = members.map(member => ({
      ...member,
      partner: member.partnerships[0]?.partner || null
    }));

    // Add alphabetical grouping
    const groupedData: any[] = [];

    formattedMembers.forEach(member => {
      const firstLetter = member.name.charAt(0).toUpperCase();
      
      if (firstLetter !== memberListCurrentLetter) {
        memberListCurrentLetter = firstLetter;
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          phoneNumber: null,
          father: null,
          mother: null,
          partner: null,
        });
      }

      groupedData.push(member);
    });

    const totalCount = await prisma.member.count({
      where: {
        name: { contains: searchQuery },
        descendantOf: forDescendanceOf,
      },
    });

    return NextResponse.json({
      data: groupedData,
      totalCount,
    });

  } catch (error) {
    console.error("Error fetching memberList:", error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error fetching memberList" }, { status: 500 });
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

    const updatedData: UpdateData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
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
          data: updatedData.partners.flatMap((partnerId: number) => [
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
        const isMale = currentMember?.gender === 'Male';
        const childrenToUpdate = isMale ? updatedData.fatherOf : updatedData.motherOf;

        if (childrenToUpdate) {
          // Update parent-child relationship for current member
          await tx.member.update({
            where: { id: memberId },
            data: {
              [isMale ? 'fatherOf' : 'motherOf']: {
                set: childrenToUpdate.map(({ id }: {id: number}) => ({ id }))
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
                    set: childrenToUpdate.map(({ id }: {id: number}) => ({ id }))
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
      message: "Member updated successfully",
    });

  } catch (error: any) {
    console.error("Error updating member:", error);

    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}