import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from "@/db/db";

export async function GET(request: NextRequest) {
  try {
    const unverifiedCount = await prisma.member.count({
      where: {
        verified: false,
      },
    });

    const pendingRequestCount = await prisma.requestDetails.count();

    return NextResponse.json({
      unverifiedMembers: unverifiedCount,
      pendingRequests: pendingRequestCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
