import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function GET(request: Request, context: any) {
    const { params } = context;
    const month = parseInt(params.month);
    console.log("month.................", month)
    if (!month) {
      return NextResponse.json({ error: "Month is required and should be a valid number." });
    }

    try {
      // Step 1: Fetch data from Prisma
      const data = await prisma.user.findMany({
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
      const eventDates = data.flatMap((user) => {
        const events: any[] = [];

        // Check if the birthday is in the specified month
        if (user.birthMonth === month) {
          events.push({
            id: user.id,
            name: user.name,
            birthday: getDateFromParts(user.birthYear, user.birthMonth, user.birthDate),
          });
        }

        // Check if the deathday is in the specified month
        if (user.deathMonth === month) {
          events.push({
            id: user.id,
            name: user.name,
            deathday: getDateFromParts(user.deathYear, user.deathMonth, user.deathDate),
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



// // export async function POST(request: Request, context: any) {
// //     const { params } = context;
// //     // const users = data.filter((x) => params.userId === x.id.toString());
// //     const data = await request.json()
// //     return NextResponse.json({
// //         data,
// //     })
// // }

// // pages/api/calendar-events.js

// export async function POST(request: Request) {
//   const { month } = await request.json();

//   if (month === undefined || month === null) {
//     return NextResponse.json({ error: "Month is required." });
//   }

//   try {
//     // Step 1: Fetch data from Prisma
//     const data = await prisma.user.findMany({
//       select: {
//         id: true,
//         name: true,
//         birthday: true,
//         deathday: true,
//       },
//     });

//     // Step 2: Filter for events in the specified month
//     const eventDates = data.flatMap((user) => {
//       const events = [];

//       // Check if the birthday is in the specified month
//       if (user.birthday && new Date(user.birthday).getMonth() === month) {
//         events.push({
//           id: user.id,
//           name: user.name,
//           birthday: user.birthday,  // Use a common key like "date" for both event types
//         });
//       }

//       // Check if the deathday is in the specified month
//       if (user.deathday && new Date(user.deathday).getMonth() === month) {
//         events.push({
//           id: user.id,
//           name: user.name,
//           deathday: user.deathday,   // Use the same key for consistency
//         });
//       }

//       return events;
//     });

//     return NextResponse.json({ eventDates });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to fetch data" });
//   }
// }

