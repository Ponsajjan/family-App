import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function GET() {
  try {
    const authEntries = await prisma.auth.findMany({
      include: {
        moderatorList: true,
      },
    });

    // Format the response
    const formattedResponse = authEntries.map((auth) => ({
      id: auth.mainMemberId,
      descendantOf: auth.forDescendanceOf,
      memberPassword: auth.password,
      moderatorPassword: auth.moderatorPassword,
      moderators: auth.moderatorList.map((moderator) => ({
        name: moderator.moderatorName,
        contactNumber: moderator.moderatorContact,
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