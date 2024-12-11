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
    const searchQuery = searchParams.get("search") || ""; // Get 'search' parameter, default to empty string

    // Fetch data from Prisma with filtering
    const memberList = await prisma.member.findMany({
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        father: {
          select: {
            name: true,
          },
        },
        mother: {
          select: {
            name: true,
          },
        },
        partner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Perform case-insensitive filtering in JavaScript
    const filteredList = memberList.filter((member) => {
      return (
        member.name.toLowerCase().includes(searchQuery) ||
        member.father?.name?.toLowerCase().includes(searchQuery) ||
        member.mother?.name?.toLowerCase().includes(searchQuery) ||
        member.partner?.name?.toLowerCase().includes(searchQuery)
      );
    });

    return NextResponse.json(filteredList);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}


