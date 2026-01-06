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
        moderatorList: {
          select: {
            moderatorName: true,
            moderatorContact: true,
          },
        },
        members: {
          select: {
            name: true
          }
        }
      }
    });

    if (!authRecord) {
      return NextResponse.json({ error: "Auth record not found" }, { status: 404 });
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
        const decodedValue = decodeURIComponent(existingCookie);
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
        members: {
          select: {
            name: true
          }
        }
      }
    });

    // Map authIds to their details with current flag
    const authDetails = allAuthIds.map(authId => {
      const record = authRecords.find(record =>
        record.memberAuthId === authId || record.moderatorAuthId === authId
      );

      return {
        authId,
        mainMemberRef: record?.members[0]?.name || null,
        current: authId === currentAuthId // true only for token-derived authId
      };
    });

    const sortedAuthDetails = [...authDetails].sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return 0;
    });

    // Prepare response
    const response = NextResponse.json({
      mainMemberName: authRecord.members[0]?.name || null,
      moderators: authRecord.moderatorList,
      password: authRecord.password,
      currentAuthId: currentAuthId,
      allAuthDetails: sortedAuthDetails, // Array of objects with authId, mainMemberRef, and current flag
    });

    // Update the authId cookie with the latest list
    const authIdCookie = serialize('authId', encodeURIComponent(JSON.stringify(allAuthIds)), {
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