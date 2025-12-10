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
    const id = decoded.authId;
    const memberId = decoded.memberId
    if (!id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const authRecord = await prisma.auth.findUnique({
      where: { id },
      select: {
        password: true,
        mainMemberNameRef: true,
        members: {
          where: { id: memberId },
          select: {
            name: true,
            authId: true,
          },
        },
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

    // Extract the main member (first member in the filtered list)
    const mainMember = authRecord.members[0];

    if (!mainMember) {
      return NextResponse.json({ error: "Main member not found" }, { status: 404 });
    }

    let mainMemberName = authRecord.mainMemberNameRef;

    if (decoded?.userType === 'Moderator' && mainMemberName) {
      const last4Digits = mainMemberName.slice(-4);
      const numericValue = parseInt(last4Digits, 10);
      const moderatorAccountNumericValue = numericValue - 108;
      const moderatorAccountLast4Digits = moderatorAccountNumericValue.toString().padStart(4, '0');
      const potentialModeratorAccount = mainMemberName.slice(0, -4) + moderatorAccountLast4Digits;

      // Modifying the mainMemberName to be the moderator account
      mainMemberName = potentialModeratorAccount;
    }

    return NextResponse.json({
      member: mainMember, // The main member associated with the auth record
      mainMemberName: mainMemberName, // The main member's name
      moderators: authRecord.moderatorList, // List of moderators,
      password: authRecord.password,
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