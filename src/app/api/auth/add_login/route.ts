import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import prisma from "@/db/db";
import dotenv from 'dotenv';
dotenv.config();

interface LoginRequestBody {
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { password }: LoginRequestBody = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Try finding the password in the database
    let login = await prisma.auth.findUnique({
      where: { password },
      include: {
        moderatorList: {
          select: {
            moderatorName: true,
            moderatorContact: true,
          },
        },
      },
    });


    if (!login) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 403 }
      );
    }

    // Fetch main member name if mainMemberId exists
    let mainMemberName = null;
    if (login.mainMemberId) {
      const member = await prisma.member.findUnique({
        where: { id: login.mainMemberId },
        select: { name: true }
      });
      mainMemberName = member?.name || null;
    }

    // Check if the login already exists in the client's list of accounts (as either member or moderator)
    let existingAuthIds: string[] = [];
    const authIdCookie = request.cookies.get("authId")?.value;
    if (authIdCookie) {
      try {
        existingAuthIds = JSON.parse(authIdCookie);
      } catch (e) {
        console.error("Error parsing authId cookie:", e);
      }
    }

    if (
      (login.memberAuthId && existingAuthIds.includes(login.memberAuthId)) ||
      (login.moderatorAuthId && existingAuthIds.includes(login.moderatorAuthId))
    ) {
      return NextResponse.json(
        { success: false, error: `Login already exists (${mainMemberName})` },
        { status: 400 }
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
      familyId: login.id,
      mainMemberName,
      moderators: login.moderatorList,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}