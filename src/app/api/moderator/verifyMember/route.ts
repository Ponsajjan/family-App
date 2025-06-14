import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  // Extract search parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Current page
  const limit = parseInt(searchParams.get("limit") || "50", 10); // Page size
  const searchQuery = searchParams.get("search") || ""; // Search term
  const filterQuery = searchParams.get("filter") || "";
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Define the filter condition
    const filterCondition = filterQuery === 'Verified' ? true : filterQuery === 'Unverified' ? false : undefined;

    // Fetch paginated data from Prisma
    const memberList = await prisma.member.findMany({
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
        partner: { select: { name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Total count for pagination
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

    // Return paginated data with headers
    return NextResponse.json({
      data: memberList,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error fetching members" }, { status: 500 });
  }
}