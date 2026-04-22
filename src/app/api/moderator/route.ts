import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { getModeratorData } from '@/utils/moderatorCounts';

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;
    const userType = decoded.userType;
    const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "";

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await getModeratorData(authId, userType, selectedAuthId);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching moderator dashboard data:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

