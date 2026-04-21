import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

/**
 * Lightweight endpoint to check the current family data version.
 * Returns only the updatedAt timestamp.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;
    const userType = decoded.userType;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // --- Get IDs to check ---
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    let allMemberAuthIds: string[] = [];
    if (idsParam) {
      allMemberAuthIds = idsParam.split(",").filter(id => id.trim() !== "");
    }

    if (allMemberAuthIds.length === 0) {
      const authRecord = await prisma.auth.findUnique({
        where: { id: authId },
        select: {
          memberAuthId: true,
          moderatorAuthId: true
        }
      });
      if (authRecord) {
        if (userType === 'Member' && authRecord.memberAuthId) {
          allMemberAuthIds.push(authRecord.memberAuthId);
        }
        if (userType === 'Moderator' && authRecord.moderatorAuthId) {
          allMemberAuthIds.push(authRecord.moderatorAuthId);
        }
      }
    }

    // Fetch updatedAt for all these
    const authRecords = await prisma.auth.findMany({
      where: {
        OR: [
          { memberAuthId: { in: allMemberAuthIds.filter(Boolean) } },
          { moderatorAuthId: { in: allMemberAuthIds.filter(Boolean) } }
        ]
      },
      select: {
        id: true,
        memberAuthId: true,
        moderatorAuthId: true,
        updatedAt: true
      }
    });

    if (authRecords.length === 0) {
      return NextResponse.json({ error: "Auth records not found" }, { status: 404 });
    }

    // Map the results back to the requested IDs or their own internal IDs
    const updates: Record<string, number> = {};
    authRecords.forEach(rec => {
      const timestamp = rec.updatedAt.getTime();
      // updates[rec.id.toString()] = timestamp;
      if (rec.memberAuthId && allMemberAuthIds.includes(rec.memberAuthId)) {
        updates[rec.memberAuthId] = timestamp;
      }
      if (rec.moderatorAuthId && allMemberAuthIds.includes(rec.moderatorAuthId)) {
        updates[rec.moderatorAuthId] = timestamp;
      }
    });

    return NextResponse.json({
      _version: updates,
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
