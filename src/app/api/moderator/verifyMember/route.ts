import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  // Extract search parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const searchQuery = searchParams.get("search") || "";
  const filterQuery = searchParams.get("filter") || "";

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const skip = (page - 1) * limit;
    const filterCondition = filterQuery === 'Verified' ? true : 
                          filterQuery === 'Unverified' ? false : 
                          undefined;

    // Fetch members with their relationships
    const members = await prisma.member.findMany({
      where: {
        descendantOf: forDescendanceOf,
        ...(filterCondition !== undefined && { verified: filterCondition }),
        name: {
          contains: searchQuery,
          // mode: "insensitive", // PostgreSQL-specific support in Prisma
        },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        verified: true,
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
        },
        partneredWith: {
          select: {
            member: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    });

    // Format the data with combined partners
    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.name,
      gender: member.gender,
      verified: member.verified,
      father: member.father,
      mother: member.mother,
      partners: [
        ... new Set([
          ...member.partnerships.map(p => p.partner.name),
          ...member.partneredWith.map(p => p.member.name)
        ])
      ],
    }));

    // Get total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        descendantOf: forDescendanceOf,
        ...(filterCondition !== undefined && { verified: filterCondition }),
        name: {
          contains: searchQuery,
          // mode: "insensitive",
        },
      },
    });

    return NextResponse.json({
      data: formattedMembers,
      totalCount,
    });

  } catch (error) {
    console.error("Error fetching members:", error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Error fetching members" }, 
      { status: 500 }
    );
  }
}