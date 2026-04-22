import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { serialize } from 'cookie';

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

    const authRecord = await prisma.auth.findUnique({
      where: { id: authId },
      select: {
        updatedAt: true,
        memberAuthId: true,
        moderatorAuthId: true,
        mainMemberId: true,
        moderatorList: {
          select: {
            moderatorName: true,
            moderatorContact: true,
          },
        },
      }
    });

    if (!authRecord) {
      return NextResponse.json({ error: "Auth record not found" }, { status: 404 });
    }

    // Fetch main member name for the current auth record
    let mainMemberName = null;
    if (authRecord.mainMemberId) {
      const member = await prisma.member.findUnique({
        where: { id: authRecord.mainMemberId },
        select: { name: true }
      });
      mainMemberName = member?.name || null;
    }

    // Get the current authId based on user type (from token)
    const currentAuthId = userType === "Member" ? authRecord.memberAuthId : authRecord.moderatorAuthId;

    if (!currentAuthId) {
      return NextResponse.json({ error: "Auth ID not found" }, { status: 404 });
    }

    // Get all authIds from cookies
    const existingCookie = request.cookies.get("authId")?.value;
    let allAuthIds: string[] = [];

    if (existingCookie) {
      try {
        allAuthIds = JSON.parse(existingCookie);
      } catch {
        allAuthIds = [currentAuthId];
      }
    }

    // Add current authId if not already in the list
    if (!allAuthIds.includes(currentAuthId)) {
      allAuthIds.push(currentAuthId);
    }

    // Limit accounts array to prevent cookie overflow
    const MAX_ACCOUNTS = 10;
    if (allAuthIds.length > MAX_ACCOUNTS) {
      allAuthIds = allAuthIds.slice(-MAX_ACCOUNTS);
    }

    // Fetch mainMemberRef for all authIds in a single query
    const authRecords = await prisma.auth.findMany({
      where: {
        OR: [
          { memberAuthId: { in: allAuthIds.filter(Boolean) } },
          { moderatorAuthId: { in: allAuthIds.filter(Boolean) } }
        ]
      },
      select: {
        memberAuthId: true,
        moderatorAuthId: true,
        mainMemberId: true,
        updatedAt: true,
        id: true,
        moderatorList: {
          select: {
            moderatorName: true,
            moderatorContact: true,
          },
        },
      }
    });

    // Fetch main member names for all auth records in the list
    const mainMemberIds = authRecords
      .map(record => record.mainMemberId)
      .filter((id): id is number => id !== null);

    const members = await prisma.member.findMany({
      where: { id: { in: mainMemberIds } },
      select: { id: true, name: true }
    });

    const memberMap = new Map(members.map(m => [m.id, m.name]));

    // Deduplicate: If both memberAuthId and moderatorAuthId for the same record are present, keep only moderatorAuthId
    authRecords.forEach(record => {
      if (record.memberAuthId && record.moderatorAuthId) {
        if (allAuthIds.includes(record.memberAuthId) && allAuthIds.includes(record.moderatorAuthId)) {
          allAuthIds = allAuthIds.filter(id => id !== record.memberAuthId);
        }
      }
    });

    // Filter allAuthIds to only include those that exist in the database
    const validAuthIds = allAuthIds.filter(authId =>
      authRecords.some(record => record.memberAuthId === authId || record.moderatorAuthId === authId)
    );

    // Get selected authIds from cookies for UI state
    const selectedAuthIdCookie = request.cookies.get("selectedAuthId")?.value || "";
    let selectedAuthIds: string[] = [];
    try {
      selectedAuthIds = JSON.parse(selectedAuthIdCookie);
    } catch (e) {
      selectedAuthIds = [];
    }

    // Always ensure the current session account (from token) is marked as selected
    if (!selectedAuthIds.includes(currentAuthId)) {
      selectedAuthIds.push(currentAuthId);
    }

    const validSelectedAuthIds = selectedAuthIds.filter(id => validAuthIds.includes(id));

    // Check for issues for each account in authRecords
    const accountsWithIssues = await Promise.all(authRecords.map(async (record) => {
      const [unverifiedCount, pendingRequestCount] = await Promise.all([
        prisma.member.count({ where: { authId: record.id, verified: false } }),
        prisma.requestDetails.count({ where: { authId: record.id } })
      ]);
      return { id: record.id, hasChanges: (unverifiedCount + pendingRequestCount) > 0 };
    }));

    const issuesMap = new Map(accountsWithIssues.map(i => [i.id, i.hasChanges]));

    // Map authIds to their details with current flag
    const authDetails = validAuthIds.map(authId => {
      const record = authRecords.find(record =>
        record.memberAuthId === authId || record.moderatorAuthId === authId
      );

      return {
        authId,
        mainMemberRef: record?.mainMemberId ? memberMap.get(record.mainMemberId) || null : null,
        current: selectedAuthIds.length > 0 ? selectedAuthIds.includes(authId) : (authId === currentAuthId),
        updatedAt: record?.updatedAt.getTime() || 0,
        familyId: record?.id,
        hasChanges: record ? issuesMap.get(record.id) : false
      };
    });

    // Map only selected authIds to their update timestamps
    const updatedAt: Record<string, number> = {};
    authRecords.forEach(rec => {
      const ts = rec.updatedAt.getTime();
      if (rec.memberAuthId && validSelectedAuthIds.includes(rec.memberAuthId)) {
        updatedAt[rec.memberAuthId] = ts;
      }
      if (rec.moderatorAuthId && validSelectedAuthIds.includes(rec.moderatorAuthId)) {
        updatedAt[rec.moderatorAuthId] = ts;
      }
    });

    // Prepare moderators list for all accounts in the list
    const allModeratorGroups = validAuthIds.map(id => {
      const record = authRecords.find(r => r.memberAuthId === id || r.moderatorAuthId === id);
      if (!record) return null;
      return {
        id: record.id,
        mainMemberName: record.mainMemberId ? memberMap.get(record.mainMemberId) || "Family" : "Family",
        moderators: record.moderatorList
      };
    }).filter((g): g is { id: number; mainMemberName: string; moderators: any[] } => g !== null);

    // Deduplicate groups by auth record id
    const uniqueGroups = Array.from(new Map(allModeratorGroups.map(g => [g.id, g])).values());

    // Prepare response
    const response = NextResponse.json({
      mainMemberName: mainMemberName,
      moderatorGroups: uniqueGroups,
      // password: authRecord.password,
      currentAuthId: currentAuthId,
      userType: userType,
      allAuthDetails: authDetails, // Array of objects with authId, mainMemberRef, and current flag
      _version: updatedAt,
    });

    // Update the authId cookie with the latest list
    const authIdCookie = serialize('authId', JSON.stringify(validAuthIds), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 180 * 24 * 60 * 60 // 180 days in seconds
    });

    // Update selectedAuthId cookie — currentAuthId is always included
    const selectedAuthIdCookieOut = serialize('selectedAuthId', JSON.stringify(validSelectedAuthIds), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 90 * 24 * 60 * 60 // 90 days in seconds
    });

    response.headers.append('Set-Cookie', authIdCookie);
    response.headers.append('Set-Cookie', selectedAuthIdCookieOut);

    return response

  } catch (error) {
    console.error("Error fetching member data:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}