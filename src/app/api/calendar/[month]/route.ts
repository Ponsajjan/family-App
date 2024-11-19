import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function GET(request: Request, context: any) {
    // const { params } = await context;
    // const month = parseInt(params.month);

    const url = new URL(request.url);
    const month = parseInt(url.pathname.split('/').pop() || '');
    
    // console.log("month.................", month)
    if (!month) {
      return NextResponse.json({ error: "Month is required and should be a valid number." });
    }

    try {
      // Step 1: Fetch data from Prisma
      const data = await prisma.member.findMany({
        where: {
          OR: [
            { birthMonth: month },
            { deathMonth: month }
          ]
        },
        select: {
          id: true,
          name: true,
          birthDate: true,
          birthMonth: true,
          birthYear: true,
          deathDate: true,
          deathMonth: true,
          deathYear: true,
        },
      });

      // Helper function to create ISO date string
      const getDateFromParts = (year: number | null, month: number, day: number | null) => {
        if (month && day) {
          return new Date(year ?? 1111, month - 1, day).toISOString(); // Default year if missing
        }
        return null;
      };

      // Step 2: Filter for events in the specified month
      const eventDates = data.flatMap((member) => {
        const events: any[] = [];

        // Check if the birthday is in the specified month
        if (member.birthMonth === month) {
          events.push({
            id: member.id,
            name: member.name,
            birthday: getDateFromParts(member.birthYear, member.birthMonth, member.birthDate),
          });
        }

        // Check if the deathday is in the specified month
        if (member.deathMonth === month) {
          events.push({
            id: member.id,
            name: member.name,
            deathday: getDateFromParts(member.deathYear, member.deathMonth, member.deathDate),
          });
        }

        return events;
      });

      return NextResponse.json({ eventDates });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch data" });
    }
}
