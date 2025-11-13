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

    const unverifiedCount = await prisma.member.count({
      where: {
        authId: authId,
        verified: false,
      },
    });

    const pendingRequestCount = await prisma.requestDetails.count({
      where: {
        authId: authId,
      },
    });

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
