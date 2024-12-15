import { NextResponse } from "next/server"
import prisma from "@/db/db"; // Adjust the import path as needed
import { NextRequest } from "next/server"; // Import NextRequest if needed for handling query params

// export async function GET(request: Request) {
//   try {
//     const users = await prisma.user.findMany({
//       // where: { id: user_id },
//       select: {
//         id: true,
//         name: true,
//       },
//       orderBy: { name: "asc" },
//     });
//     return NextResponse.json( users );
//   } catch (error) {
//     return NextResponse.json({ error: 'Error fetching users' });
//   }
// }


export async function GET(request: NextRequest) {

  try {
    // Extract search parameters
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || ""; // Search term
    const page = parseInt(searchParams.get("page") || "1", 10); // Current page
    const limit = parseInt(searchParams.get("limit") || "50", 10); // Page size

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch data from Prisma
    const memberList = await prisma.member.findMany({
      where: {
        // name: { contains: searchQuery, mode: "insensitive" },
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
      // where: { name: { contains: searchQuery, mode: "insensitive" } },
      where: {
        name: { contains: searchQuery },
      }
    });

    return NextResponse.json({ data: memberList, totalCount });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}