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
  const { searchParams } = new URL(request.url);
  const forType = searchParams.get("for");
  const birthYearThreshold = searchParams.get("birthYearThreshold");

  try {
    let users;

    // Build the query based on `for` parameter value
    switch (forType) {
      case "selectUser":
        users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            gender: true,
            father: true,
            mother: true,
            partner: true
            // Add other fields as needed
          },
          orderBy: { name: "asc" },
        });
        break;

      case "selectFather":
        users = await prisma.user.findMany({
          where: {
            gender: 'Male',
            // birthYear: { lt: Number(birthYearThreshold) + 18 },
            // partner: {
            //   some: {}, // Checks if there is at least one related `UserPartner`
            // },
          },
          select: {
            id: true,
            name: true,
            gender: true,
            father: true,
            mother: true,
            partner: true, // This will include partner relationship details if needed
          },
          orderBy: { name: "asc" },
        });
        break;

      case "selectMother":
        users = await prisma.user.findMany({
          where: {
            gender: 'Female',
            // birthYear: { lt: Number(birthYearThreshold) + 18 },
            // partner: {
            //   some: {}, // Checks if there is at least one related `UserPartner`
            // },
          },
          select: {
            id: true,
            name: true,
            gender: true,
            father: true,
            mother: true,
            partner: true, // This will include partner relationship details if needed
          },
          orderBy: { name: "asc" },
        });
        break;

      case "selectChildren":
        if (!birthYearThreshold) {
          return NextResponse.json({ error: "birthYearThreshold is required for selectChildren" }, { status: 400 });
        }
        users = await prisma.user.findMany({
          where: {
            birthYear: { gte: Number(birthYearThreshold) },
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            father: true,
            mother: true,
            partner: true, // This will include partner relationship details if needed
          },
          orderBy: { name: "asc" },
        });
        break;

      default:
        // Default case if `forType` is not recognized
        return NextResponse.json({ error: "Invalid 'for' parameter" }, { status: 400 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}


