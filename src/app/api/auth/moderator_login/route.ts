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
    const login = await prisma.auth.findFirst({
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

    return NextResponse.json({
      message: "Login successful",
      newtoken,
      userType: "Moderator",
      authId: login.moderatorAuthId,
      oldAuthId: login.memberAuthId
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