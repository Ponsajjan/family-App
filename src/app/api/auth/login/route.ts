import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import prisma from "@/db/db";
import dotenv from 'dotenv';
dotenv.config();

interface LoginRequestBody {
  password: string;
}

interface LoginResponse {
  id: number;
  forDescendanceOf: string;
  mainMemberId: number | null;
  password: string;
  moderatorName?: string;
  moderatorContact?: string;
  moderatorPassword: string;
}

export async function POST(request: Request) {
  try {
    const { password }: LoginRequestBody = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Try finding the password in the database
    let login: LoginResponse | null = await prisma.auth.findUnique({
      where: { password },
    });

    // If no match is found in DB, check the environment variable
    if (!login && process.env.SUPER_ADMIN_PASSWORD && password === process.env.SUPER_ADMIN_PASSWORD) {
      login = {
        id: -108, // Avoid hardcoding; consider generating a unique ID
        forDescendanceOf: "parents",
        mainMemberId: null, // Avoid hardcoding; consider a better default
        password: process.env.SUPER_ADMIN_PASSWORD,
        moderatorName: "Admin",
        moderatorContact: "N/A",
        moderatorPassword: "N/A",
      };
    }

    if (!login) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 403 }
      );
    }

    // Generate token
    const token = await generateToken({
      forDescendanceOf: login.forDescendanceOf,
      memberId: login.mainMemberId,
      userType: login.moderatorName === "Admin" ? "Admin" : "member",
    });

    const userType = login.moderatorName === "Admin" ? "Admin" : "member";

    return NextResponse.json({ success: true, message: "Login successful", token, userType});
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}