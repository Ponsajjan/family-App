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

    // Check if this might be a moderator account (not in DB, but regular account exists)
    // Extract last 4 digits and add 108 to check if a regular account exists
    let userType: string = "Member";
    let isModerator = false;

    if (!login) {
      const last4Digits = account.slice(-4);
      const numericValue = parseInt(last4Digits, 10);
      const regularAccountNumericValue = numericValue + 108;
      const regularAccountLast4Digits = regularAccountNumericValue.toString().padStart(4, '0');
      const potentialRegularAccount = account.slice(0, -4) + regularAccountLast4Digits;

      // Check if the regular account exists in the database
      const regularAccountExists = await prisma.auth.findUnique({
        where: { mainMemberNameRef: potentialRegularAccount },
      });

      if (regularAccountExists) {
        // This is a moderator account (has 108 less than the regular account)
        login = regularAccountExists;
        userType = "Moderator";
        isModerator = true;
      }
    }



    if (!login) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 403 }
      );
    }

    // Determine user type if not already set as moderator
    if (!isModerator) {
      userType = "Member";
    }

    // Generate token
    const token = await generateToken({
      authId: login.id,
      memberId: login.mainMemberId,
      userType,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      newtoken: token, // Changed from token to newtoken
      userType,
      mainMemberNameRef: account // Use the account parameter to preserve moderator account string
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}