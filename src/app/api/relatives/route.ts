import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

let currentLetter = "";

export async function GET(request: NextRequest) {
  // Extract search parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const searchQuery = searchParams.get("search") || "";

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

    if (page === 1) {
      currentLetter = "";
    }

    // Fetch members with their relationships
    const members = await prisma.member.findMany({
      where: {
        descendantOf: forDescendanceOf,
        name: {
          contains: searchQuery,
          // mode: "insensitive", // PostgreSQL-specific support in Prisma
        },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        verified: true,
        father: { select: { name: true } },
        mother: { select: { name: true } },
        partnerships: {
          select: {
            partner: {
              select: {
                id: true,
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

    // Format the data with unique partners
    const formattedMembers = members.map(member => ({
      ...member,
      partners: [...new Set(
        member.partnerships.map(p => p.partner.name)
      )]
    }));

    // Add alphabetical section headers
    const groupedData: any[] = [];

    formattedMembers.forEach(member => {
      const firstLetter = member.name.charAt(0).toUpperCase();
      
      if (firstLetter !== currentLetter) {
        currentLetter = firstLetter;
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          phoneNumber: null,
          father: null,
          mother: null,
          partners: [],
        });
      }

      groupedData.push(member);
    });

    // Get total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        descendantOf: forDescendanceOf,
        name: { contains: searchQuery },
      },
    });

    return NextResponse.json({
      data: groupedData,
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