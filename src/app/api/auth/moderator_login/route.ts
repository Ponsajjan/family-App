import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import prisma from "@/db/db";

// this api takes in token finds authuntication using unique password then checks value with moderator password

export async function POST(request: Request) {
  try {
    const { password } = await request.json(); 
    
    // Try finding the password in the database
    let login = await prisma.auth.findUnique({ where: { password } });

    // If no match is found in DB, check the environment variable
    if (!login && password === process.env.SUPER_ADMIN_PASSWORD) {
      login = { 
        id:108,
        forDescendanceOf: "superAdmin",
        mainMemberId: -1,
        moderatorPassword: "hi",
        password: process.env.SUPER_ADMIN_PASSWORD || 'trust me, there is a password',
        createdAt: new Date("2025-05-03T12:46:17.077Z"),
        updatedAt: new Date("2025-05-03T12:46:17.077Z")
      };
    }

    if (!login) {
      return NextResponse.json(
        { success: false, error: "No match found" },
        { status: 403 }
      );
    }

    // Generate token
    const token = await generateToken({
      forDescendanceOf: login.forDescendanceOf,
      memberId: login.mainMemberId,
      userType: login.forDescendanceOf === "superAdmin" ? "superAdmin" : "member",
    });

    return NextResponse.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error logging in:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: "Failed to log in" },
      { status: 500 }
    );
  }
}