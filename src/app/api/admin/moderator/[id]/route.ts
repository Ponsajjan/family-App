import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
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
        where: { id: parseInt(id) },
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
      return NextResponse.json(
        { error: "Failed to update moderator." },
        { status: 500 }
      );
    }
}

export async function DELETE(
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
  
      const moderator = await prisma.moderatorList.findUnique({
        where: { id: parseInt(id) },
      });
      
      if (!moderator) {
        return NextResponse.json(
          { error: "Invalid moderator. The referenced moderator does not exist." },
          { status: 400 }
        );
      }
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