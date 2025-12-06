import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyToken } from "@/utils/auth";
import prisma from "@/db/db";

// this api takes in token finds authuntication using unique password then checks value with moderator password

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
    // Try finding the password in the database
    const login = await prisma.auth.findUnique({
      where: {
        moderatorPassword: password,
        id: authId,
      },
    });

    if (!login) {
      return NextResponse.json(
        { error: "Invalid credential" },
        { status: 403 }
      );
    }

    // Generate token
    const newtoken = await generateToken({
      authId: login.id,
      memberId: login.mainMemberId,
      userType: "Moderator",
    });

    // Extract last 4 digits from mainMemberNameRef and subtract 108
    const mainMemberNameRef = login.mainMemberNameRef;
    const last4Digits = mainMemberNameRef.slice(-4);
    const numericValue = parseInt(last4Digits, 10);
    const newNumericValue = numericValue - 108;
    const newLast4Digits = newNumericValue.toString().padStart(4, '0');
    const moderatorAccountRef = mainMemberNameRef.slice(0, -4) + newLast4Digits;

    return NextResponse.json({
      message: "Login successful",
      newtoken,
      userType: "Moderator",
      mainMemberNameRef: moderatorAccountRef
    }, { status: 200 });

  } catch (error) {
    console.error("Error logging in:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}