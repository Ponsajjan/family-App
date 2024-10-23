// import prisma from "@/db/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const users = await prisma.user.findMany({
//     select: {
//       id: true,
//       name: true,
//       contactNumber: true,
//       currentLocation: true,
//     },
//     orderBy: { name: "asc" },
//   });

//   console.log(users)
//   return NextResponse.json(users);
// }
