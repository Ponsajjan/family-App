import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";
import prisma from "@/db/db";

export async function POST(request: Request) {
  try {
    const { account } = await request.json();

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account is required" },
        { status: 400 }
      );
    }

    let login = null;
    let userType = null;

    // FIRST: Try moderator login (with full account string)
    const moderatorAccount = await prisma.auth.findUnique({
      where: { moderatorAuthId: account },
      include: {
        moderatorList: {
          select: {
            moderatorName: true,
            moderatorContact: true,
          },
        },
      },
    });

    if (moderatorAccount) {
      login = moderatorAccount;
      userType = "Moderator";
    } else {
      const memberAccount = await prisma.auth.findUnique({
        where: { memberAuthId: account },
        include: {
          moderatorList: {
            select: {
              moderatorName: true,
              moderatorContact: true,
            },
          },
        },
      });

      if (memberAccount) {
        login = memberAccount;
        userType = "Member";
      }
    }

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

    const token = await generateToken({
      authId: login.id,
      selectAuthId: userType === "Moderator" ? login.moderatorAuthId : login.memberAuthId,
      memberId: login.mainMemberId,
      userType,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      newtoken: token,
      userType,
      authId: account,
      mainMemberName,
      password: login.password,
      moderators: login.moderatorList
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}