import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function GET(request: Request, context: { params: { month: string; date: string } }) {
  const { month, date } = await context.params;

  // Validate month and date
  const monthInt = parseInt(month, 10);
  const dateInt = parseInt(date, 10);

  if (isNaN(monthInt) || isNaN(dateInt)) {
    return NextResponse.json({ error: "Month and date must be valid numbers." }, { status: 400 });
  }

  try {
    // Fetch data from Prisma
    const data = await prisma.member.findMany({
      where: {
        OR: [
          {
            birthMonth: monthInt,
            birthDate: dateInt,
          },
          {
            deathMonth: monthInt,
            deathDate: dateInt,
          },
        ],
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
        return new Date(year ?? 1900, month - 1, day).toISOString(); // Default year if missing
      }
      return null;
    };

    // Filter and format data
    const eventDates = data.flatMap((member) => {
      const events: any[] = [];

      // Check if the birthday is in the specified month and date
      if (member.birthMonth === monthInt && member.birthDate === dateInt) {
        events.push({
          id: member.id,
          name: member.name,
          birthday: getDateFromParts(member.birthYear, member.birthMonth, member.birthDate),
        });
      }

      // Check if the deathday is in the specified month and date
      if (member.deathMonth === monthInt && member.deathDate === dateInt) {
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
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
