import { NextResponse } from "next/server"
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  // Extract and validate pagination parameters
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

  // Authentication
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Fetch data with proper relation inclusion
    const [members, totalCount] = await Promise.all([
      prisma.member.findMany({
        where: {
          authId: authId,
          pendingVerification: { some: {} } // Check for at least one pending verification
        },
        select: {
          id: true,
          name: true,
          gender: true,
          verified: true,
          father: { select: { name: true } },
          mother: { select: { name: true } },
          // partner: { select: { name: true } },
          pendingVerification: {
            select: {
              id: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc' // Show most recent first
        },
        skip,
        take: limit,
      }),
      prisma.member.count({
        where: {
          authId: authId,
          pendingVerification: { some: {} }
        }
      })
    ]);

    return NextResponse.json({
      data: members,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: (page * limit) < totalCount
      }
    });

  } catch (error) {
    console.error("Pending verification fetch error:", error);

    if (error instanceof Error) {
      // Specific token errors
      if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
        return NextResponse.json(
          { error: `Token error: ${error.message}` },
          { status: 401 }
        );
      }

      // Prisma errors
      if (error.name.startsWith('Prisma')) {
        return NextResponse.json(
          { error: "Database error occurred" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}