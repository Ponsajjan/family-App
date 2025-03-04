import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function GET() {
  try {
    // Fetch all Auth entries with their associated ModeratorList values
    const authEntries = await prisma.auth.findMany({
      include: {
        moderatorList: true, // Include related ModeratorList entries
      },
    });

    // Format the response
    const formattedResponse = authEntries.map((auth) => ({
      descendantOf: auth.forDescendanceOf, // Use `forDescendanceOf` from Auth
      memberPassword: auth.password, // Use `password` from Auth
      moderatorPassword: auth.moderatorPassword, // Use `moderatorPassword` from Auth
      moderators: auth.moderatorList.map((moderator) => ({
        name: moderator.moderatorName, // Use `moderatorName` from ModeratorList
        contactNumber: moderator.moderatorContact, // Use `moderatorContact` from ModeratorList
      })),
    }));

    // Return the formatted response
    return NextResponse.json(formattedResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching auth entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch auth entries." },
      { status: 500 }
    );
  }
}