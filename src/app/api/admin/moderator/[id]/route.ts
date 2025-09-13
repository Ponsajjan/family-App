import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const decoded = await verifyToken(token);
    const userType = decoded.userType;

    if (userType !== "Admin") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() || "", 10);
    const { moderatorName, moderatorContact, authId } = await request.json();

    const existingAuth = await prisma.auth.findUnique({
      where: { id: authId },
    });
    
    if (!existingAuth) {
      return NextResponse.json(
        { error: "Invalid authId. The referenced user/auth does not exist." },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!moderatorName || !moderatorContact || !authId) {
      return NextResponse.json(
        { error: "All fields (moderatorName, moderatorContact, authId) are required." },
        { status: 400 }
      );
    }

    // Update the ModeratorList entry
    const updatedModerator = await prisma.moderatorList.update({
      where: { id: id },
      data: {
        moderatorName,
        moderatorContact,
        authId,
      },
    });

    // Return the updated entry
    return NextResponse.json(updatedModerator, { status: 200 });
  } catch (error) {
    console.error("Error updating moderator:", error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update moderator." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const moderatorId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(moderatorId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const userType = decoded.userType;

    if (userType !== "Admin") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const moderator = await prisma.moderatorList.findUnique({
      where: { id: moderatorId },
    });
    
    if (!moderator) {
      return NextResponse.json(
        { error: "Invalid moderator. The referenced moderator does not exist." },
        { status: 400 }
      );
    }
    // Delete the ModeratorList entry
    await prisma.moderatorList.delete({
      where: { id: moderatorId },
    });

    // Return a success message
    return NextResponse.json(
      { message: "Moderator deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting moderator:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to delete moderator." },
      { status: 500 }
    );
  }
}