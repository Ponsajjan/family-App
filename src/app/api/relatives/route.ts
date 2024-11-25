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
    const memberList = await prisma.member.findMany({
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        father: {
          select: {
            name: true, // Select only the father's name
          },
        },
        mother: {
          select: {
            name: true, // Select only the mother's name
          },
        },
        partner: {
          select: {
            name: true, // Select only the partner's name
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(memberList);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}


