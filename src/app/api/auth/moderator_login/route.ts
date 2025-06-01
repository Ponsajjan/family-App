import { NextResponse } from "next/server";
import { generateToken, verifyToken } from "@/utils/auth";
import prisma from "@/db/db";

// this api takes in token finds authuntication using unique password then checks value with moderator password

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
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
        forDescendanceOf: forDescendanceOf,
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
      forDescendanceOf: login.forDescendanceOf,
      memberId: login.mainMemberId,
      userType: "moderator",
    });

    return NextResponse.json({ message: "Login successful", newtoken, accessType: "moderator" }, { status: 200 });

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