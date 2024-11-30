import { NextResponse } from "next/server"
import prisma from "@/db/db"; // Adjust the import path as needed
import { NextRequest } from "next/server"; // Import NextRequest if needed for handling query params

// export async function GET(request: Request) {
//   try {
//     const memberList = await prisma.member.findMany({
//       // where: { id: user_id },
//       select: {
//         id: true,
//         name: true,
//       },
//       orderBy: { name: "asc" },
//     });
//     return NextResponse.json( memberList );
//   } catch (error) {
//     return NextResponse.json({ error: 'Error fetching memberList' });
//   }
// }


export async function GET(request: NextRequest) {
  const { searchParams } = await new URL(request.url);
  const forType = searchParams.get("for");
  const birthYearThreshold = searchParams.get("birthYearThreshold");

  try {
    let memberList;

    // Build the query based on `for` parameter value
    switch (forType) {
      case "selectMember":
        memberList = await prisma.member.findMany({
          select: {
            id: true,
            name: true,
            gender: true,
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
        break;

      case "selectFather":
        memberList = await prisma.member.findMany({
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
        break;

      case "selectMother":
        memberList = await prisma.member.findMany({
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
        break;

      case "selectPartner":
        // if (!birthYearThreshold) {
        //   return NextResponse.json({ error: "birthYearThreshold is required for selectChildren" }, { status: 400 });
        // }
        memberList = await prisma.member.findMany({
          // where: {
          //   birthYear: { gte: Number(birthYearThreshold) },
          // },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
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
        break;

      case "selectChildren":
        // if (!birthYearThreshold) {
        //   return NextResponse.json({ error: "birthYearThreshold is required for selectChildren" }, { status: 400 });
        // }
        memberList = await prisma.member.findMany({
          // where: {
          //   birthYear: { gte: Number(birthYearThreshold) },
          // },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
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
        break;

      default:
        // Default case if `forType` is not recognized
        return NextResponse.json({ error: "Invalid 'for' parameter" }, { status: 400 });
    }

    return NextResponse.json(memberList);
  } catch (error) {
    console.error("Error fetching memberList:", error);
    return NextResponse.json({ error: "Error fetching memberList" }, { status: 500 });
  }
}


