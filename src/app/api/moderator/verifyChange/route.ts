// List all the members with pendingVerification

import { NextResponse } from "next/server"
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  // Extract search parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Current page
  const limit = parseInt(searchParams.get("limit") || "50", 10); // Page size

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try{
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated data from Prisma
    const pendingChangeList = await prisma.requestDetails.findMany({
      where: {
        descendantOf: forDescendanceOf,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        type: true,
        memberId: true,
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    // Total count for pagination
    const totalCount = await prisma.requestDetails.count({
      where: {
        descendantOf: forDescendanceOf,
      },
    });

    // Return paginated data with headers
    return NextResponse.json({
      data: pendingChangeList,
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