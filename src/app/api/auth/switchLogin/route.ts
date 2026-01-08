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
        members: {
          select: {
            name: true
          }
        }
      }
    });

    if (moderatorAccount) {
      login = moderatorAccount;
      userType = "Moderator";
    } else {
      const memberAccount = await prisma.auth.findUnique({
        where: { memberAuthId: account },
        include: {
          members: {
            select: {
              name: true
            }
          }
        }
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

    const token = await generateToken({
      authId: login.id,
      memberId: login.mainMemberId,
      userType,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      newtoken: token,
      userType,
      authId: account,
      mainMemberName: login.members[0]?.name || null,
      password: login.password
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}