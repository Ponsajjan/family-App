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
  moderatorName?: string;
  moderatorContact?: string;
  moderatorPassword: string;
  memberAuthId?: string | null;
  members?: any;
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
      include: {
        members: {
          select: {
            name: true,
          }
        }
      }
    });


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
      userType: "Member",
    });

    const userType = "Member";

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      userType,
      authId: login.memberAuthId,
      mainMemberName: login.members[0].name,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}