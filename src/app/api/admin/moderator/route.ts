import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const userType = decoded.userType;

    if (userType !== "Admin") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { moderatorName, moderatorContact, authId } = await request.json();

    // Validate required fields
    if (!moderatorName?.trim() || !moderatorContact?.trim() || !authId) {
      return NextResponse.json(
        { error: "All Name and Contact Number is required." },
        { status: 400 }
      );
    }

    const authIdNum = Number(authId);
    if (isNaN(authIdNum) || authIdNum <= 0) {
      return NextResponse.json({ error: "Invalid authId." }, { status: 400 });
    }

    // Check if authId exists in the Auth table
    const existingAuth = await prisma.auth.findUnique({
      where: { id: authIdNum },
    });

    if (!existingAuth) {
      return NextResponse.json(
        { error: "Invalid authId. No matching Auth record found." },
        { status: 400 }
      );
    }

    // Create a new ModeratorList entry
    const newModerator = await prisma.moderatorList.create({
      data: {
        moderatorName: moderatorName.trim(),
        moderatorContact: moderatorContact.trim(),
        authId: authIdNum,
      },
    });

    return NextResponse.json(
      { message: "Moderator added successfully.", moderator: newModerator },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating moderator:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This contact number is already assigned to another moderator." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create moderator." },
      { status: 500 }
    );
  }
}
