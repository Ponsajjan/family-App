import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import prisma from "@/db/db";
import dotenv from 'dotenv';
dotenv.config();

interface LoginRequestBody {
  account: string;
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
    const { account }: LoginRequestBody = await request.json();

    console.log('account account account', account)
    if (!account) {
      return NextResponse.json(
        { success: false, error: "account is required" },
        { status: 400 }
      );
    }

    // Try finding the account in the database
    let login: LoginResponse | null = await prisma.auth.findUnique({
      where: { forDescendanceOf: account },
    });

    // If no match is found in DB, check the environment variable
    if (!login && process.env.SUPER_ADMIN_PASSWORD && account === 'super_admin_007') {
      login = {
        id: -108,
        forDescendanceOf: "super_admin_007",
        mainMemberId: null,
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
      userType: login.moderatorName === "Admin" ? "Admin" : "Member",
    });

    const userType = login.moderatorName === "Admin" ? "Admin" : "Member";

    return NextResponse.json({ 
        success: true, 
        message: "Login successful", 
        newtoken: token, // Changed from token to newtoken
        userType, 
        forDescendanceOf: login.forDescendanceOf
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}