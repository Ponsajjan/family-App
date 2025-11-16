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
  mainMemberId: number | null;
  password: string;
  moderatorName?: string;
  moderatorContact?: string;
  moderatorPassword: string;
  mainMemberNameRef?: string | null;
}

export async function POST(request: Request) {
  try {
    const { account }: LoginRequestBody = await request.json();

    if (!account) {
      return NextResponse.json(
        { success: false, error: "account is required" },
        { status: 400 }
      );
    }

    // Try finding the account in the database
    let login: LoginResponse | null = await prisma.auth.findUnique({
      where: { mainMemberNameRef: account },
    });

    // If no match is found in DB, check the environment variable
    if (!login && process.env.SUPER_ADMIN_PASSWORD && account === 'super_admin_007') {
      login = {
        id: -108,
        mainMemberId: null,
        password: process.env.SUPER_ADMIN_PASSWORD,
        moderatorName: "Admin",
        moderatorContact: "N/A",
        moderatorPassword: "N/A",
        mainMemberNameRef: "super_admin_007",
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
      authId: login.id,
      memberId: login.mainMemberId,
      userType: login.moderatorName === "Admin" ? "Admin" : "Member",
    });

    const userType = login.moderatorName === "Admin" ? "Admin" : "Member";

    return NextResponse.json({
      success: true,
      message: "Login successful",
      newtoken: token, // Changed from token to newtoken
      userType,
      mainMemberNameRef: login.mainMemberNameRef || 'Unknown'
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}