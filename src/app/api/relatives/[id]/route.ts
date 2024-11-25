import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function GET(request: Request, context: any) {
    // const { params } = await context;
    // const month = parseInt(params.month);

    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');
    
    // console.log("month.................", month)
    if (!id) {
      return NextResponse.json({ error: "Member ID is required and should be a valid number." });
    }

    try {
      // Step 1: Fetch data from Prisma
      const data = await prisma.member.findMany({
        where: {
          id : id,
        },
        select: {
          id: true,
          name: true,
          gender: true,
          phoneNumber: true,
          address: true,
          occupation: true,
          education: true,
          birthDate: true,
          birthMonth: true,
          birthYear: true,
          deceased: true,
          deathDate: true,
          deathMonth: true,
          deathYear: true,
          additionalInfo: true,
          // children: true,
          descendant: true,
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
      });

      return NextResponse.json({ data });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch data" });
    }
}
