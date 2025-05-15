import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

interface MemberWithVerifications {
  id: number;
  name: string;
  gender: string;
  verified: boolean;
  father: { name: string } | null;
  mother: { name: string } | null;
  partnerships: { partner: { name: string } }[];
  pendingVerification: { id: number }[];
}

export async function GET(request: NextRequest) {
  // Validate and sanitize input parameters
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const searchQuery = searchParams.get("search") || "";

  // Authentication
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }

  try {
    // Verify token and extract required claims
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json(
        { error: "Invalid token claims" },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Optimized query using Promise.all for parallel execution
    const [members, totalCount] = await Promise.all([
      prisma.member.findMany({
        where: {
          descendantOf: forDescendanceOf,
          pendingVerification: { some: {} }, // Has pending verifications
          name: {
            contains: searchQuery,
            // mode: "insensitive" // Uncomment for case-insensitive search if using PostgreSQL
          }
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
          pendingVerification: {
            select: {
              id: true,
              type: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
        orderBy: {
          pendingVerification: {
            _count: 'desc' // Members with most verifications first
          }
        },
        skip,
        take: limit,
      }) as Promise<MemberWithVerifications[]>,
      
      prisma.member.count({
        where: {
          descendantOf: forDescendanceOf,
          pendingVerification: { some: {} },
          name: {
            contains: searchQuery
          }
        }
      })
    ]);

    // Format response data with partners
    const formattedMembers = members.map(member => ({
      ...member,
      partner: member.partnerships[0]?.partner || null,
      pendingVerificationCount: member.pendingVerification.length
    }));

    return NextResponse.json({
      data: formattedMembers,
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
    
    // Enhanced error handling
    if (error instanceof Error) {
      // Authentication errors
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { error: "Invalid authentication token" },
          { status: 401 }
        );
      }

      // Database errors
      if (error.name.startsWith('Prisma')) {
        return NextResponse.json(
          { 
            error: "Database operation failed",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        );
      }
    }

    // Fallback error response
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        ...(process.env.NODE_ENV === 'development' && { details: error instanceof Error ? error.message : String(error) })
      },
      { status: 500 }
    );
  }
}