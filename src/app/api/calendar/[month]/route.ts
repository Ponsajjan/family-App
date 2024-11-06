import { NextResponse } from "next/server"
import prisma from "@/db/db"; // Adjust the import path as needed

export async function POST(request: Request, context: any) {
    const { params } = context;
    const month  = params.month;
  
    if (month === undefined || month === null) {
      return NextResponse.json({ error: "Year and month are required." });
    }
  
    try {
      // Step 1: Fetch data from Prisma
      const data = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          birthday: true,
          deathday: true,
        },
    });
  
// Step 2: Filter for events in the specified month
const eventDates = data.flatMap((user) => {
  const events = [];

  // Check if the birthday is in the specified month
  if (user.birthday && new Date(user.birthday).getMonth() === month) {
    events.push({
      id: user.id,
      name: user.name,
      birthday: user.birthday,  // Use a common key like "date" for both event types
    });
  }

  // Check if the deathday is in the specified month
  if (user.deathday && new Date(user.deathday).getMonth() === month) {
    events.push({
      id: user.id,
      name: user.name,
      deathday: user.deathday,   // Use the same key for consistency
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


// export async function POST(request: Request, context: any) {
//     const { params } = context;
//     // const users = data.filter((x) => params.userId === x.id.toString());
//     const data = await request.json()
//     return NextResponse.json({
//         data,
//     })
// }

// pages/api/calendar-events.js



