// List all the members with pendingVerification

import { NextResponse } from "next/server"
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

let currentLetter = "";

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

    if (page === 1) {
      currentLetter = "";
    }

    // Fetch paginated data from Prisma
    const memberList = await prisma.member.findMany({
      where: {
        descendantOf: forDescendanceOf,
        pendingVerification: {
          some: {}, // Check if there are any pending verification requests
        },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        pendingVerification: {
          select: {
            type: true,
          }
        }
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    // Total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        descendantOf: forDescendanceOf,
        pendingVerification: {
          some: {},
        },
      },
    });

    // Add starting letter headers to the paginated data
    const groupedData:any = [];

    memberList.forEach((member) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      // If this is a new starting letter, add a header entry
      if (firstLetter !== currentLetter) {
        currentLetter = firstLetter;
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          pendingVerificaton: ""
        });
      }

      // Add the current member to the grouped data
      groupedData.push(member);
    });

    // Return paginated data with headers
    return NextResponse.json({
      data: groupedData,
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