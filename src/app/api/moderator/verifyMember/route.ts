import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { prioritizeSearchResults } from "@/utils/searchUtils";

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
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Define the filter condition
    const filterCondition = filterQuery === 'Verified' ? true : filterQuery === 'Unverified' ? false : undefined;

    // Fetch paginated data from Prisma
    const memberList = await prisma.member.findMany({
      where: {
        authId: authId,
        ...(filterCondition !== undefined && { verified: filterCondition }),
        name: {
          contains: searchQuery,
          mode: "insensitive", // PostgreSQL-specific support in Prisma
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
    
    // Prioritize results starting with the search query
    prioritizeSearchResults(memberList, searchQuery, (m) => m.name);

    // Total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        authId: authId,
        ...(filterCondition !== undefined && { verified: filterCondition }),
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    });

    const auth = await prisma.auth.findUnique({
      where: { id: authId },
      select: { mainMemberId: true },
    });

    // Return paginated data with headers
    return NextResponse.json({
      data: memberList,
      totalCount,
      mainMemberId: auth?.mainMemberId ?? null,
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