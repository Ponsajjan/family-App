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
          birthDate: true,
          birthMonth: true,
          birthYear: true,
          deathDate: true,
          deathMonth: true,
          deathYear: true,
          address: true,
          additionalInfo: true,
          children: true,
          deceased: true,
          descendant: true,
          education: true,
          father: true,
          mother: true,
          occupation: true,
          partner: true,
          phoneNumber: true,
        },
      });

      return NextResponse.json({ data });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch data" });
    }
}
