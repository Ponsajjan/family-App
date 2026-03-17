import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from "@/db/db";
import { verifyToken } from '@/utils/auth';

export async function GET(request: NextRequest) {
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

    // Fetch member and request counts in parallel for efficiency
    const [unverifiedCount, pendingRequestCount, familyTree] = await Promise.all([
      prisma.member.count({
        where: {
          authId: authId,
          verified: false,
        },
      }),
      prisma.requestDetails.count({
        where: {
          authId: authId,
        },
      }),
      prisma.familyTree.findUnique({
        where: { authId: authId },
        select: {
          status: true,
          lastBuildStartedAt: true,
          updatedAt: true
        }
      })
    ]);

    let chartStatus = "not_built";
    if (familyTree) {
      chartStatus = familyTree.status;

      // Check for timeout: if status is "building" and more than 5 minutes old
      const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
      if (
        familyTree.status === "building" &&
        familyTree.lastBuildStartedAt &&
        Date.now() - familyTree.lastBuildStartedAt.getTime() > TIMEOUT_MS
      ) {
        chartStatus = "timeout";
      }
    }

    return NextResponse.json({
      unverifiedMembers: unverifiedCount,
      pendingRequests: pendingRequestCount,
      chartStatus: chartStatus,
      lastBuildStartedAt: familyTree?.lastBuildStartedAt || null,
      updatedAt: familyTree?.updatedAt || null,
    });
  } catch (error) {
    console.error("Error fetching moderator dashboard data:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
