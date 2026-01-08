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
    const id = decoded.authId;
    const userType = decoded.userType;

    if (!id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const authRecord = await prisma.auth.findUnique({
      where: { id },
      select: {
        password: true,
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
        const decodedValue = existingCookie;
        if (decodedValue.startsWith('[') && decodedValue.endsWith(']')) {
          allAuthIds = JSON.parse(decodedValue);
        } else {
          allAuthIds = [decodedValue.replace(/^\["|"\]$/g, '')];
        }
      } catch (e) {
        console.error("Error parsing authId cookie", e);
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
          { memberAuthId: { in: allAuthIds } },
          { moderatorAuthId: { in: allAuthIds } }
        ]
      },
      select: {
        memberAuthId: true,
        moderatorAuthId: true,
        mainMemberId: true,
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

    // Map authIds to their details with current flag
    const authDetails = validAuthIds.map(authId => {
      const record = authRecords.find(record =>
        record.memberAuthId === authId || record.moderatorAuthId === authId
      );

      return {
        authId,
        mainMemberRef: record?.mainMemberId ? memberMap.get(record.mainMemberId) || null : null,
        current: authId === authRecord.memberAuthId || authId === authRecord.moderatorAuthId
      };
    });

    const sortedAuthDetails = [...authDetails].sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return 0;
    });

    // Prepare response
    const response = NextResponse.json({
      mainMemberName: mainMemberName,
      moderators: authRecord.moderatorList,
      password: authRecord.password,
      currentAuthId: currentAuthId,
      allAuthDetails: sortedAuthDetails, // Array of objects with authId, mainMemberRef, and current flag
    });

    // Update the authId cookie with the latest list
    const authIdCookie = serialize('authId', JSON.stringify(validAuthIds), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 180 * 24 * 60 * 60 // 180 days in seconds
    });

    response.headers.set('Set-Cookie', authIdCookie);

    return response;

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