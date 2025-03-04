import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function POST(request: Request) {
  try {
    const { moderatorName, moderatorContact, moderatorId } = await request.json();

    // Validate required fields
    if (!moderatorName || !moderatorContact || !moderatorId) {
      return NextResponse.json(
        { error: "All fields (moderatorName, moderatorContact, moderatorId) are required." },
        { status: 400 }
      );
    }

    // Create a new ModeratorList entry
    const newModerator = await prisma.moderatorList.create({
      data: {
        moderatorName,
        moderatorContact,
        moderatorId,
      },
    });

    // Return the created entry
    return NextResponse.json(newModerator, { status: 201 });
  } catch (error) {
    console.error("Error creating moderator:", error);
    return NextResponse.json(
      { error: "Failed to create moderator." },
      { status: 500 }
    );
  }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      const { moderatorName, moderatorContact, moderatorId } = await request.json();
  
      // Validate required fields
      if (!moderatorName || !moderatorContact || !moderatorId) {
        return NextResponse.json(
          { error: "All fields (moderatorName, moderatorContact, moderatorId) are required." },
          { status: 400 }
        );
      }
  
      // Update the ModeratorList entry
      const updatedModerator = await prisma.moderatorList.update({
        where: { id: parseInt(id) },
        data: {
          moderatorName,
          moderatorContact,
          moderatorId,
        },
      });
  
      // Return the updated entry
      return NextResponse.json(updatedModerator, { status: 200 });
    } catch (error) {
      console.error("Error updating moderator:", error);
      return NextResponse.json(
        { error: "Failed to update moderator." },
        { status: 500 }
      );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
  
      // Delete the ModeratorList entry
      await prisma.moderatorList.delete({
        where: { id: parseInt(id) },
      });
  
      // Return a success message
      return NextResponse.json(
        { message: "Moderator deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting moderator:", error);
      return NextResponse.json(
        { error: "Failed to delete moderator." },
        { status: 500 }
      );
    }
  }