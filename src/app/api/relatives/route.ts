import { NextResponse } from "next/server"
import prisma from "@/db/db"; // Adjust the import path as needed
import { NextRequest } from "next/server"; // Import NextRequest if needed for handling query params

let currentLetter = "";

export async function GET(request: NextRequest) {
  try {
    // Extract search parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Current page
    const limit = parseInt(searchParams.get("limit") || "50", 10); // Page size
    const searchQuery = searchParams.get("search") || ""; // Search term

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    if (page === 1) {
      currentLetter = "";
    }

    // Fetch paginated data from Prisma
    const memberList = await prisma.member.findMany({
      where: {
        name: { contains: searchQuery },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        father: { select: { name: true } },
        mother: { select: { name: true } },
        partner: { select: { name: true } },
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    // Total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        name: { contains: searchQuery },
      },
    });

    // Add starting letter headers to the paginated data
    const groupedData:any = [];

    memberList.forEach((member) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      // If this is a new starting letter, add a header entry
      if (firstLetter !== currentLetter) {
        currentLetter = firstLetter;
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          phoneNumber: null,
          father: null,
          mother: null,
          partner: null,
        });
      }

      // Add the current member to the grouped data
      groupedData.push(member);
    });

    // Return paginated data with headers
    return NextResponse.json({
      data: groupedData,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}


