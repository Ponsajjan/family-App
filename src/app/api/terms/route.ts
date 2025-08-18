import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    const memberId = decoded.memberId
    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const authRecord = await prisma.auth.findUnique({
      where: { forDescendanceOf },
      select: {
        members: {
          where: { id: memberId },
          select: {
            name: true,
            descendantOf: true
          },
        },
        moderatorList: {
          select: {
            moderatorName: true,
            moderatorContact: true,
          },
        },
      },
      cacheStrategy: { 
        ttl: 60 * 30,
        swr: 30
      }, // Cache for 30 minutes
    });

    if (!authRecord) {
      return NextResponse.json({ error: "Auth record not found" }, { status: 404 });
    }

    // Extract the main member (first member in the filtered list)
    const mainMember = authRecord.members[0];

    if (!mainMember) {
      return NextResponse.json({ error: "Main member not found" }, { status: 404 });
    }

    // Respond with the fetched data
    return NextResponse.json({
      member: mainMember, // The main member associated with the auth record
      moderators: authRecord.moderatorList, // List of moderators,
    });
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