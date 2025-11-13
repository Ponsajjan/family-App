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
  mainMemberId: number | null;
  password: string;
  mainMemberNameRef?: string | null;
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
        id: -108,
        mainMemberId: null,
        password: process.env.SUPER_ADMIN_PASSWORD,
        moderatorName: "Admin",
        moderatorContact: "N/A",
        moderatorPassword: "N/A",
        mainMemberNameRef: "superAdmin_007",
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

    return NextResponse.json({ success: true, message: "Login successful", token, userType, mainMemberNameRef: login.mainMemberNameRef || 'Unknown' });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}